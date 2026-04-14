import type { VercelRequest, VercelResponse } from '@vercel/node';
import { localidadesPontos } from '../src/data/localidadesPontos';

const ROUTES_MATRIX_URL = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

type RouteMatrixLine = {
  originIndex?: number;
  destinationIndex?: number;
  distanceMeters?: number;
  condition?: string;
  status?: { code?: number; message?: string };
};

function parseNdjsonStream(body: string): RouteMatrixLine[] {
  const lines = body.trim().split(/\n/).filter(Boolean);
  const out: RouteMatrixLine[] = [];
  for (const line of lines) {
    try {
      out.push(JSON.parse(line) as RouteMatrixLine);
    } catch {
      // ignore malformed chunks
    }
  }
  return out;
}

function parseMatrixResponseBody(body: string): RouteMatrixLine[] {
  const trimmed = body.trim();
  if (trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed) as RouteMatrixLine[];
    } catch {
      /* fall through */
    }
  }
  return parseNdjsonStream(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY nao configurada no servidor.' });
  }

  let body: { userLat?: unknown; userLng?: unknown };
  try {
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else if (req.body && typeof req.body === 'object') {
      body = req.body as { userLat?: unknown; userLng?: unknown };
    } else {
      body = {};
    }
  } catch {
    return res.status(400).json({ error: 'JSON invalido.' });
  }

  const userLat = Number(body?.userLat);
  const userLng = Number(body?.userLng);
  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return res.status(400).json({ error: 'userLat e userLng devem ser numeros validos.' });
  }
  if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
    return res.status(400).json({ error: 'Coordenadas fora do intervalo valido.' });
  }

  const origins = [
    {
      waypoint: {
        location: {
          latLng: { latitude: userLat, longitude: userLng },
        },
      },
    },
  ];

  const destinations = localidadesPontos.map((p) => ({
    waypoint: {
      location: {
        latLng: { latitude: p.lat, longitude: p.lng },
      },
    },
  }));

  const requestBody = {
    origins,
    destinations,
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_UNAWARE',
  };

  let gRes: Response;
  try {
    gRes = await fetch(ROUTES_MATRIX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,status,condition,distanceMeters',
      },
      body: JSON.stringify(requestBody),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch failed';
    return res.status(502).json({ error: `Falha ao contactar Google Routes: ${msg}` });
  }

  const text = await gRes.text();
  if (!gRes.ok) {
    return res.status(502).json({
      error: 'Google Routes retornou erro.',
      details: text.slice(0, 500),
    });
  }

  const elements = parseMatrixResponseBody(text);
  const byDest = new Map<number, number>();

  for (const el of elements) {
    if (el.destinationIndex == null || el.distanceMeters == null) continue;
    const code = el.status?.code;
    if (code !== undefined && code !== 0) continue;
    if (el.condition === 'ROUTE_NOT_FOUND') continue;
    byDest.set(el.destinationIndex, el.distanceMeters);
  }

  const distances = localidadesPontos.map((_, index) => ({
    index,
    meters: byDest.get(index) ?? null,
  }));

  distances.sort((a, b) => {
    if (a.meters != null && b.meters != null) return a.meters - b.meters;
    if (a.meters != null) return -1;
    if (b.meters != null) return 1;
    return a.index - b.index;
  });

  return res.status(200).json({ distances });
}
