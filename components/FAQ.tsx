'use client';

import React, { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string[];
};

const faqItems: FAQItem[] = [
  {
    question: 'Como vou receber o material?',
    answer: [
      'Após a confirmação do pagamento, o acesso aos materiais é enviado para o e-mail informado na compra.',
      'Você também pode ser redirecionado para a área de membros ao concluir o pagamento e retornar à tela em que o Pix foi gerado.',
    ],
  },
  {
    question: 'Posso acessar o material logo após o pagamento?',
    answer: [
      'Sim. Assim que o pagamento for confirmado, você poderá receber o acesso por e-mail ou ser direcionado para a área de membros, onde encontrará os links dos materiais.',
    ],
  },
  {
    question: 'Fiz o pagamento por Pix. Onde encontro o acesso?',
    answer: [
      'Depois de realizar o pagamento, retorne à tela em que o Pix foi gerado.',
      'Após a confirmação, você poderá ser redirecionado para a área de membros. De qualquer forma, o acesso também será enviado para o e-mail informado na compra.',
    ],
  },
  {
    question: 'Posso abrir pelo celular?',
    answer: ['Sim. Os materiais podem ser acessados pelo celular, computador ou tablet.'],
  },
  {
    question: 'Posso imprimir o material?',
    answer: [
      'Sim. Os materiais estão em formato A4 e foram preparados para impressão.',
      'Você pode consultá-los digitalmente ou imprimir as páginas que preferir para usar durante seus treinos.',
    ],
  },
  {
    question: 'O Mapa do Degradê Sem Marca é um curso em vídeo?',
    answer: [
      'Não. Ele é um guia visual digital, criado para facilitar a consulta de marcações, pentes, alturas, pontos de transição e acabamento.',
    ],
  },
  {
    question: 'O material serve para quem está começando?',
    answer: [
      'Sim. Ele foi pensado para barbeiros iniciantes e para quem já corta, mas ainda encontra dificuldade para entender onde a marca começa e o que revisar antes de corrigir.',
    ],
  },
  {
    question: 'Ele ensina barbearia do zero?',
    answer: [
      'Não. O Mapa não substitui uma formação completa de barbearia. O foco é ajudar você a compreender melhor a construção e a revisão do degradê.',
    ],
  },
  {
    question: 'Qual é a diferença entre o guia principal e o Kit Completo?',
    answer: [
      'A opção de R$ 19,90 inclui apenas o guia visual Mapa do Degradê Sem Marca.',
      'O Kit Completo, por R$ 29,90, inclui o guia principal e mais 5 bônus para consulta, revisão, identificação de erros, referências de fade e acabamento.',
    ],
  },
  {
    question: 'Os 5 bônus estão inclusos na opção de R$ 19,90?',
    answer: ['Não. Os bônus são exclusivos do Kit Completo.'],
  },
  {
    question: 'O que está incluso no Kit Completo?',
    answer: [
      'Você recebe o Mapa do Degradê Sem Marca, a Tabela dos Pentes e Alturas, o Checklist do Corte Sem Marca, o Guia dos 7 Erros que Estragam o Degradê, o Pack de Referências Essenciais de Fade e o Mini Guia de Acabamento Profissional.',
    ],
  },
  {
    question: 'O acesso ao Kit Completo é vitalício?',
    answer: [
      'Sim. No Kit Completo, o acesso aos materiais é vitalício e inclui as futuras atualizações disponibilizadas.',
    ],
  },
  {
    question: 'Como funciona a garantia de 7 dias?',
    answer: [
      'Você pode acessar e conhecer o material. Caso decida que ele não faz sentido para você, solicite o reembolso dentro do prazo de 7 dias.',
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      data-track-section="faq"
      data-track-order="13"
      data-track-title="13 - FAQ"
    >
      <style>{`
        #faq {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow-x: clip;
          box-sizing: border-box;
          padding: 76px 18px 84px;
          background: #F7F1E8;
          color: #100F0D;
          border-bottom: 1px solid rgba(16, 15, 13, 0.1);
        }
        #faq *,
        #faq *::before,
        #faq *::after {
          box-sizing: border-box;
        }
        #faq .faq-shell {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
        }
        #faq .faq-header {
          max-width: 700px;
          margin: 0 auto 34px;
          text-align: center;
        }
        #faq .faq-kicker {
          width: 56px;
          height: 3px;
          margin: 0 auto 18px;
          border-radius: 999px;
          background: #D8A64A;
        }
        #faq .faq-title {
          margin: 0;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.25rem, 10vw, 5.25rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: 0;
          text-transform: uppercase;
          color: #100F0D;
        }
        #faq .faq-subtitle {
          max-width: 560px;
          margin: 16px auto 0;
          color: #51473C;
          font-size: 0.98rem;
          line-height: 1.45;
          font-weight: 650;
        }
        #faq .faq-list {
          border-top: 1px solid rgba(16, 15, 13, 0.16);
        }
        #faq .faq-item {
          border-bottom: 1px solid rgba(16, 15, 13, 0.16);
        }
        #faq .faq-button {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          width: 100%;
          min-height: 64px;
          padding: 20px 0;
          border: 0;
          background: transparent;
          color: #100F0D;
          text-align: left;
          cursor: pointer;
        }
        #faq .faq-button:focus-visible {
          outline: 3px solid rgba(216, 166, 74, 0.7);
          outline-offset: 5px;
          border-radius: 4px;
        }
        #faq .faq-question {
          font-size: clamp(0.96rem, 4vw, 1.14rem);
          line-height: 1.25;
          font-weight: 900;
        }
        #faq .faq-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(216, 166, 74, 0.55);
          color: #9D721C;
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1;
        }
        #faq .faq-answer {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transform: translateY(-4px);
          transition: max-height 220ms ease, opacity 180ms ease, transform 180ms ease;
        }
        #faq .faq-answer.is-open {
          max-height: 420px;
          opacity: 1;
          transform: translateY(0);
        }
        #faq .faq-answer-inner {
          max-width: 720px;
          padding: 0 42px 22px 0;
          color: #4D4236;
          font-size: 0.96rem;
          line-height: 1.55;
          font-weight: 600;
        }
        #faq .faq-answer-inner p {
          margin: 0 0 12px;
        }
        #faq .faq-answer-inner p:last-child {
          margin-bottom: 0;
        }
        @media (min-width: 768px) {
          #faq {
            padding: 96px 28px 104px;
          }
          #faq .faq-header {
            margin-bottom: 46px;
          }
          #faq .faq-button {
            padding: 23px 0;
          }
          #faq .faq-answer-inner {
            font-size: 1rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #faq .faq-answer {
            transition: none;
            transform: none;
          }
        }
      `}</style>

      <div className="faq-shell">
        <div className="faq-header">
          <div className="faq-kicker" aria-hidden="true" />
          <h2 id="faq-title" className="faq-title">
            AINDA FICOU COM ALGUMA DÚVIDA?
          </h2>
          <p className="faq-subtitle">
            Veja as respostas para as dúvidas mais comuns antes de escolher seu acesso.
          </p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index + 1}`;
            const buttonId = `faq-question-${index + 1}`;

            return (
              <div className="faq-item" key={item.question}>
                <button
                  id={buttonId}
                  type="button"
                  className="faq-button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={answerId}
                  className={`faq-answer${isOpen ? ' is-open' : ''}`}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                >
                  {isOpen && (
                    <div className="faq-answer-inner">
                      {item.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
