'use client';

import React, { useState } from 'react';
import { Mail, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackInternalCta } from '@/lib/trackInternalCta';

type ModalType = 'termos' | 'privacidade' | 'reembolso' | null;

export default function Rodape() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleScrollToOffer = () => {
    trackInternalCta({
      ctaLabel: 'CTA Rodapé',
      buttonLocation: 'rodape',
      sourceSectionId: 'rodape',
      sourceSectionTitle: '14 - Rodape',
      sourceSectionOrder: 14,
      sessionId: typeof window !== 'undefined' ? (sessionStorage.getItem('mapa_degrade_session_id') || '') : '',
      utms: typeof window !== 'undefined' ? { utmSource: new URLSearchParams(window.location.search).get('utm_source')||undefined, utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign')||undefined } : {},
    });
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="rodape" className="relative" style={{ background: '#0B0704' }}>

      {/* ── CTA FINAL ───────────────────────────────── */}
      <div
        className="py-20 px-5 text-center relative texture-brick"
        style={{ borderBottom: '1px solid #3A1D10' }}
      >
        {/* Top copper line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent, #F28A1A 35%, #D8A64A 65%, transparent)' }} />

        <div className="max-w-md mx-auto">
          <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-4">
            Comece a entender o que está deixando seu degradê marcado
          </h2>
          <p className="text-xs text-[#D9C3A3] mb-8 leading-relaxed">
            Acesse o Mapa do Degradê Sem Marca e tenha um material visual para consultar,
            treinar e revisar seus cortes com mais clareza.
          </p>
          <button
            onClick={handleScrollToOffer}
            className="w-full py-4 px-6 text-sm font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display"
            style={{ background: '#F28A1A', color: '#0B0704' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#D87512')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F28A1A')}
          >
            Quero acessar o Mapa agora
          </button>
          <p className="text-[10px] text-[#B8A688] mt-3 font-semibold">
            ⚡ Liberação imediata após aprovação no Pix ou Cartão.
          </p>
        </div>
      </div>

      {/* ── INSTITUTIONAL ──────────────────────────── */}
      <div className="py-12 px-5 text-center text-[#C9B89A]">
        <div className="max-w-md mx-auto space-y-6">

          <div className="space-y-1">
            <p className="text-sm font-black text-[#FFF4E6] uppercase tracking-wider font-display">
              MAPA DO DEGRADÊ <span style={{ color: '#F28A1A' }}>SEM MARCA</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest font-mono text-[#B8A688]">
              Guia Prático de Bancada para Barbeiros
            </p>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center gap-1 text-xs">
            <div className="flex items-center gap-2 text-[#D9C3A3]">
              <Mail size={14} style={{ color: '#F28A1A' }} />
              <span className="font-bold text-[#C9B89A]">E-mail de Suporte:</span>
            </div>
            <a href="mailto:suporte@mapadodegrade.com.br" className="font-mono hover:underline" style={{ color: '#F28A1A' }}>
              suporte@mapadodegrade.com.br
            </a>
          </div>

          {/* Legal links */}
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-[10px] font-extrabold uppercase tracking-wider text-[#C9B89A]">
            {(['termos', 'privacidade', 'reembolso'] as const).map((key, idx, arr) => (
              <React.Fragment key={key}>
                <button
                  onClick={() => setActiveModal(key)}
                  className="hover:text-[#FFF4E6] cursor-pointer transition-colors"
                >
                  {key === 'termos' ? 'Termos de Uso' : key === 'privacidade' ? 'Políticas de Privacidade' : 'Política de Reembolso'}
                </button>
                {idx < arr.length - 1 && <span style={{ color: '#3A1D10' }}>•</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Legal notice */}
          <div className="pt-6 space-y-3" style={{ borderTop: '1px solid #3A1D10' }}>
            <p className="text-[9px] text-[#A89678] uppercase tracking-widest font-mono">
              PRODUTO 100% DIGITAL
            </p>
            <p className="text-[10px] text-[#B8A688] leading-relaxed max-w-sm mx-auto">
              Este produto é um material digital de apoio para estudos e prática. Os resultados
              dependem da aplicação, treino e evolução individual de cada pessoa.
            </p>
            <p className="text-[9px] text-[#A89678] font-mono">
              © {new Date().getFullYear()} Mapa do Degradê Sem Marca. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(11,7,4,0.9)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
              style={{ background: '#160D08', border: '1px solid #5A321C' }}
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center" style={{ background: '#2A130B', borderBottom: '1px solid #5A321C' }}>
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: '#F28A1A' }} />
                  <span className="text-xs font-black uppercase tracking-wider text-[#FFF4E6] font-display">
                    {activeModal === 'termos' ? 'Termos de Uso' : activeModal === 'privacidade' ? 'Políticas de Privacidade' : 'Política de Reembolso'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded cursor-pointer transition-colors"
                  style={{ color: '#D9C3A3', border: '1px solid #5A321C', background: '#160D08' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 text-xs text-[#D9C3A3] leading-relaxed space-y-4 overflow-y-auto">
                {activeModal === 'termos' && (
                  <>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">1. Termos de Serviço</p>
                    <p>Ao acessar e adquirir o material digital &ldquo;Mapa do Degradê Sem Marca&rdquo;, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">2. Licença de Uso Individual</p>
                    <p>O acesso ao Ebook e aos guias bônus é estritamente pessoal e intransferível. É expressamente proibida a redistribuição, revenda ou compartilhamento parcial ou total deste material digital.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">3. Responsabilidade Prática</p>
                    <p>O material destina-se ao estudo teórico e prático de técnicas de degradê. Os resultados dependem do seu nível de treino individual e aplicação prática constante.</p>
                  </>
                )}
                {activeModal === 'privacidade' && (
                  <>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">1. Coleta de Informações</p>
                    <p>Suas informações de cadastro fornecidas no ato de pagamento são coletadas de forma estritamente confidencial pelo nosso processador oficial de pagamentos.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">2. Uso de Dados para Acesso</p>
                    <p>Seu endereço de e-mail é utilizado unicamente para enviar os dados de login ou o arquivo do guia adquirido, além de comunicados relacionados ao produto.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">3. Segurança dos Dados</p>
                    <p>Seus dados cadastrais não são compartilhados com terceiros. Nossas conexões com gateways de checkout utilizam criptografia de segurança avançada.</p>
                  </>
                )}
                {activeModal === 'reembolso' && (
                  <>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">1. Garantia Legal de Reembolso</p>
                    <p>Oferecemos uma política incondicional de reembolso válida por até 7 dias corridos contados a partir da data de confirmação da compra.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">2. Processo de Solicitação</p>
                    <p>Você pode solicitar o estorno integral enviando uma mensagem ao nosso email oficial de suporte dentro dos 7 dias.</p>
                    <p className="font-extrabold text-[#FFF4E6] text-xs uppercase font-display tracking-wider">3. Estorno do Pagamento</p>
                    <p>O reembolso será efetuado pelo mesmo método de pagamento utilizado na compra, sem taxas extras ou burocracia desnecessária.</p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 text-center" style={{ background: '#2A130B', borderTop: '1px solid #5A321C' }}>
                <button
                  onClick={() => setActiveModal(null)}
                  className="py-2 px-6 text-[10px] font-black uppercase rounded-lg cursor-pointer font-display transition-all duration-150"
                  style={{ background: '#F28A1A', color: '#0B0704' }}
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
