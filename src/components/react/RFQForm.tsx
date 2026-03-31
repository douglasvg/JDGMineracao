import * as Label from '@radix-ui/react-label';
import { User, Building2 } from 'lucide-react';

export default function RFQForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this to your backend
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Solicitação enviada com sucesso. Entraremos em contato em até 24 horas.');
    form.reset();
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="" disabled selected>
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
        <button
          type="submit"
          className="w-full bg-[#393e92] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#2e3275] transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Enviar Solicitação</span>
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

