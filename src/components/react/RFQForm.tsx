import * as Label from '@radix-ui/react-label';
import { User, Building2 } from 'lucide-react';
import { useState } from 'react';

const SAND_LABELS: Record<string, string> = {
  'areia-fina': 'Areia Fina',
  'areia-media': 'Areia Média',
  'areia-grossa': 'Areia Grossa',
  'mais-de-um-tipo': 'Mais de um tipo (consultar)',
};

export default function RFQForm() {
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY as string | undefined;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!accessKey?.trim()) {
      setStatus('error');
      setErrorMessage(
        'Formulário ainda não configurado. Defina PUBLIC_WEB3FORMS_ACCESS_KEY no ambiente (veja .env.example).',
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const sandType = String(formData.get('sandType') ?? '');
    const message = String(formData.get('message') ?? '').trim();

    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey.trim(),
          subject: 'Nova solicitação de orçamento — JDG Mineração',
          // from_name só afeta o cabeçalho do remetente; não lista nos detalhes do e-mail
          from_name: fullName || 'Site',
          nome_completo: fullName,
          email,
          replyto: email,
          phone,
          cidade_obra: city,
          tipo_areia: SAND_LABELS[sandType] ?? sandType,
          mensagem: message || '(sem mensagem adicional)',
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Falha ao enviar.');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage('Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.');
    }
  };

  return (
    <form className="space-y-6" id="rfq-form" onSubmit={handleSubmit} name="rfq-form">
      {/* Contact Information */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#393e92] flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Informações de Contato
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome completo <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Seu nome"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefone/WhatsApp <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(00) 00000-0000"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-mail <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com.br"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cidade/Obra <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Cidade onde será a obra"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Detalhes da Solicitação
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="sandType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de areia <span className="text-red-500">*</span>
            </Label.Root>
            <select
              id="sandType"
              name="sandType"
              required
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="" disabled>
                Selecione o tipo de areia
              </option>
              <option value="areia-fina">Areia Fina</option>
              <option value="areia-media">Areia Média</option>
              <option value="areia-grossa">Areia Grossa</option>
              <option value="mais-de-um-tipo">Mais de um tipo (consultar)</option>
            </select>
          </div>
          <div>
            <div className="h-full" />
          </div>
        </div>
      </div>

      {/* Service Requirements */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-6">
          <div>
            <Label.Root
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mensagem
            </Label.Root>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Descreva sua necessidade, volume estimado, prazo, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        {status === 'success' && (
          <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Solicitação enviada com sucesso. Entraremos em contato em até 24 horas.
          </p>
        )}
        {status === 'error' && errorMessage && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-[#393e92] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#2e3275] transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          <span>{status === 'sending' ? 'Enviando…' : 'Enviar Solicitação'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Preencha seus dados e nossa equipe retornará com o orçamento.
        </p>
      </div>
    </form>
  );
}

