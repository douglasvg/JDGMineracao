import { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Check,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';

type Vaga = {
  id: number;
  titulo: string;
  area: string;
  tipo: string;
  local: string;
  cor: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
};

const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbw9YXo3kmfM9N2romYNiGIroRxB6EMk7bXHfayNvEoQfap6nqBvn7mRBvtPIhWK-VGNGQ/exec';
const BANCO_DE_TALENTOS = 'Banco de Talentos';

const vagas: Vaga[] = [
  {
    id: 1,
    titulo: 'Operador de Máquinas',
    area: 'Operações',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#393e92',
    descricao: 'Responsável pela operação de equipamentos de mineração e escavação.',
    requisitos: [
      'CNH categoria B ou superior',
      'Experiência com máquinas pesadas',
      'Disponibilidade para trabalho em campo',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Plano de saúde'],
  },
  {
    id: 2,
    titulo: 'Motorista',
    area: 'Logística',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#C9922A',
    descricao: 'Transporte de materiais entre unidades e clientes da empresa.',
    requisitos: [
      'CNH categoria C ou D',
      'Experiência com caminhão',
      'Conhecimento da região',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Plano de saúde'],
  },
  {
    id: 3,
    titulo: 'Auxiliar de Mineração',
    area: 'Operações',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#393e92',
    descricao: 'Suporte às operações de extração e processamento de areia.',
    requisitos: [
      'Ensino médio completo',
      'Disponibilidade para trabalho externo',
      'Experiência em construção civil (diferencial)',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Plano de saúde'],
  },
  {
    id: 4,
    titulo: 'Vendedor / Comercial',
    area: 'Comercial',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#C9922A',
    descricao: 'Prospecção e atendimento de clientes do setor de construção civil.',
    requisitos: [
      'Experiência com vendas B2B',
      'CNH categoria B',
      'Habilidade com negociação',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Comissão por vendas'],
  },
  {
    id: 5,
    titulo: 'Administrativo',
    area: 'Administrativo',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#393e92',
    descricao: 'Suporte às rotinas administrativas, financeiras e de atendimento da empresa.',
    requisitos: [
      'Ensino médio completo',
      'Conhecimento em pacote Office',
      'Organização e proatividade',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Plano de saúde'],
  },
  {
    id: 6,
    titulo: 'Técnico de Segurança',
    area: 'Segurança',
    tipo: 'CLT',
    local: 'União da Vitória – PR',
    cor: '#C9922A',
    descricao: 'Responsável pela segurança do trabalho nas operações de mineração.',
    requisitos: [
      'Curso técnico em segurança do trabalho',
      'Experiência em ambiente industrial',
      'CREA ou registro no MTE',
    ],
    beneficios: ['Vale alimentação', 'Vale transporte', 'Plano de saúde'],
  },
];

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  vaga: string;
  mensagem: string;
};

const initialFormState: FormState = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  vaga: '',
  mensagem: '',
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível ler o arquivo.'));
    };

    reader.onerror = () => reject(new Error('Falha ao processar o currículo.'));
    reader.readAsDataURL(file);
  });
}

export default function TrabalheConosco() {
  const [open, setOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<string>(vagas[0].titulo);
  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    vaga: vagas[0].titulo,
  });
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const vagaAtual = useMemo(
    () => vagas.find((vaga) => vaga.titulo === selectedVaga) ?? null,
    [selectedVaga]
  );

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setEnviado(false);
      setErro('');
      setCurriculo(null);
      setSelectedVaga(vagas[0].titulo);
      setFormData({
        ...initialFormState,
        vaga: vagas[0].titulo,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const openModal = (vaga: string) => {
    setSelectedVaga(vaga);
    setFormData((current) => ({
      ...current,
      vaga,
    }));
    setErro('');
    setEnviado(false);
    setOpen(true);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === 'vaga') {
      setSelectedVaga(value);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.type !== 'application/pdf') {
      setErro('Envie o currículo em PDF.');
      event.target.value = '';
      setCurriculo(null);
      return;
    }

    setErro('');
    setCurriculo(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!curriculo) {
      setErro('Anexe seu currículo em PDF para continuar.');
      return;
    }

    setSubmitting(true);
    setErro('');
    setEnviado(false);

    try {
      const base64 = await fileToBase64(curriculo);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);

      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cidade: formData.cidade,
          vaga: formData.vaga,
          mensagem: formData.mensagem,
          curriculo: base64,
          nomeArquivo: curriculo.name,
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeout);

      const rawBody = await response.text();
      let result: { success?: boolean; error?: string } = {};

      try {
        result = rawBody ? (JSON.parse(rawBody) as { success?: boolean; error?: string }) : {};
      } catch {
        console.error('Resposta não JSON do Apps Script:', {
          status: response.status,
          body: rawBody,
        });
      }

      if (!response.ok) {
        throw new Error('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
      }

      if (!result.success) {
        console.error('Apps Script retornou erro:', result);
        throw new Error('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
      }

      setEnviado(true);
      setFormData({
        ...initialFormState,
        vaga: formData.vaga,
      });
      setCurriculo(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setErro('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
      } else {
        setErro('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const vagasSelect = [...vagas.map((vaga) => vaga.titulo), BANCO_DE_TALENTOS];

  return (
    <>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex rounded-full bg-[#eeeef7] px-4 py-2 text-sm font-semibold text-[#393e92]">
              Oportunidades
            </span>
            <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">Vagas Abertas</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vagas.map((vaga) => (
              <article
                key={vaga.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ borderTopWidth: '4px', borderTopColor: vaga.cor }}
              >
                <span
                  className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: vaga.cor === '#393e92' ? '#eeeef7' : '#fef3e2',
                    color: vaga.cor,
                  }}
                >
                  {vaga.area}
                </span>

                <h3 className="mt-5 text-2xl font-bold text-slate-900">{vaga.titulo}</h3>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                      <BriefcaseBusiness className="h-4 w-4" />
                    </div>
                    <span>{vaga.tipo}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>{vaga.local}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openModal(vaga.titulo)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#393e92] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2e3275]"
                >
                  Ver Vaga e Candidatar
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Não encontrou sua vaga?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Envie seu currículo para nosso banco de talentos. Entraremos em contato quando surgir uma
            oportunidade.
          </p>
          <button
            type="button"
            onClick={() => openModal(BANCO_DE_TALENTOS)}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#393e92] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2e3275]"
          >
            Enviar Currículo Espontâneo
          </button>
        </div>
      </section>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl outline-none animate-fadeInUp">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-100"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-2"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="bg-slate-50 p-6 sm:p-8">
                <span
                  className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: vagaAtual?.cor === '#393e92' ? '#eeeef7' : '#fef3e2',
                    color: vagaAtual?.cor ?? '#393e92',
                  }}
                >
                  {vagaAtual?.area ?? 'Banco de Talentos'}
                </span>

                <h3 className="mt-5 text-3xl font-bold text-slate-900">{selectedVaga}</h3>
                {vagaAtual ? (
                  <p className="mt-6 text-base leading-7 text-slate-600">{vagaAtual.descricao}</p>
                ) : (
                  <p className="mt-6 text-base leading-7 text-slate-600">
                    Cadastre seu currículo no nosso banco de talentos para futuras oportunidades na
                    JDG Mineração.
                  </p>
                )}

                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900">Requisitos</h4>
                  <ul className="mt-4 space-y-3">
                    {(vagaAtual?.requisitos ?? [
                      'Perfil alinhado à área de interesse',
                      'Disponibilidade para participar de futuras seleções',
                      'Currículo atualizado em PDF',
                    ]).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-0.5 rounded-full bg-[#eeeef7] p-1 text-[#393e92]">
                          <Check className="h-4 w-4" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900">Benefícios</h4>
                  <ul className="mt-4 space-y-3">
                    {(vagaAtual?.beneficios ?? [
                      'Cadastro em banco de talentos',
                      'Contato para futuras vagas compatíveis',
                      'Confidencialidade no tratamento dos dados',
                    ]).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Candidatar-se</h3>
                  <p className="mt-2 text-slate-600">Preencha seus dados para enviar sua candidatura.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="nome" className="mb-2 block text-sm font-medium text-slate-700">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="mb-2 block text-sm font-medium text-slate-700">
                      Telefone/WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="cidade" className="mb-2 block text-sm font-medium text-slate-700">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="vaga" className="mb-2 block text-sm font-medium text-slate-700">
                      Vaga <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="vaga"
                      name="vaga"
                      required
                      value={formData.vaga}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    >
                      {vagasSelect.map((vaga) => (
                        <option key={vaga} value={vaga}>
                          {vaga}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="mb-2 block text-sm font-medium text-slate-700">
                      Mensagem / Por que quer a vaga
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-[#393e92] focus:outline-none focus:ring-2 focus:ring-[#393e92]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="curriculo" className="mb-2 block text-sm font-medium text-slate-700">
                      Currículo (PDF) <span className="text-red-500">*</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-4 text-slate-600 transition hover:border-[#393e92] hover:bg-[#eeeef7]/50">
                      <Upload className="h-5 w-5 text-[#393e92]" />
                      <span className="text-sm">
                        {curriculo ? curriculo.name : 'Selecione um arquivo PDF'}
                      </span>
                      <input
                        id="curriculo"
                        name="curriculo"
                        type="file"
                        accept=".pdf,application/pdf"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {erro ? <p className="text-sm font-medium text-red-600">{erro}</p> : null}
                  {enviado ? (
                    <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      Candidatura enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#393e92] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2e3275] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Candidatura'}
                  </button>

                  <p className="text-sm text-slate-500">
                    Seus dados serão tratados com confidencialidade.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
