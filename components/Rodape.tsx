'use client';

import React, { useState } from 'react';
import { Mail, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Rodape() {
  const [activeModal, setActiveModal] = useState<'termos' | 'privacidade' | 'reembolso' | null>(null);

  const handleScrollToOffer = () => {
    const offerSection = document.getElementById('oferta');
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="rodape" className="bg-[#0F1115] relative overflow-hidden">
      {/* ==================== CTA FINAL ==================== */}
      <div className="py-20 px-5 border-b border-[#2A2F38] bg-[#151820] relative z-10 text-center">
        <div className="max-w-md mx-auto">
          {/* Título */}
          <h2 className="text-xl md:text-2xl font-black text-[#F5F5F5] font-display uppercase tracking-tight leading-tight">
            Comece a entender o que está deixando seu degradê marcado
          </h2>

          {/* Texto descritivo */}
          <p className="text-xs md:text-sm text-[#B8BDC7] mt-3.5 leading-relaxed font-sans">
            Acesse o Mapa do Degradê Sem Marca e tenha um material visual para consultar, treinar e revisar seus cortes com mais clareza.
          </p>

          {/* Botão de conversão */}
          <div className="mt-8">
            <button 
              onClick={handleScrollToOffer}
              className="w-full py-4 px-6 bg-[#22C55E] text-[#0F1115] text-sm font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all cursor-pointer font-display tracking-wider"
            >
              Quero acessar o Mapa agora
            </button>
            <p className="text-[10px] text-[#B8BDC7]/40 mt-3 font-semibold">
              ⚡ Liberação imediata após aprovação no Pix ou Cartão.
            </p>
          </div>
        </div>
      </div>


      {/* ==================== INSTITUCIONAL / FOOTER ==================== */}
      <div className="py-12 px-5 bg-[#0F1115] text-center relative z-10 text-[#B8BDC7]/50">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Logo / Nome do produto */}
          <div className="space-y-1">
            <p className="text-sm font-black text-[#F5F5F5] uppercase tracking-wider font-display">
              MAPA DO DEGRADÊ <span className="text-[#22C55E]">SEM MARCA</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest font-mono text-[#B8BDC7]/40">
              Guia Prático de Bancada para Barbeiros
            </p>
          </div>

          {/* Suporte */}
          <div className="flex flex-col items-center justify-center gap-1 text-xs">
            <div className="flex items-center gap-2 text-[#B8BDC7]">
              <Mail size={14} className="text-[#22C55E]" />
              <span className="font-bold text-[#B8BDC7]/75">E-mail de Suporte:</span>
            </div>
            <a href="mailto:suporte@mapadodegrade.com.br" className="text-[#22C55E] hover:underline font-mono">
              suporte@mapadodegrade.com.br
            </a>
          </div>

          {/* Links Institucionais */}
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-[10px] font-extrabold uppercase tracking-wider text-[#B8BDC7]/60">
            <button onClick={() => setActiveModal('termos')} className="hover:text-[#F5F5F5] cursor-pointer transition-colors">
              Termos de Uso
            </button>
            <span className="text-[#2A2F38]">•</span>
            <button onClick={() => setActiveModal('privacidade')} className="hover:text-[#F5F5F5] cursor-pointer transition-colors">
              Políticas de Privacidade
            </button>
            <span className="text-[#2A2F38]">•</span>
            <button onClick={() => setActiveModal('reembolso')} className="hover:text-[#F5F5F5] cursor-pointer transition-colors">
              Política de Reembolso
            </button>
          </div>

          {/* Aviso Legal */}
          <div className="border-t border-[#2A2F38] pt-6 space-y-3">
            <p className="text-[9px] text-[#B8BDC7]/30 uppercase tracking-widest font-mono">
              PRODUTO 100% DIGITAL
            </p>
            <p className="text-[10px] text-[#B8BDC7]/40 leading-relaxed max-w-sm mx-auto font-sans">
              Este produto é um material digital de apoio para estudos e prática. Os resultados dependem da aplicação, treino e evolução individual de cada pessoa.
            </p>
            <p className="text-[9px] text-[#B8BDC7]/30 font-mono">
              © {new Date().getFullYear()} Mapa do Degradê Sem Marca. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>


      {/* ==================== MODAL OVERLAYS (POPUP LEGAL) ==================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1B1F27] border border-[#2A2F38] rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#2A2F38]/60 flex justify-between items-center bg-[#151820]">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#22C55E]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#F5F5F5] font-display">
                    {activeModal === 'termos' && 'Termos de Uso'}
                    {activeModal === 'privacidade' && 'Políticas de Privacidade'}
                    {activeModal === 'reembolso' && 'Política de Reembolso'}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 text-[#B8BDC7] hover:text-[#F5F5F5] rounded bg-[#151820] border border-[#2A2F38] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 text-xs text-[#B8BDC7] leading-relaxed space-y-4 font-sans overflow-y-auto">
                {activeModal === 'termos' && (
                  <>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">1. Termos de Serviço</p>
                    <p>Ao acessar e adquirir o material digital &ldquo;Mapa do Degradê Sem Marca&rdquo;, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">2. Licença de Uso Individual</p>
                    <p>O acesso ao PDF e aos guias bônus é estritamente pessoal e intransferível. É expressamente proibida a redistribuição, revenda, compartilhamento em redes sociais, compartilhamento em turmas de cursos ou duplicação parcial ou total deste material digital sem consentimento prévio formal.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">3. Responsabilidade Prática</p>
                    <p>O material destina-se ao estudo teórico e prático de técnicas de degradê de cabelo. Os resultados dependem do seu nível de treino individual e aplicação prática constante na bancada da barbearia.</p>
                  </>
                )}

                {activeModal === 'privacidade' && (
                  <>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">1. Coleta de Informações</p>
                    <p>Nós valorizamos muito a sua privacidade. Suas informações de cadastro fornecidas no ato de pagamento (como nome, email, telefone) são coletadas de forma estritamente confidencial pelo nosso processador oficial de pagamentos parceiro para liberação automatizada do material digital.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">2. Uso de Dados para Acesso</p>
                    <p>Seu endereço de e-mail é utilizado unicamente para enviar os dados de login ou o arquivo do guia adquirido, além de comunicados e atualizações relacionadas ao produto.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">3. Segurança dos Dados</p>
                    <p>Seus dados cadastrais não são compartilhados com terceiros sob hipótese alguma. Nossas conexões com gateways de checkout utilizam criptografia de segurança avançada.</p>
                  </>
                )}

                {activeModal === 'reembolso' && (
                  <>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">1. Garantia Legal de Reembolso</p>
                    <p>Oferecemos uma política incondicional de reembolso válida por até 15 dias corridos contados a partir da data de confirmação da compra do material.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">2. Processo de Solicitação</p>
                    <p>Caso ache que o conteúdo do Mapa do Degradê não faz sentido para o seu nível de estudos, você pode solicitar o estorno integral do valor pago enviando uma mensagem simples ao nosso email oficial de suporte dentro dos 15 dias.</p>
                    <p className="font-extrabold text-[#F5F5F5] text-xs uppercase font-display tracking-wider">3. Estorno do Pagamento</p>
                    <p>O reembolso será efetuado pelo mesmo método de pagamento utilizado na compra (via estorno no cartão ou Pix), sem taxas extras ou burocracia desnecessária.</p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#2A2F38]/60 bg-[#151820] text-center">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="py-2 px-5 bg-[#22C55E] text-[#0F1115] text-[10px] font-black uppercase rounded-lg cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
