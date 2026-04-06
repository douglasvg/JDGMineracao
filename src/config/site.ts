// Site configuration
export const SITE = {
  title: 'JDG Mineração',
  description: 'Liderando o setor de mineração de areia no sul do Brasil.',
  url: 'https://yourdomain.com',
  author: 'JDG Mineração',
} as const;

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Sobre Nós', href: '/sobre' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Localidades', href: '/localidades' },
  { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
  { name: 'Contato', href: '/contato' },
] as const;

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/yourcompany',
  twitter: 'https://twitter.com/yourcompany',
  facebook: 'https://facebook.com/yourcompany',
} as const;

/** E.164 sem + (ex: 5549999999999). */
export const WHATSAPP_E164 = '5542988158515';

/** Texto pré-preenchido ao abrir o WhatsApp (widget e CTAs). */
export const WHATSAPP_PREFILL =
  'Olá! Gostaria de mais informações sobre areia da JDG Mineração.';

export function whatsappUrl(prefillText?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  if (prefillText) {
    return `${base}?text=${encodeURIComponent(prefillText)}`;
  }
  return base;
}

