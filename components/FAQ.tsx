'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem { question: string; answer: string; }

const faqItems: FAQItem[] = [
  { question: 'Isso é um curso completo de barbearia?',  answer: 'Não. É um guia visual direto para ajudar com degradê, transição, pentes, marcação e acabamento.' },
  { question: 'Serve para barbeiro iniciante?',          answer: 'Sim. O material foi pensado para barbeiros iniciantes ou intermediários que já cortam ou estão treinando degradê.' },
  { question: 'O material é físico ou digital?',         answer: 'É digital. Você acessa pelo celular, computador ou tablet.' },
  { question: 'Como vou receber o acesso?',              answer: 'Após a confirmação da compra, você recebe as instruções de acesso ao material.' },
  { question: 'O pagamento é seguro?',                   answer: 'Sim. A compra é processada por uma plataforma segura de pagamento.' },
  { question: 'Quais formas de pagamento?',              answer: 'Você poderá pagar pelas formas disponíveis no checkout, como Pix e cartão, se estiverem habilitadas.' },
  { question: 'Preciso de uma máquina específica?',      answer: 'Não. O material trabalha a lógica de pentes, alturas, transições e acabamento. Você adapta ao equipamento que já usa.' },
  { question: 'Tem garantia?',                           answer: 'Sim. Você tem 15 dias de garantia.' },
  { question: 'Vou aprender todos os cortes masculinos?', answer: 'Não. O foco do material é degradê, transição e acabamento.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-20 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="p-2.5 rounded-full mb-3"
            style={{ background: 'rgba(242,138,26,0.1)', border: '1px solid rgba(242,138,26,0.25)' }}
          >
            <HelpCircle size={18} style={{ color: '#F28A1A' }} />
          </div>
          <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] text-center mb-2">
            Dúvidas Frequentes
          </h2>
          <p className="text-[10px] text-center text-[#C9B89A] uppercase font-mono tracking-widest">
            Perguntas de compra, acesso e suporte
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: '#160D08',
                  border: `1px solid ${isOpen ? '#F28A1A' : '#3A1D10'}`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 px-5 flex justify-between items-center text-left gap-4 cursor-pointer transition-colors duration-200"
                  style={{ background: isOpen ? 'rgba(242,138,26,0.04)' : 'transparent' }}
                >
                  <span
                    className="text-xs font-extrabold uppercase font-display tracking-wide transition-colors duration-200"
                    style={{ color: isOpen ? '#F28A1A' : '#FFF4E6' }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    style={{ color: '#F28A1A' }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                      style={{ borderTop: '1px solid #3A1D10' }}
                    >
                      <div className="p-5 text-xs text-[#D9C3A3] leading-relaxed" style={{ background: '#0B0704' }}>
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
