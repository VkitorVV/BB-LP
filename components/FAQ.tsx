'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'Isso é um curso completo de barbearia?',
      answer: 'Não. É um guia visual direto para ajudar com degradê, transição, pentes, marcação e acabamento.',
    },
    {
      question: 'Serve para barbeiro iniciante?',
      answer: 'Sim. O material foi pensado para barbeiros iniciantes ou intermediários que já cortam ou estão treinando degradê.',
    },
    {
      question: 'O material é físico ou digital?',
      answer: 'É digital. Você acessa pelo celular, computador ou tablet.',
    },
    {
      question: 'Como vou receber o acesso?',
      answer: 'Após a confirmação da compra, você recebe as instruções de acesso ao material.',
    },
    {
      question: 'O pagamento é seguro?',
      answer: 'Sim. A compra é processada por uma plataforma segura de pagamento.',
    },
    {
      question: 'Quais formas de pagamento?',
      answer: 'Você poderá pagar pelas formas disponíveis no checkout, como cartão e Pix, se estiverem habilitadas.',
    },
    {
      question: 'Preciso de uma máquina específica?',
      answer: 'Não. O material trabalha a lógica de pentes, alturas, transições e acabamento. Você adapta ao equipamento que já usa.',
    },
    {
      question: 'Tem garantia?',
      answer: 'Sim. Você tem 15 dias de garantia total de satisfação.',
    },
    {
      question: 'Vou aprender todos os cortes masculinos?',
      answer: 'Não. O foco do material é degradê, transição e acabamento. A proposta é ser específico e direto.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-2 bg-[#1B1F27] border border-[#2A2F38] rounded-full text-[#22C55E] mb-3">
            <HelpCircle size={18} />
          </div>
          <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight uppercase">
            Dúvidas Frequentes
          </h2>
          <p className="text-[10px] text-center text-[#B8BDC7]/50 mt-2 uppercase font-mono tracking-widest">
            Perguntas de compra, acesso e suporte
          </p>
        </div>

        {/* Lista de Acordeões */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-[#1B1F27] border border-[#2A2F38] rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Botão de Trigger */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full py-4.5 px-5 flex justify-between items-center text-left gap-4 hover:bg-[#2A2F38]/20 transition-all cursor-pointer"
                >
                  <span className={`text-xs font-extrabold uppercase transition-colors duration-200 font-display tracking-wide ${isOpen ? 'text-[#22C55E]' : 'text-[#F5F5F5]'}`}>
                    {item.question}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`text-[#22C55E] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                  />
                </button>

                {/* Conteúdo do Acordeão Animado */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[#2A2F38]/50"
                    >
                      <div className="p-5 text-xs text-[#B8BDC7] leading-relaxed font-sans bg-[#151820]/40">
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
