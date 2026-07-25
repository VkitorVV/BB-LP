'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import ClientTrackers from '@/components/ClientTrackers';
import {
  getCheckoutMeta,
  getOfferTrackingSection,
  getSessionId,
  getUtmParams,
} from '@/lib/clientTracking';
import { trackInternalCta } from '@/lib/trackInternalCta';
import type { CheckoutType } from '@/lib/trackingConfig';
import {
  Check,
  ShieldCheck,
  Target,
  Scale,
  Compass,
  Zap,
  Star,
  Grid,
  Scissors,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  X,
  Plus,
  HelpCircle,
  ExternalLink,
  Edit2
} from 'lucide-react';

// Custom technical sketch vector fallback drawings matching the "Mapa do Degradê" theme
interface BarberImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  type: 'capa' | 'zona-alta' | 'linha-base' | 'suavizacao' | 'pentes' | 'acabamento' | 'checklist' | 'erros' | 'prova' | 'pack';
}

function BarberImage({ src, alt, className = '', loading = 'lazy', priority = false, type }: BarberImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`relative flex flex-col items-center justify-center bg-[#0d0d0d] border border-dashed border-[#d6a84c]/40 text-[#f7f4ee] overflow-hidden select-none ${className}`} 
        style={{ minHeight: '180px' }}
      >
        {/* Blueprint-style grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(rgba(214,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(214,168,76,0.3) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }} 
        />
        
        {type === 'capa' && (
          <div className="text-center p-4 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#d6a84c] flex items-center justify-center mb-3 bg-[#13110c]">
              <span className="font-serif text-lg font-bold text-[#f0c86c] tracking-widest">MAPA</span>
            </div>
            <h4 className="font-black tracking-tighter text-xl text-white uppercase leading-none">DEGRADÊ SEM MARCA</h4>
            <div className="h-[2px] w-12 bg-[#d6a84c] my-2" />
            <p className="text-[10px] text-[#b8b3aa] tracking-widest uppercase">Guia Visual Premium</p>
          </div>
        )}

        {type === 'zona-alta' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20,80 C20,45 35,25 60,25 C80,25 90,45 90,65 C90,75 80,80 70,80" strokeLinecap="round" />
              {/* Shaded/shaded hair top part (Zona alta weight area) */}
              <path d="M42,27 Q58,35 78,35" stroke="#ff3939" strokeWidth="3" strokeDasharray="2 1" />
              <path d="M42,27 C50,23 60,23 70,26" stroke="#d6a84c" strokeWidth="1" />
              {/* Indicator arrow */}
              <path d="M60,10 L60,25" stroke="#ff3939" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M57,20 L60,25 L63,20" stroke="#ff3939" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="60" y="7" fontSize="5.5" fill="#ff3939" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">PESO ACUMULADO</text>
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">PÁG. 11 · ZONA ALTA</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Onde o degradê acumula peso</p>
          </div>
        )}

        {type === 'linha-base' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20,80 C20,45 35,25 60,25 C80,25 90,45 90,65 C90,75 80,80 70,80" strokeLinecap="round" />
              {/* Linha base */}
              <path d="M25,62 Q50,56 85,62" stroke="#f0c86c" strokeWidth="2.5" strokeLinecap="round" />
              {/* Direction text and arrows */}
              <path d="M35,62 L35,72" stroke="#f0c86c" strokeWidth="1" strokeDasharray="1 1" />
              <text x="55" y="50" fontSize="6.5" fill="#f0c86c" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">LINHA BASE INICIAL</text>
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">PÁG. 29 · LINHA BASE</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">O limite inicial do degradê limpo</p>
          </div>
        )}

        {type === 'suavizacao' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20,80 C20,45 35,25 60,25 C80,25 90,45 90,65 C90,75 80,80 70,80" strokeLinecap="round" />
              {/* Shading representing transition */}
              <path d="M28,52 Q50,46 83,52" stroke="#d6a84c" strokeWidth="1.5" strokeDasharray="1 1" />
              <path d="M26,57 Q50,51 84,57" stroke="#19a63a" strokeWidth="2" strokeLinecap="round" />
              <text x="55" y="40" fontSize="6.5" fill="#19a63a" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">SUAVIZAÇÃO (BLEND)</text>
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">PÁG. 33 · SUAVIZAÇÃO</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Como suavizar sem subir demais</p>
          </div>
        )}

        {type === 'pentes' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <div className="flex gap-1.5 justify-center mb-3 items-end h-16">
              {[0.5, 1, 1.5, 2, 3, 4].map((p, idx) => (
                <div key={p} className="flex flex-col items-center">
                  <div className="w-4 bg-[#d6a84c]/20 border border-[#d6a84c]/60 rounded-t" style={{ height: `${20 + idx * 8}px` }} />
                  <span className="text-[8px] text-[#f0c86c] font-mono mt-1 font-bold">#{p}</span>
                </div>
              ))}
            </div>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">TABELA DOS PENTES</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Ordem, alturas e transição</p>
          </div>
        )}

        {type === 'acabamento' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10,50 L40,50 C40,50 45,35 55,35 C65,35 68,45 68,55 C68,65 58,75 52,75 L30,75 L10,75" strokeLinecap="round" />
              <path d="M42,50 C42,54 45,56 48,56" stroke="#f0c86c" strokeWidth="2" />
              <path d="M30,48 L30,68" stroke="#ff3939" strokeWidth="1.5" strokeDasharray="2 1" />
              <text x="50" y="25" fontSize="7" fill="#f0c86c" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">PEEZINHO & TEMPORAS</text>
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">BÔNUS · ACABAMENTO</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Laterais, pezinho e nuca limpos</p>
          </div>
        )}

        {type === 'checklist' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <div className="w-10 h-14 border-2 border-[#d6a84c] rounded-md p-1.5 mb-2 flex flex-col gap-1.5 bg-[#12100a]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border border-[#19a63a] bg-[#19a63a]/30 flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#b5ea50] rounded-full" />
                  </div>
                  <div className="h-[2px] bg-[#d6a84c]/50 flex-grow rounded" />
                </div>
              ))}
            </div>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">BÔNUS · CHECKLIST</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Conferência rápida na bancada</p>
          </div>
        )}

        {type === 'erros' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20,80 C20,45 35,25 60,25 C80,25 90,45 90,65" strokeLinecap="round" />
              <path d="M28,58 L45,43 L60,50 L82,40" stroke="#ff3939" strokeWidth="3" strokeLinecap="round" />
              <circle cx="45" cy="43" r="3" fill="#ff3939" />
              <circle cx="60" cy="50" r="3" fill="#ff3939" />
              <text x="55" y="15" fontSize="7" fill="#ff3939" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">MARCAÇÕES INDESEJADAS</text>
            </svg>
            <h4 className="font-bold text-xs text-red-500 uppercase tracking-wider">BÔNUS · 7 ERROS</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Evite o que destrói o degradê</p>
          </div>
        )}

        {type === 'prova' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20,30 L80,30 L80,75 L20,75 Z" strokeLinecap="round" />
              <path d="M30,42 L55,42" stroke="#b5ea50" strokeWidth="2" strokeLinecap="round" />
              <path d="M30,52 L70,52" stroke="#d6a84c" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M30,62 L60,62" stroke="#d6a84c" strokeWidth="1.5" strokeLinecap="round" />
              <polygon points="70,38 73,44 80,45 75,50 76,57 70,53 64,57 65,50 60,45 67,44" fill="#f0c86c" stroke="#d6a84c" strokeWidth="1" />
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">PROVA SOCIAL</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Depoimento de barbeiro aprovado</p>
          </div>
        )}

        {type === 'pack' && (
          <div className="text-center p-4 z-10 flex flex-col items-center w-full">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#d6a84c] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="25" y="25" width="35" height="45" rx="3" stroke="#d6a84c" strokeWidth="1.5" />
              <rect x="40" y="30" width="35" height="45" rx="3" stroke="#f0c86c" strokeWidth="1.5" />
              <circle cx="42" cy="40" r="3" fill="#d6a84c" />
              <circle cx="58" cy="45" r="3" fill="#f0c86c" />
              <text x="50" y="85" fontSize="7" fill="#f0c86c" textAnchor="middle" fontWeight="black" letterSpacing="0.05em">PACK DE FADES</text>
            </svg>
            <h4 className="font-bold text-xs text-[#f0c86c] uppercase tracking-wider">BÔNUS · PACK DE REFERÊNCIAS</h4>
            <p className="text-[9px] text-[#b8b3aa] mt-0.5">Inspirações de low, mid e high fade</p>
          </div>
        )}
        
        {/* Styled decorative metal corners */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#d6a84c]/60" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#d6a84c]/60" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#d6a84c]/60" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#d6a84c]/60" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={800}
      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 300px"
      referrerPolicy="no-referrer"
      {...(priority ? { priority: true } : { loading })}
      className={`${className} transition-all duration-300`}
      onError={() => setHasError(true)}
    />
  );
}

function BookMockup({ 
  src, 
  alt, 
  title, 
  subtitle, 
  className = "" 
}: { 
  src: string; 
  alt: string; 
  title: string; 
  subtitle: string; 
  className?: string; 
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`book ${className}`}>
      <div className="book-cover">
        {hasError ? (
          <div className="w-full h-full bg-gradient-to-br from-[#1c1917] to-[#0c0a09] flex flex-col items-center justify-between p-3 text-center border border-[#d6a84c]/30 relative select-none">
            <div className="absolute inset-1.5 border border-[#d6a84c]/10 rounded" />
            <div className="text-[#d6a84c] text-[9px] tracking-widest font-extrabold uppercase mt-1">GUIA VISUAL</div>
            <div className="my-auto">
              <h4 className="font-extrabold text-sm text-white tracking-tight leading-tight uppercase">{title}</h4>
              <div className="h-[1px] w-8 bg-[#d6a84c]/40 mx-auto my-1.5" />
              <p className="text-[9px] text-[#b8b3aa] font-medium leading-tight uppercase">{subtitle}</p>
            </div>
            <div className="text-[7px] text-[#d6a84c]/60 font-mono tracking-widest mt-auto">PREMIUM</div>
          </div>
        ) : (
          <Image 
            src={src} 
            alt={alt} 
            width={400}
            height={600}
            unoptimized
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
            onError={() => setHasError(true)} 
          />
        )}
      </div>
      <span className="book-spine"></span>
      <span className="book-pages"></span>
    </div>
  );
}

// Notifications data
const NOTIFICATIONS_DATA = [
  { name: 'Lucas A.', action: 'mapa completo', time: 'há 20s', city: 'São Paulo - SP' },
  { name: 'Mateus S.', action: 'mapa básico', time: 'há 1 min', city: 'Rio de Janeiro - RJ' },
  { name: 'Rodrigo M.', action: 'mapa completo', time: 'há 45s', city: 'Belo Horizonte - MG' },
  { name: 'Gabriel K.', action: 'mapa completo', time: 'há 2 min', city: 'Curitiba - PR' },
  { name: 'Carlos E.', action: 'mapa básico', time: 'há 15s', city: 'Salvador - BA' },
  { name: 'Felipe T.', action: 'mapa completo', time: 'há 3 min', city: 'Porto Alegre - RS' },
  { name: 'Bruno R.', action: 'mapa completo', time: 'há 35s', city: 'Goiânia - GO' },
  { name: 'Diego H.', action: 'mapa básico', time: 'há 50s', city: 'Fortaleza - CE' },
  { name: 'Vinícius P.', action: 'mapa completo', time: 'há 1 min', city: 'Brasília - DF' },
  { name: 'André L.', action: 'mapa completo', time: 'há 12s', city: 'Recife - PE' },
  { name: 'Leandro V.', action: 'mapa básico', time: 'há 4 min', city: 'Manaus - AM' },
  { name: 'Rafael B.', action: 'mapa completo', time: 'há 25s', city: 'Florianópolis - SC' },
  { name: 'Thiago C.', action: 'mapa completo', time: 'há 1 min', city: 'Belém - PA' },
  { name: 'Gustavo N.', action: 'mapa básico', time: 'há 30s', city: 'Vitória - ES' },
  { name: 'Eduardo F.', action: 'mapa completo', time: 'há 15s', city: 'Campinas - SP' },
  { name: 'Marcelo D.', action: 'mapa completo', time: 'há 3 min', city: 'São Luís - MA' },
  { name: 'João P.', action: 'mapa básico', time: 'há 40s', city: 'Natal - RN' }
];

export default function SalesPage() {
  // Global Checkout Link config (saved to LocalStorage for live visual updating)
  const [checkoutUrl, setCheckoutUrl] = useState('https://pay.wiapy.com/MaYsqe4pqwN');
  const [checkoutUrlBasico, setCheckoutUrlBasico] = useState('https://pay.wiapy.com/iUoMvXq0sJr-');
  const [checkoutUrlDesconto, setCheckoutUrlDesconto] = useState('https://pay.wiapy.com/8To4z6HioR');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('MAPA_DEGRADE_CHECKOUT_URL');
      if (saved && !saved.includes('seu-checkout')) {
        setTimeout(() => setCheckoutUrl(saved), 0);
      }

      const savedBasico = localStorage.getItem('MAPA_DEGRADE_CHECKOUT_URL_BASICO');
      if (savedBasico && !savedBasico.includes('seu-checkout')) {
        setTimeout(() => setCheckoutUrlBasico(savedBasico), 0);
      }

      const savedDesconto = localStorage.getItem('MAPA_DEGRADE_CHECKOUT_URL_DESCONTO');
      if (savedDesconto && !savedDesconto.includes('seu-checkout')) {
        setTimeout(() => setCheckoutUrlDesconto(savedDesconto), 0);
      }
    }
  }, []);

  const [isEditingCheckout, setIsEditingCheckout] = useState(false);
  const [tempCheckoutUrl, setTempCheckoutUrl] = useState('');
  const [tempCheckoutUrlBasico, setTempCheckoutUrlBasico] = useState('');
  const [tempCheckoutUrlDesconto, setTempCheckoutUrlDesconto] = useState('');
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Top-right notification toasts
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let active = true;
    let timerId: ReturnType<typeof setTimeout>;

    const showNextNotification = () => {
      if (!active) return;
      setNotificationIndex((prev) => (prev + 1) % NOTIFICATIONS_DATA.length);
      setShowNotification(true);

      // Keep it visible for 5-7 seconds (random duration between 5000ms and 7000ms)
      const visibleDuration = 5000 + Math.random() * 2000;
      timerId = setTimeout(hideNotification, visibleDuration);
    };

    const hideNotification = () => {
      if (!active) return;
      setShowNotification(false);

      // Wait 8-13 seconds before showing the next notification (random duration between 8000ms and 13000ms)
      const hiddenDuration = 8000 + Math.random() * 5000;
      timerId = setTimeout(showNextNotification, hiddenDuration);
    };

    // Start the social proof cycle only after the hero has had time to breathe.
    timerId = setTimeout(showNextNotification, 15000);

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);
  
  // Carousel active states
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const carouselTouchStartRef = useRef({ x: 0, y: 0 });

  // Lightbox overlay states
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const [lightboxType, setLightboxType] = useState<BarberImageProps['type']>('capa');

  const saveCheckoutUrls = (urlCompleto: string, urlBasico: string, urlDesconto: string) => {
    let cleanCompleto = urlCompleto.trim();
    if (cleanCompleto && !cleanCompleto.startsWith('http://') && !cleanCompleto.startsWith('https://')) {
      cleanCompleto = 'https://' + cleanCompleto;
    }
    if (cleanCompleto) {
      setCheckoutUrl(cleanCompleto);
      localStorage.setItem('MAPA_DEGRADE_CHECKOUT_URL', cleanCompleto);
    }

    let cleanBasico = urlBasico.trim();
    if (cleanBasico && !cleanBasico.startsWith('http://') && !cleanBasico.startsWith('https://')) {
      cleanBasico = 'https://' + cleanBasico;
    }
    if (cleanBasico) {
      setCheckoutUrlBasico(cleanBasico);
      localStorage.setItem('MAPA_DEGRADE_CHECKOUT_URL_BASICO', cleanBasico);
    }

    let cleanDesconto = urlDesconto.trim();
    if (cleanDesconto && !cleanDesconto.startsWith('http://') && !cleanDesconto.startsWith('https://')) {
      cleanDesconto = 'https://' + cleanDesconto;
    }
    if (cleanDesconto) {
      setCheckoutUrlDesconto(cleanDesconto);
      localStorage.setItem('MAPA_DEGRADE_CHECKOUT_URL_DESCONTO', cleanDesconto);
    }
    
    setIsEditingCheckout(false);
  };

  const trackCheckoutClick = (
    checkoutType: CheckoutType,
    targetUrl: string,
    buttonLocation = 'oferta',
    clickKind = 'checkout',
  ) => {
    const checkoutMeta = getCheckoutMeta(checkoutType);
    const offerSection = getOfferTrackingSection();

    try {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          sessionId: getSessionId(),
          checkoutType,
          checkoutLabel: checkoutMeta.label,
          checkoutPrice: checkoutMeta.price,
          buttonLocation,
          targetUrl,
          clickKind,
          currentSectionId: offerSection.id,
          currentSectionTitle: offerSection.title,
          currentSectionOrder: offerSection.order,
          timestamp: new Date().toISOString(),
          ...getUtmParams(),
        }),
      }).catch(() => {});
    } catch {
      // Tracking cannot block checkout navigation.
    }
  };

  const scheduleCheckoutFallback = (targetUrl: string) => {
    window.setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);
  };

  const trackOfferJump = () => {
    const offerSection = getOfferTrackingSection();
    trackInternalCta({
      ctaLabel: 'QUERO FAZER DEGRADES MAIS LIMPOS',
      buttonLocation: 'cta_intermediario',
      sourceSectionId: 'cta-material-por-dentro',
      sourceSectionTitle: '04 - CTA INTERMEDIARIO',
      sourceSectionOrder: 4,
      targetSectionId: offerSection.id,
      targetSectionTitle: offerSection.title,
      targetSectionOrder: offerSection.order,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });
  };

  const handleCheckoutClick = (type: 'completo' | 'basico' | 'desconto' | React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof type === 'object' && 'preventDefault' in type) {
      const e = type;
      if (checkoutUrl.includes('seu-checkout-aqui')) {
        e.preventDefault();
        setTempCheckoutUrl(checkoutUrl);
        setTempCheckoutUrlBasico(checkoutUrlBasico);
        setTempCheckoutUrlDesconto(checkoutUrlDesconto);
        setIsEditingCheckout(true);
      }
      return;
    }

    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      const currentUrl = type === 'completo' ? checkoutUrl : type === 'basico' ? checkoutUrlBasico : checkoutUrlDesconto;
      const targetUrl = e.currentTarget.href || currentUrl;
      const nativeEvent = e.nativeEvent as MouseEvent & { flagged?: boolean };
      if (nativeEvent.flagged === true || nativeEvent.isTrusted === false) return;

      if (currentUrl.includes('seu-checkout-aqui') || currentUrl.includes('seu-checkout-basico') || currentUrl.includes('seu-checkout-desconto')) {
        e.preventDefault();
        setTempCheckoutUrl(checkoutUrl);
        setTempCheckoutUrlBasico(checkoutUrlBasico);
        setTempCheckoutUrlDesconto(checkoutUrlDesconto);
        setIsEditingCheckout(true);
        return;
      }

      const checkoutType = type === 'completo'
        ? 'kit_completo'
        : type === 'basico'
          ? 'plano_basico'
          : 'kit_desconto_popup';
      const buttonLocation = type === 'completo' ? 'oferta' : 'popup_upgrade';
      trackCheckoutClick(checkoutType, targetUrl, buttonLocation);
      scheduleCheckoutFallback(targetUrl);
    };
  };

  const carouselItems = [
    { id: 0, title: 'Imagem 1', src: '/image/ta-duvidando/image01.webp', thumb: '/image/ta-duvidando/image01.webp', type: 'capa' as const, desc: '' },
    { id: 1, title: 'Imagem 2', src: '/image/ta-duvidando/image02.webp', thumb: '/image/ta-duvidando/image02.webp', type: 'zona-alta' as const, desc: '' },
    { id: 2, title: 'Imagem 3', src: '/image/ta-duvidando/image03.webp', thumb: '/image/ta-duvidando/image03.webp', type: 'linha-base' as const, desc: '' },
    { id: 3, title: 'Imagem 4', src: '/image/ta-duvidando/image04.webp', thumb: '/image/ta-duvidando/image04.webp', type: 'suavizacao' as const, desc: '' },
    { id: 4, title: 'Imagem 5', src: '/image/ta-duvidando/image05.webp', thumb: '/image/ta-duvidando/image05.webp', type: 'pentes' as const, desc: '' },
    { id: 5, title: 'Imagem 6', src: '/image/ta-duvidando/image06.webp', thumb: '/image/ta-duvidando/image06.webp', type: 'acabamento' as const, desc: '' }
  ];

  const centerTrackItem = (
    trackRef: React.RefObject<HTMLDivElement | null>,
    index: number,
    behavior: ScrollBehavior = 'auto',
  ) => {
    const track = trackRef.current;
    const targetCard = track?.children[index] as HTMLElement | undefined;
    if (!track || !targetCard) return;

    track.scrollTo({
      left: targetCard.offsetLeft - (track.clientWidth - targetCard.offsetWidth) / 2,
      behavior,
    });
  };

  const getWrappedIndex = (index: number, length: number) => {
    if (length <= 0) return 0;
    return (index + length) % length;
  };

  const moveCarouselTo = (
    trackRef: React.RefObject<HTMLDivElement | null>,
    nextIndex: number,
    length: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const wrappedIndex = getWrappedIndex(nextIndex, length);
    setIndex(wrappedIndex);
    centerTrackItem(trackRef, wrappedIndex);
  };

  const handleSwipeStart = (
    event: React.TouchEvent,
    startRef: React.MutableRefObject<{ x: number; y: number }>,
  ) => {
    const touch = event.touches[0];
    startRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleSwipeEnd = (
    event: React.TouchEvent,
    startRef: React.MutableRefObject<{ x: number; y: number }>,
    activeIndex: number,
    length: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    trackRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startRef.current.x;
    const deltaY = touch.clientY - startRef.current.y;

    if (Math.abs(deltaX) < 38 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;

    moveCarouselTo(
      trackRef,
      activeIndex + (deltaX < 0 ? 1 : -1),
      length,
      setIndex,
    );
  };

  const handleCarouselScroll = () => {
    const track = carouselTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let activeIndex = 0;
    let smallestDistance = Infinity;

    const cards = track.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = i;
      }
    }
    setActiveCarouselIndex(activeIndex);
  };

  const scrollCarousel = (direction: 'prev' | 'next') => {
    moveCarouselTo(
      carouselTrackRef,
      activeCarouselIndex + (direction === 'next' ? 1 : -1),
      carouselItems.length,
      setActiveCarouselIndex,
    );
  };

  // Proof Carousel States
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const proofTrackRef = useRef<HTMLDivElement>(null);
  const proofTouchStartRef = useRef({ x: 0, y: 0 });

  const proofItems = [
    { id: 0, src: '/image/prova-social/ps01.webp', alt: 'Relato de barbeiro sobre a lógica do método M.A.P.A.' },
    { id: 1, src: '/image/prova-social/ps02.webp', alt: 'Relato de barbeiro sobre referências de low, mid e high fade' },
    { id: 2, src: '/image/prova-social/ps03.webp', alt: 'Relato de barbeiro sobre a lógica dos pentes' },
    { id: 3, src: '/image/prova-social/ps04.webp', alt: 'Comentários de clientes sobre o material' },
    { id: 4, src: '/image/prova-social/ps05.webp', alt: 'Relato em barbearia sobre ajuste da sequência de pentes' }
  ];

  const handleProofScroll = () => {
    const track = proofTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let activeIndex = 0;
    let smallestDistance = Infinity;

    const cards = track.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = i;
      }
    }
    setActiveProofIndex(activeIndex);
  };

  const scrollProofCarousel = (direction: 'prev' | 'next') => {
    moveCarouselTo(
      proofTrackRef,
      activeProofIndex + (direction === 'next' ? 1 : -1),
      proofItems.length,
      setActiveProofIndex,
    );
  };

  // Product Bundle Carousel States
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const productTrackRef = useRef<HTMLDivElement>(null);
  const productTouchStartRef = useRef({ x: 0, y: 0 });

  const productItems = [
    {
      id: '01',
      number: '01',
      title: 'Mapa do Degradê Sem Marca',
      desc: 'Guia completo para entender o degradê sem marca do início ao fim.',
      src: '/image/tudo-que-recebe/mapa-degrade-sem-marca.webp',
      type: 'capa' as const,
      included: false
    },
    {
      id: '02',
      number: '02',
      title: 'Tabela dos Pentes e Alturas',
      desc: 'Guia visual dos pentes, alturas e ordem correta das transições.',
      src: '/image/tudo-que-recebe/bonus-01-pentes-alturas.webp',
      type: 'pentes' as const,
      included: true
    },
    {
      id: '03',
      number: '03',
      title: 'Checklist do Corte Sem Marca',
      desc: 'Checklist completo para rever cada etapa e não esquecer nenhum detalhe.',
      src: '/image/tudo-que-recebe/bonus-02-checklist.webp',
      type: 'checklist' as const,
      included: true
    },
    {
      id: '04',
      number: '04',
      title: 'Guia dos 7 Erros que Estragam o Degradê',
      desc: 'Aprenda o que evitar em um degradê limpo e como corrigir cada erro.',
      src: '/image/tudo-que-recebe/bonus-03-erros.webp',
      type: 'erros' as const,
      included: true
    },
    {
      id: '05',
      number: '05',
      title: 'Pack de Referências Essenciais de Fade',
      desc: 'Coleção de referências visuais para inspirar e escolher o estilo certo.',
      src: '/image/tudo-que-recebe/bonus-04-referencias.webp',
      type: 'pack' as const,
      included: true
    },
    {
      id: '06',
      number: '06',
      title: 'Mini Guia de Acabamento Profissional',
      desc: 'Acabamentos, marcações e dicas práticas para entregar resultados impecáveis.',
      src: '/image/tudo-que-recebe/bonus-05-acabamento.webp',
      type: 'acabamento' as const,
      included: true
    }
  ];

  const handleProductScroll = () => {
    const track = productTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let activeIndex = 0;
    let smallestDistance = Infinity;

    const cards = track.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeIndex = i;
      }
    }
    setActiveProductIndex(activeIndex);
  };

  const scrollProductCarousel = (direction: 'prev' | 'next') => {
    moveCarouselTo(
      productTrackRef,
      activeProductIndex + (direction === 'next' ? 1 : -1),
      productItems.length,
      setActiveProductIndex,
    );
  };

  const openLightbox = (src: string, alt: string, type: BarberImageProps['type']) => {
    setLightboxImage(src);
    setLightboxAlt(alt);
    setLightboxType(type);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = '';
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scrollend listeners para dots dos carrosséis (mais confiável no mobile)
  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) return;
    const handler = () => handleCarouselScroll();
    track.addEventListener('scrollend', handler);
    return () => {
      track.removeEventListener('scrollend', handler);
    };
  });

  useEffect(() => {
    const track = proofTrackRef.current;
    if (!track) return;
    const handler = () => handleProofScroll();
    track.addEventListener('scrollend', handler);
    return () => {
      track.removeEventListener('scrollend', handler);
    };
  });

  useEffect(() => {
    const track = productTrackRef.current;
    if (!track) return;
    const handler = () => handleProductScroll();
    track.addEventListener('scrollend', handler);
    return () => {
      track.removeEventListener('scrollend', handler);
    };
  });

  useEffect(() => {
    const priorityPreloadImages = [
      '/image/popup-upgrade-mockup/plano-completo.webp',
      '/image/mockup-planos/plano-completo.webp',
      carouselItems[0]?.src,
      proofItems[0]?.src,
      productItems[0]?.src,
    ].filter(Boolean) as string[];

    const deferredPreloadImages = [
      ...carouselItems.slice(1).map((item) => item.src),
      ...proofItems.slice(1).map((item) => item.src),
      ...productItems.slice(1).map((item) => item.src),
    ];

    const preloadImage = (src: string) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
    };

    const timeoutIds: number[] = [];

    const runPreload = () => {
      priorityPreloadImages.forEach(preloadImage);

      for (let index = 0; index < deferredPreloadImages.length; index += 3) {
        const chunk = deferredPreloadImages.slice(index, index + 3);
        timeoutIds.push(
          window.setTimeout(() => {
            chunk.forEach(preloadImage);
          }, 2500 + index * 500),
        );
      }
    };

    const idleWindow = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const callbackId = idleWindow.requestIdleCallback(runPreload, { timeout: 1600 });
      return () => {
        idleWindow.cancelIdleCallback?.(callbackId);
        timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      };
    }

    const timeoutId = window.setTimeout(runPreload, 1200);
    return () => {
      window.clearTimeout(timeoutId);
      timeoutIds.forEach((deferredTimeoutId) => window.clearTimeout(deferredTimeoutId));
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      centerTrackItem(carouselTrackRef, activeCarouselIndex, 'auto');
      centerTrackItem(proofTrackRef, activeProofIndex, 'auto');
      centerTrackItem(productTrackRef, activeProductIndex, 'auto');
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f7f4ee] selection:bg-[#d6a84c] selection:text-[#17120a]">
      {/* Background Page Glows */}
      <div className="page-glow page-glow--one" />
      <div className="page-glow page-glow--two" />

      {/* TOP RIGHT LIVE PURCHASE NOTIFICATION TOAST */}
      <div className="fixed top-4 right-4 z-50 pointer-events-auto max-w-[320px] w-[calc(100%-2rem)]">
        <AnimatePresence mode="wait">
          {showNotification && (
            <motion.div
              key={notificationIndex}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-[#0e0d0b]/95 backdrop-blur-md border border-[#d6a84c]/40 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)] text-white flex items-start gap-3 relative overflow-hidden group"
            >
              {/* Glow accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f0c86c] to-[#d6a84c]" />
              
              {/* Verified Badge / Check icon */}
              <div className="w-8 h-8 rounded-full bg-[#d6a84c]/15 border border-[#d6a84c]/30 flex items-center justify-center shrink-0 text-[#f0c86c] mt-0.5">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>

              <div className="flex-1 pr-3 min-w-0">
                <p className="text-xs text-gray-200 leading-snug">
                  <span className="font-bold text-white">{NOTIFICATIONS_DATA[notificationIndex].name}</span>{' '}
                  adquiriu o <span className="font-bold text-[#f0c86c]">{NOTIFICATIONS_DATA[notificationIndex].action}</span>{' '}
                  <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap">{NOTIFICATIONS_DATA[notificationIndex].time}</span>
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                  {NOTIFICATIONS_DATA[notificationIndex].city}
                </p>
              </div>

              {/* Close icon */}
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1 -mr-1 -mt-1 rounded"
                title="Fechar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      <main className="overflow-hidden">
        <ClientTrackers />
        {/* HERO SECTION */}
        <section className="hero pt-10 pb-6 sm:pt-16 sm:pb-10" id="inicio">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="eyebrow mb-6" style={{fontSize: '0.6rem', whiteSpace: 'nowrap', padding: '7px 12px'}}>
                <span>✓</span> O GUIA DEFINITIVO PARA BARBEIROS INICIANTES E INTERMEDIÁRIOS
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none text-white max-w-3xl mx-auto mb-4">
                CANSADO DE MARCA NO <span className="text-[#f0c86c]">DEGRADÊ?</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#f7f4ee]/90 max-w-2xl mx-auto mb-6 leading-tight">
                Aprenda a troca correta de pente e a suavizar cada transição com um mapa visual simples
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#b8b3aa] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
                Um mapa prático para você parar de depender de métodos que só funcionam em alguns casos, e aplicar degradês mais limpos com a lógica dos pentes, alturas e transições.
              </p>
            </motion.div>

            {/* MOCKUP (SUBIDO PARA ABAIXO DA SUBHEADLINE) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative w-full max-w-xs mx-auto my-6 flex justify-center items-center select-none"
              aria-label="Mockup do guia Degradê sem Marca"
            >
              <div className="w-full rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.85)] border border-[#d6a84c]/30">
                <Image
                  src="/image/hero/hero.webp"
                  alt="Mockup do guia Degradê sem Marca"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* BULLETS ABAIXO DO MOCKUP */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="w-full max-w-lg mx-auto bg-[#0a0a0a]/80 border border-[#d6a84c]/20 rounded-xl p-5 sm:p-6 shadow-xl backdrop-blur-md mt-6"
            >
              <ul className="flex flex-col gap-3.5 text-left">
                <li className="flex items-start gap-3 text-[#f7f4ee] font-medium text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#19a63a]/10 border border-[#19a63a]/30 text-[#b5ea50] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                  <span>Método visual organizado em etapas</span>
                </li>
                <li className="flex items-start gap-3 text-[#f7f4ee] font-medium text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#19a63a]/10 border border-[#19a63a]/30 text-[#b5ea50] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                  <span>Sequências simples para consultar na bancada</span>
                </li>
                <li className="flex items-start gap-3 text-[#f7f4ee] font-medium text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#19a63a]/10 border border-[#19a63a]/30 text-[#b5ea50] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                  <span>Compra 100% segura e acesso imediato</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="section section--tight" id="marca-nao-aparece">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="problem"
            >
              <div className="problem__image relative" role="img" aria-label="Exemplo de excesso de peso na zona alta">
              </div>
              <div className="problem__copy">
                <h2 className="text-white">O PROBLEMA NÃO<br />APARECE DO NADA.</h2>
                <p className="mb-3 text-[#b8b3aa] text-sm sm:text-base leading-relaxed">O degradê já começa a ficar pesado quando a primeira linha é feita pesada demais, quando há distribuição errada das alturas ou de uma conexão mal feita com o topo.</p>
                <p className="mb-4 text-[#b8b3aa] text-sm sm:text-base leading-relaxed">Então você troca o pente, passa a máquina novamente e tenta apagar a linha - mas ela continua aparecendo.</p>
                <p className="text-sm sm:text-base text-[#f7f4ee]">No fim, o cliente vê uma coisa só:<br /><strong className="text-[#ff3939] font-bold text-lg sm:text-xl">MARCA VISÍVEL E CORTE PESADO.</strong></p>
              </div>
              <div className="problem__x text-red-500" aria-hidden="true">
                ×
              </div>
            </motion.div>
          </div>
        </section>

        {/* SOLUTION PREVIEW */}
        <section className="section section--tight" id="material-por-dentro">
          <div className="container panel">
            <div className="section-heading">
              <h2 className="text-white">A SOLUÇÃO É CLAREZA.</h2>
              <p>Entenda onde começa o erro, onde está a base e como suavizar sem subir demais.</p>
            </div>

            <div className="solution-grid">
              {/* Card 1: ZONA ALTA */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="solution-card cursor-pointer"
                onClick={() => openLightbox('/image/a-solucao-e-clareza/img0.webp', 'Zona alta: onde o peso acumula e o degradê pesa.', 'zona-alta')}
              >
                <div className="solution-card__head">
                  <h3>ZONA ALTA</h3>
                  <p>Onde o peso acumula e o degradê pesa.</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 hover:border-[#d6a84c]/50 transition-all">
                  <BarberImage src="/image/a-solucao-e-clareza/img0.webp" alt="Página 11 — Zona alta" type="zona-alta" />
                </div>
              </motion.article>

              {/* Card 2: MARCAÇÃO */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="solution-card cursor-pointer"
                onClick={() => openLightbox('/image/a-solucao-e-clareza/img1.webp', 'Marcação: o limite inicial que define um degradê limpo.', 'linha-base')}
              >
                <div className="solution-card__head">
                  <h3>MARCAÇÃO</h3>
                  <p>O limite inicial que define um degradê limpo.</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 hover:border-[#d6a84c]/50 transition-all">
                  <BarberImage src="/image/a-solucao-e-clareza/img1.webp" alt="Página 29 — Linha Base / Marcação" type="linha-base" />
                </div>
              </motion.article>

              {/* Card 3: ALTURAS */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="solution-card cursor-pointer"
                onClick={() => openLightbox('/image/a-solucao-e-clareza/img2.webp', 'Alturas: onde cada pente entra e como uma faixa se conecta à outra.', 'pentes')}
              >
                <div className="solution-card__head">
                  <h3>ALTURAS</h3>
                  <p>Onde cada pente entra e como uma faixa se conecta à outra.</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 hover:border-[#d6a84c]/50 transition-all">
                  <BarberImage src="/image/a-solucao-e-clareza/img2.webp" alt="Tabela dos Pentes e Alturas" type="pentes" />
                </div>
              </motion.article>

              {/* Card 4: TRANSIÇÃO */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="solution-card cursor-pointer"
                onClick={() => openLightbox('/image/a-solucao-e-clareza/img3.webp', 'Transição: onde as alturas se misturam e a marca começa a desaparecer.', 'suavizacao')}
              >
                <div className="solution-card__head">
                  <h3>TRANSIÇÃO</h3>
                  <p>Onde as alturas se misturam e a marca começa a desaparecer.</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 hover:border-[#d6a84c]/50 transition-all">
                  <BarberImage src="/image/a-solucao-e-clareza/img3.webp" alt="Página 33 — Suavização" type="suavizacao" />
                </div>
              </motion.article>

              {/* Card 5: ACABAMENTO */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="solution-card cursor-pointer"
                onClick={() => openLightbox('/image/a-solucao-e-clareza/img4.webp', 'Acabamento: os ajustes finais que deixam o corte mais limpo e bem apresentado.', 'acabamento')}
              >
                <div className="solution-card__head">
                  <h3>ACABAMENTO</h3>
                  <p>Os ajustes finais que deixam o corte mais limpo e bem apresentado.</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 hover:border-[#d6a84c]/50 transition-all">
                  <BarberImage src="/image/a-solucao-e-clareza/img4.webp" alt="Ajustes e Acabamento Final" type="acabamento" />
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* COMPACT STRIP ACTION */}
        <section className="section section--tight" id="chamada-oferta">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="bg-[#0a0a0a]/90 border border-[#d6a84c]/20 rounded-2xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
              {/* Decorative background aura */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#d6a84c]/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#d6a84c]/5 blur-3xl pointer-events-none" />

              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight max-w-2xl mx-auto mb-4" style={{ fontFamily: 'Impact, "Arial Narrow", Haettenschweiler, sans-serif' }}>
                SEU PRÓXIMO DEGRADÊ <span className="text-[#f0c86c]">NÃO PRECISA</span> SER MAIS UMA TENTATIVA.
              </h2>
              
              <p className="text-[#b8b3aa] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-4">
                Entenda onde a marca está aparecendo, qual pente usar e como trabalhar cada transição com mais lógica para aplicar degradês mais limpos.
              </p>
              
              <p className="text-xs sm:text-sm text-[#f0c86c] font-bold tracking-widest uppercase mb-6 leading-none">
                Acesse agora o Mapa do Degradê Sem Marca.
              </p>
              
              <div className="w-full flex flex-col items-center gap-2.5">
                <a 
                  className="button button--gold block text-center w-full max-w-md py-4 px-6 font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200" 
                  href="#oferta"
                  onClick={trackOfferJump}
                >
                  QUERO FAZER DEGRADÊS MAIS LIMPOS <b className="ml-1">›</b>
                </a>
                <span className="text-[#8f8a82] text-[10px] sm:text-xs mt-1 block">
                  ▣ Acesso imediato · Pagamento único · Material digital
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION BENEFITS */}
        <section className="section section--tight" id="com-o-mapa-voce-vai">
          <div className="container panel">
            <div className="section-heading section-heading--compact">
              <h2 className="text-white">COM O MAPA DO DEGRADÊ SEM MARCA, VOCÊ VAI...</h2>
            </div>
            <div className="benefits-grid">
              <article>
                <div className="icon-line"><Target className="w-8 h-8 mx-auto text-[#d6a84c]" /></div>
                <h3>ENXERGAR O QUE<br />OS OUTROS NÃO VEEM</h3>
                <p>Identifique onde a marca começa antes de cortar.</p>
              </article>
              <article>
                <div className="icon-line"><Scale className="w-8 h-8 mx-auto text-[#d6a84c]" /></div>
                <h3>DISTRIBUIR O PESO<br />DA MANEIRA CERTA</h3>
                <p>Equilibre da zona alta até a base do degradê.</p>
              </article>
              <article>
                <div className="icon-line"><Compass className="w-8 h-8 mx-auto text-[#d6a84c]" /></div>
                <h3>SUAVIZAR SEM<br />SUBIR DEMAIS</h3>
                <p>Técnicas que mantêm o formato e o caimento.</p>
              </article>
              <article>
                <div className="icon-line"><Zap className="w-8 h-8 mx-auto text-[#d6a84c]" /></div>
                <h3>TRABALHAR COM<br />MAIS SEGURANÇA</h3>
                <p>Passo a passo simples e resultados previsíveis.</p>
              </article>
              <article>
                <div className="icon-line"><Star className="w-8 h-8 mx-auto text-[#d6a84c]" /></div>
                <h3>ELEVAR SEU NÍVEL<br />E SEU VALOR</h3>
                <p>Clientes mais satisfeitos e mais indicações.</p>
              </article>
            </div>
          </div>
        </section>

        {/* LOOK INSIDE SLIDES CAROUSEL */}
        <section className="section section--tight" id="por-dentro">
          <div className="container panel">
            <div className="section-heading section-heading--compact">
              <h2 className="text-white">TÁ DUVIDANDO? DÁ UMA OLHADA AQUI...</h2>
              <p>Conteúdo visual, direto ao ponto e feito para consultar durante seus cortes.</p>
            </div>
            <div className="carousel-wrap">
              <button 
                className="carousel-btn carousel-btn--prev" 
                type="button" 
                aria-label="Voltar"
                onClick={() => scrollCarousel('prev')}
              >
                ‹
              </button>
              
              <div 
                className="look-track" 
                id="lookTrack"
                ref={carouselTrackRef}
                onTouchStart={(event) => handleSwipeStart(event, carouselTouchStartRef)}
                onTouchEnd={(event) => handleSwipeEnd(event, carouselTouchStartRef, activeCarouselIndex, carouselItems.length, setActiveCarouselIndex, carouselTrackRef)}
              >
                {carouselItems.map((item, index) => (
                  <button 
                    key={item.id}
                    className={`look-card ${activeCarouselIndex === index ? 'is-active border-[#d6a84c]' : 'opacity-85 border-white/10'}`} 
                    type="button"
                    onClick={() => openLightbox(item.src, item.title, item.type)}
                  >
                    <BarberImage src={item.src} alt={item.title} type={item.type} loading={index === 0 ? 'eager' : 'lazy'} />
                  </button>
                ))}
              </div>

              <button 
                className="carousel-btn carousel-btn--next" 
                type="button" 
                aria-label="Avançar"
                onClick={() => scrollCarousel('next')}
              >
                ›
              </button>
            </div>
            
            <div className="dots" aria-hidden="true">
              {carouselItems.map((_, index) => (
                <span 
                  key={index} 
                  className={activeCarouselIndex === index ? 'active' : ''} 
                  onClick={() => {
                    const track = carouselTrackRef.current;
                    if (track) {
                      const targetCard = track.children[index] as HTMLElement;
                      if (targetCard) {
                        setActiveCarouselIndex(index);
                        centerTrackItem(carouselTrackRef, index);
                      }
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="section social-proof" id="depoimentos">
          <div className="container panel">
            <div className="section-heading section-heading--compact">
              <h2 className="text-white">BARBEIROS QUE COMPRARAM E <strong className="text-[#f0c86c]">APROVARAM</strong></h2>
            </div>
            
            <div className="carousel-shell relative px-6 sm:px-10 my-4">
              <button 
                className="carousel-arrow prev absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl text-[#d6a84c] hover:text-[#f0c86c] z-10 transition-colors" 
                type="button" 
                aria-label="Voltar"
                onClick={() => scrollProofCarousel('prev')}
              >
                ‹
              </button>
              
              <div 
                className="carousel-track proof-track flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2"
                ref={proofTrackRef}
                onTouchStart={(event) => handleSwipeStart(event, proofTouchStartRef)}
                onTouchEnd={(event) => handleSwipeEnd(event, proofTouchStartRef, activeProofIndex, proofItems.length, setActiveProofIndex, proofTrackRef)}
              >
                {proofItems.map((item, index) => (
                  <button 
                    key={item.id}
                      className={`proof-card flex-shrink-0 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] snap-center bg-[#0a0a0a] rounded-lg overflow-hidden border transition-colors duration-100 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-zoom-in ${activeProofIndex === index ? 'is-active border-[#d6a84c]' : 'opacity-80 border-white/10 hover:border-[#d6a84c]/50'}`}
                    type="button"
                    onClick={() => openLightbox(item.src, item.alt, 'prova')}
                  >
                    <div className="relative w-full">
                      <BarberImage src={item.src} alt={item.alt} type="prova" className="w-full h-auto object-contain" loading={index === 0 ? 'eager' : 'lazy'} />
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                className="carousel-arrow next absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl text-[#d6a84c] hover:text-[#f0c86c] z-10 transition-colors" 
                type="button" 
                aria-label="Avançar"
                onClick={() => scrollProofCarousel('next')}
              >
                ›
              </button>
            </div>
            
            <div className="dots flex justify-center gap-2 mt-4" aria-hidden="true">
              {proofItems.map((_, index) => (
                <span 
                  key={index} 
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${activeProofIndex === index ? 'bg-[#d6a84c]' : 'bg-[#383838]'}`}
                  onClick={() => {
                    const track = proofTrackRef.current;
                    if (track) {
                      const targetCard = track.children[index] as HTMLElement;
                      if (targetCard) {
                        setActiveProofIndex(index);
                        centerTrackItem(proofTrackRef, index);
                      }
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* COMPLETE BUNDLE GRID WITH NEW CAROUSEL */}
        <section className="section section--tight" id="conteudo">
          <div className="container panel">
            <div className="section-heading">
              <h2 className="text-white text-3xl uppercase tracking-tight">VEJA TUDO QUE VOCÊ <strong className="text-[#f0c86c]">VAI RECEBER</strong></h2>
              <p className="text-[#aaa49a] text-sm mt-1 max-w-xl mx-auto">Um kit completo para você dominar o degradê com clareza, do início ao acabamento.</p>
            </div>
            
            <div className="carousel-shell relative px-6 sm:px-10 my-4" data-carousel="">
              <button 
                className="carousel-arrow prev absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl text-[#d6a84c] hover:text-[#f0c86c] z-10 transition-colors" 
                type="button" 
                aria-label="Voltar"
                onClick={() => scrollProductCarousel('prev')}
              >
                ‹
              </button>
              
              <div 
                className="carousel-track product-track flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2"
                ref={productTrackRef}
                onTouchStart={(event) => handleSwipeStart(event, productTouchStartRef)}
                onTouchEnd={(event) => handleSwipeEnd(event, productTouchStartRef, activeProductIndex, productItems.length, setActiveProductIndex, productTrackRef)}
              >
                {productItems.map((item, index) => (
                  <article 
                    key={item.id}
                    className={`product-card flex-shrink-0 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] snap-center bg-[#0a0a0a] rounded-lg overflow-hidden border transition-colors duration-100 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-zoom-in ${activeProductIndex === index ? 'is-active border-[#d6a84c]' : 'opacity-85 border-white/10 hover:border-[#d6a84c]/50'}`}
                    onClick={() => openLightbox(item.src, item.title, item.type)}
                  >
                    <span className="number">{item.number}</span>
                    {item.included && (
                      <span className="included">INCLUSO NO KIT COMPLETO</span>
                    )}
                    <div className="book rounded-md overflow-hidden bg-white/5 p-1 border border-white/5 mb-3">
                      <BarberImage src={item.src} alt={item.title} type={item.type} className="w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
              
              <button 
                className="carousel-arrow next absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl text-[#d6a84c] hover:text-[#f0c86c] z-10 transition-colors" 
                type="button" 
                aria-label="Avançar"
                onClick={() => scrollProductCarousel('next')}
              >
                ›
              </button>
            </div>
            
            <div className="dots flex justify-center gap-2 mt-4" aria-hidden="true">
              {productItems.map((_, index) => (
                <span 
                  key={index} 
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${activeProductIndex === index ? 'bg-[#d6a84c]' : 'bg-[#383838]'}`}
                  onClick={() => {
                    const track = productTrackRef.current;
                    if (track) {
                      const targetCard = track.children[index] as HTMLElement;
                      if (targetCard) {
                        setActiveProductIndex(index);
                        centerTrackItem(productTrackRef, index);
                      }
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* THE FINAL OFFER */}
        <section className="section section--tight plans-section" id="oferta">
          <div className="container pricing-section-container">
            <div className="container narrow mb-10 text-center px-4">
              <div className="ornament" aria-hidden="true">
                <span></span>
                <span className="mini-scissors">✂</span>
                <span></span>
              </div>
              <p className="eyebrow">Escolha a melhor opção para você</p>
              <h1>
                ESCOLHA COMO VOCÊ QUER COMEÇAR:
              </h1>
              <p className="lead">
                Leve apenas o guia principal ou, por <strong>R$ 10 a mais</strong>, receba também os 5 bônus exclusivos.
              </p>
            </div>

            <div className="flex flex-col gap-14 max-w-5xl mx-auto">
              {/* Card 1: GUIA BÁSICO */}
              <article className="plan-card plan-basic">
                <div className="basic-visual" aria-label="Mockup do guia básico">
                  <div className="plan-mockup-wrap">
                    <Image
                      src="/image/mockup-planos/plano-basico.webp"
                      alt="Mockup do guia Degradê sem Marca"
                      width={600}
                      height={800}
                      sizes="(max-width: 768px) 90vw, 408px"
                      className="plan-mockup-img"
                    />
                  </div>
                </div>
                <div className="plan-content">
                  <h2 className="text-white font-black">GUIA BÁSICO</h2>
                  <h3 className="text-[#f0c86c] font-bold text-xl mt-1">Mapa do Degradê</h3>
                  <p className="plan-description">Para quem quer começar apenas pelo guia principal.</p>
                  <ul className="feature-list short">
                    <li>Mapa do Degradê Sem Marca</li>
                    <li>Acesso imediato ao material</li>
                    <li>7 dias de garantia</li>
                  </ul>
                  <div className="price-block basic-price">
                    <p className="old-price">De <del>R$ 59,90</del> por:</p>
                    <div className="price price-basic"><span>R$</span>19,90</div>
                    <p className="text-sm opacity-80 mt-1">no pix ou cartão</p>
                  </div>
                  <a 
                    className="cta cta-outline cursor-pointer" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      trackCheckoutClick('plano_basico_popup_open', 'popup_upgrade', 'oferta', 'popup_open');
                      setIsUpgradeOpen(true);
                    }}
                  >
                    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-6 h-6 stroke-current fill-none">
                      <path d="M5 8h6l4 23h23l4-16H14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      <circle cx="20" cy="39" r="3" fill="currentColor"></circle>
                      <circle cx="36" cy="39" r="3" fill="currentColor"></circle>
                    </svg>
                    QUERO APENAS O GUIA
                  </a>
                </div>
              </article>

              {/* Bonus Callout Banner */}
              <div className="bonus-callout !relative !left-auto !bottom-auto !transform-none mx-auto w-full max-w-xl">
                <span aria-hidden="true">◇</span> POR APENAS <strong>R$ 10 A MAIS</strong>, LEVE TODOS OS BÔNUS EXCLUSIVOS!
              </div>

              {/* Card 2: O KIT COMPLETO */}
              <article className="plan-card plan-complete">
                <div className="plan-glow" aria-hidden="true"></div>
                <div className="kit-visual" aria-label="Mockup do kit completo">
                  <div className="plan-mockup-wrap">
                    <Image
                      src="/image/mockup-planos/plano-completo.webp"
                      alt="Mockup do Kit Completo Mapa do Degradê Sem Marca"
                      width={600}
                      height={800}
                      sizes="(max-width: 768px) 90vw, 408px"
                      className="plan-mockup-img"
                    />
                  </div>
                </div>

                <div className="plan-content">
                  <span className="plan-badge">★ MAIS COMPLETO</span>
                  <h2 className="text-white mt-4 font-black">O KIT COMPLETO</h2>
                  <p className="plan-description">Tudo que você precisa para sair do básico e entregar degradês que impressionam.</p>
                  <ul className="feature-list">
                    <li>Guia Degradê sem Marca</li>
                    <li>Tabela dos Pentes e Alturas</li>
                    <li>Checklist do Corte sem Marca</li>
                    <li>Guia dos 7 Erros que Estragam o Degradê</li>
                    <li>Pack de Referências Essenciais de Fade</li>
                    <li>Mini Guia de Acabamento Profissional</li>
                  </ul>

                  <div className="card-trust-badges">
                    <div className="trust-badge-item">
                      <span className="icon-wrap" aria-hidden="true">
                        <svg viewBox="0 0 48 48"><rect x="11" y="20" width="26" height="21" rx="3"></rect><path d="M17 20v-5a7 7 0 0 1 14 0v5M24 28v6"></path></svg>
                      </span>
                      <strong>Acesso imediato</strong>
                    </div>

                    <div className="trust-badge-item">
                      <span className="icon-wrap" aria-hidden="true">
                        <svg viewBox="0 0 48 48"><path d="M24 5 40 12v12c0 10-6 16-16 20C14 40 8 34 8 24V12l16-7Z"></path><path d="m17 24 5 5 10-11"></path></svg>
                      </span>
                      <strong>Compra segura</strong>
                    </div>

                    <div className="trust-badge-item">
                      <span className="icon-wrap" aria-hidden="true">
                        <svg viewBox="0 0 48 48"><path d="M15 35H9a6 6 0 0 1 0-12c1-8 7-13 15-13 7 0 12 4 14 10a7 7 0 0 1 1 14h-6"></path><path d="m17 29 7 7 7-7M24 36V18"></path></svg>
                      </span>
                      <strong>Atualizações futuras</strong>
                    </div>

                    <div className="trust-badge-item">
                      <span className="icon-wrap" aria-hidden="true">
                        <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"></circle><path d="m16 25 5 5 11-13"></path></svg>
                      </span>
                      <strong>7 dias de garantia</strong>
                    </div>
                  </div>
                  <div className="price-block">
                    <p className="old-price">De <del>R$ 119,90</del> por:</p>
                    <div className="price"><span>R$</span>29,90</div>
                    <p className="text-sm opacity-80 mt-1">no pix ou cartão</p>
                  </div>
                  <a 
                    className="cta cta-primary cursor-pointer" 
                    href={checkoutUrl}
                    onClick={handleCheckoutClick('completo')}
                  >
                    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-6 h-6 stroke-current fill-none">
                      <path d="M5 8h6l4 23h23l4-16H14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      <circle cx="20" cy="39" r="3" fill="currentColor"></circle>
                      <circle cx="36" cy="39" r="3" fill="currentColor"></circle>
                    </svg>
                    QUERO O KIT COMPLETO
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS & FOOTER */}
        <section className="section guarantee" id="garantia">
          <div className="seal">
            <Image
              src="/image/garantia/garantia-7-dias.webp"
              alt="Selo de garantia de 7 dias"
              width={110}
              height={110}
              unoptimized
              style={{ width: '110px', height: '110px', objectFit: 'contain', borderRadius: '50%' }}
            />
          </div>
          <div>
            <h2>GARANTIA INCONDICIONAL</h2>
            <p>Você tem 7 dias para testar sem risco. Se não gostar por qualquer motivo, é só pedir o reembolso e devolvemos 100% do seu dinheiro.</p>
          </div>
          <div className="shield">✓</div>
        </section>

        <section className="section faq" id="faq">
          <div className="section-heading">
            <h2>DÚVIDAS FREQUENTES</h2>
          </div>
          <div className="faq-grid faq">
            <details>
              <summary>Esse material é para quem ainda está começando?</summary>
              <p>Sim. O Mapa foi pensado principalmente para barbeiros iniciantes e intermediários que já praticam cortes, mas ainda se confundem na hora de tirar marcas, trocar os pentes e suavizar as transições.</p>
            </details>
            <details>
              <summary>Preciso ter experiência para entender?</summary>
              <p>Não precisa ser barbeiro avançado. O conteúdo foi organizado de forma visual e direta para facilitar a compreensão de pentes, alturas, marcações e pontos de correção.</p>
            </details>
            <details>
              <summary>É um curso completo de barbearia?</summary>
              <p>Não. O foco não é ensinar toda a profissão. O material foi criado para resolver um problema específico: ajudar você a entender por que o degradê fica marcado e como trabalhar cada transição com mais lógica.</p>
            </details>
            <details>
              <summary>Vou aprender apenas uma sequência de pentes?</summary>
              <p>Não. A proposta é justamente evitar que você dependa de sequências decoradas que funcionam em um corte e falham em outro. Você vai entender a função dos pentes, das alturas e dos pontos de transição para tomar decisões melhores durante o corte.</p>
            </details>
            <details>
              <summary>O material serve para low fade, mid fade e high fade?</summary>
              <p>Sim. A lógica de marcação, alturas e transições pode ser aplicada aos principais tipos de degradê, respeitando as diferenças de posicionamento e formato de cada corte.</p>
            </details>
            <details>
              <summary>Funciona com qualquer máquina?</summary>
              <p>A lógica do material pode ser aplicada com diferentes máquinas e pentes. Porém, medidas, alavancas e encaixes podem variar de acordo com o modelo do equipamento. Por isso, é importante conhecer os acessórios da máquina que você utiliza.</p>
            </details>
            <details>
              <summary>O Mapa garante que meu degradê nunca mais ficará marcado?</summary>
              <p>Não existe material que substitua prática e execução. O Mapa ajuda você a entender melhor o que está acontecendo no corte, identificar possíveis erros e treinar com mais direção. O resultado também depende da sua prática, do equipamento e das características de cada cabelo.</p>
            </details>
            <details>
              <summary>Posso consultar durante os treinos?</summary>
              <p>Sim. O material foi criado para servir como apoio rápido antes ou durante os seus treinos, sem a necessidade de procurar respostas em aulas longas ou conteúdos espalhados.</p>
            </details>
            <details>
              <summary>Como vou receber o material?</summary>
              <p>Após a confirmação do pagamento, você receberá o acesso ao conteúdo digital pelo canal informado na compra.</p>
            </details>
            <details>
              <summary>O pagamento é único?</summary>
              <p>Sim. Você paga apenas uma vez e recebe acesso ao material incluído no plano escolhido, sem mensalidade.</p>
            </details>
            <details>
              <summary>Tem garantia?</summary>
              <p>Você terá 7 dias de garantia para conhecer o material. Caso entenda que ele não é adequado para você, poderá solicitar o reembolso dentro do prazo e conforme as condições informadas na página de compra.</p>
            </details>
            <details>
              <summary>Ainda tenho uma dúvida. Como entro em contato?</summary>
              <p>Você pode falar com o suporte pelo e-mail <a href="mailto:entregamateriaisadquiridos@gmail.com" className="text-[#f0c86c] hover:underline">entregamateriaisadquiridos@gmail.com</a>.</p>
            </details>
          </div>
        </section>

        {/* NEW SECTION: FINAL CTA */}
        <section className="section final-cta py-20 bg-gradient-to-b from-transparent to-black/30 border-t border-white/5" id="chamada-final">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight mb-4">
              PARE DE TENTAR APAGAR A MARCA<br className="hidden md:inline" /> SEM ENTENDER COMO ELA SURGE.
            </h2>
            <p className="text-[#aaa49a] text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Tenha em mãos um mapa visual para entender os pentes, as alturas e os pontos de transição - e treinar degradês mais limpos com muito mais direção.
            </p>
            <div className="bg-[#120f0a]/60 border border-[#d6a84c]/15 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-xl backdrop-blur-sm">
              <p className="text-white text-base md:text-lg font-medium mb-5 leading-normal">
                Leve agora o <strong className="text-white font-extrabold">Mapa do Degradê Sem Marca</strong> + todos os bônus por apenas <span className="text-[#f0c86c] font-black text-2xl font-mono block sm:inline mt-1 sm:mt-0">R$ 29,90</span>.
              </p>
              <a 
                href={checkoutUrl}
                onClick={handleCheckoutClick('completo')}
                className="cta cta-primary w-full py-4 text-sm md:text-base font-black flex items-center justify-center gap-2"
              >
                QUERO ACESSAR O MAPA AGORA ›
              </a>
              <p className="text-[#aaa49a] text-[11px] md:text-xs mt-4 flex flex-wrap items-center justify-center gap-2 font-medium">
                <span>▣ Acesso imediato</span>
                <span className="opacity-30">•</span>
                <span>Pagamento único</span>
                <span className="opacity-30">•</span>
                <span>Material digital</span>
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer" id="rodape">
          <div className="footer-brand">
            <strong>MAPA DO<br />DEGRADÊ<br /><span>SEM MARCA</span></strong>
          </div>
          <div>
            <p>Produto digital destinado a fins educacionais. Os resultados podem variar de acordo com a prática, execução, equipamento utilizado e características de cada cabelo.</p>
            <p>✉ &nbsp; <b>SUPORTE:</b> <a href="mailto:entregamateriaisadquiridos@gmail.com" className="hover:underline text-[#f0c86c]">entregamateriaisadquiridos@gmail.com</a></p>
          </div>
          <div className="footer-icon">✂</div>
          <nav>
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Política de Reembolso</a>
          </nav>
          <small>© 2026 Mapa do Degradê Sem Marca. Todos os direitos reservados.</small>
        </footer>
      </main>

      {/* REACT PORTAL LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-6 backdrop-blur-sm cursor-zoom-out"
            onClick={closeLightbox}
          >
            <button 
              className="absolute right-6 top-6 text-white hover:text-[#f0c86c] text-3xl focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="max-h-[85vh] max-w-2xl w-full flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <BarberImage 
                src={lightboxImage} 
                alt={lightboxAlt} 
                type={lightboxType} 
                className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl border border-white/10"
              />
            </motion.div>
            <p className="text-[#b8b3aa] text-sm mt-4 tracking-wide font-medium">{lightboxAlt}</p>
          </motion.div>
        )}
      </AnimatePresence>



      {/* UPGRADE MODAL POPUP (BACKREDIRECT FOR PLANO BÁSICO) */}
      <AnimatePresence>
        {isUpgradeOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-6 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative bg-[#0d0d0d] border border-[#d6a84c]/30 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsUpgradeOpen(false)}
                className="absolute right-4 top-4 z-50 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 animate-fade-in"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="upgrade-modal-content">
                <div className="upgrade-modal-left">
                  <span className="upgrade-modal-label">Oferta especial</span>
                  <h2 id="upgrade-modal-title" className="upgrade-modal-title">Espere um segundo...</h2>
                  <p id="upgrade-modal-description" className="upgrade-modal-copy">
                    Antes de continuar com o Plano Básico, você pode liberar o Kit Completo com desconto especial.
                  </p>
                  <p className="upgrade-modal-copy">
                    Em vez de levar apenas o guia principal, você recebe o guia completo + todos os bônus por um valor menor que o preço normal do Kit Completo.
                  </p>
                  <figure className="upgrade-modal-visual">
                    <Image 
                      alt="Mockup do Kit Completo Mapa do Degradê Sem Marca com bônus inclusos" 
                      src="/image/popup-upgrade-mockup/plano-completo.webp"
                      width={600}
                      height={400}
                      priority
                      sizes="(max-width: 768px) 90vw, 500px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/image/mockup-planos/plano-completo.webp";
                      }}
                    />
                  </figure>
                </div>
                <div className="upgrade-modal-right">
                  <p className="upgrade-modal-included">✓ Tudo incluso nesta oferta:</p>
                  <ul className="upgrade-modal-list">
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Guia Digital Mapa do Degradê</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Tabela dos Pentes e Alturas</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Checklist do Corte Sem Marca</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Guia dos 7 Erros Comuns</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Pack de Referências de Fade</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Mini Guia de Acabamento</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Atualizações futuras</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>Acesso vitalício</span></li>
                    <li><span className="upgrade-modal-check" aria-hidden="true">✓</span><span>7 dias de garantia</span></li>
                  </ul>
                  <div className="upgrade-modal-pricebox">
                    <span className="upgrade-modal-old-price">De R$ 29,90</span>
                    <div className="upgrade-modal-price-row">
                      <span className="upgrade-modal-price-prefix">Por</span>
                      <strong className="upgrade-modal-price">R$ 24,90</strong>
                    </div>
                    <p className="upgrade-modal-payment-note">no pix ou cartão</p>
                    <p className="upgrade-modal-anchor">Por apenas R$5,00 a mais que o Plano Básico, você leva o Kit Completo.</p>
                  </div>
                  <div className="upgrade-modal-actions">
                    <a 
                      href={checkoutUrlDesconto}
                      className="upgrade-modal-primary" 
                      data-checkout-type="kit_desconto_popup" 
                      data-checkout-label="Kit Completo com Desconto" 
                      data-checkout-price="24.90" 
                      data-button-location="popup_upgrade" 
                      data-popup-action="accept_upgrade" 
                      id="5a05d5a2-b60b-bcb0-2aac-20cf2002e1af"
                      onClick={(e) => {
                        if (checkoutUrlDesconto.includes('seu-checkout-desconto')) {
                          e.preventDefault();
                          setTempCheckoutUrl(checkoutUrl);
                          setTempCheckoutUrlBasico(checkoutUrlBasico);
                          setTempCheckoutUrlDesconto(checkoutUrlDesconto);
                          setIsEditingCheckout(true);
                        } else {
                          const targetUrl = e.currentTarget.href || checkoutUrlDesconto;
                          const nativeEvent = e.nativeEvent as MouseEvent & { flagged?: boolean };
                          if (nativeEvent.flagged !== true && nativeEvent.isTrusted !== false) {
                            trackCheckoutClick('kit_desconto_popup', targetUrl, 'popup_upgrade');
                            scheduleCheckoutFallback(targetUrl);
                          }
                        }
                      }}
                    >
                      Quero o Kit Completo por R$ 24,90
                    </a>
                    <a 
                      href={checkoutUrlBasico}
                      className="upgrade-modal-secondary" 
                      data-checkout-type="plano_basico" 
                      data-checkout-label="Plano Básico" 
                      data-checkout-price="19.90" 
                      data-button-location="popup_upgrade" 
                      data-popup-action="decline_upgrade" 
                      id="55386d6f-317a-449d-103c-c48fff34d3e0"
                      onClick={(e) => {
                        if (checkoutUrlBasico.includes('seu-checkout-basico')) {
                          e.preventDefault();
                          setTempCheckoutUrl(checkoutUrl);
                          setTempCheckoutUrlBasico(checkoutUrlBasico);
                          setTempCheckoutUrlDesconto(checkoutUrlDesconto);
                          setIsEditingCheckout(true);
                        } else {
                          const targetUrl = e.currentTarget.href || checkoutUrlBasico;
                          const nativeEvent = e.nativeEvent as MouseEvent & { flagged?: boolean };
                          if (nativeEvent.flagged !== true && nativeEvent.isTrusted !== false) {
                            trackCheckoutClick('plano_basico', targetUrl, 'popup_upgrade');
                            scheduleCheckoutFallback(targetUrl);
                          }
                        }
                      }}
                    >
                      Não, quero continuar com o Plano Básico
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL DIALOG (PRODUCER LINK SETUP) */}
      <AnimatePresence>
        {isEditingCheckout && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0b] border-2 border-[#d6a84c] rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditingCheckout(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#d6a84c]/20 text-[#f0c86c] p-2 rounded-lg">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Configurar Links de Venda</h3>
                  <p className="text-xs text-gray-400">Insira seus links de checkout para cada produto.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#f0c86c] font-bold uppercase tracking-wider mb-1">URL: O KIT COMPLETO (R$ 29,90)</label>
                  <input
                    type="text"
                    value={tempCheckoutUrl}
                    onChange={(e) => setTempCheckoutUrl(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/xxxxx"
                    className="w-full bg-[#141414] border border-[#d6a84c]/30 hover:border-[#d6a84c]/60 focus:border-[#d6a84c] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#d6a84c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#f0c86c] font-bold uppercase tracking-wider mb-1">URL: GUIA BÁSICO (R$ 19,90)</label>
                  <input
                    type="text"
                    value={tempCheckoutUrlBasico}
                    onChange={(e) => setTempCheckoutUrlBasico(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/yyyyy"
                    className="w-full bg-[#141414] border border-[#d6a84c]/30 hover:border-[#d6a84c]/60 focus:border-[#d6a84c] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#d6a84c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#f0c86c] font-bold uppercase tracking-wider mb-1">URL: POPUP DESCONTO (R$ 24,90)</label>
                  <input
                    type="text"
                    value={tempCheckoutUrlDesconto}
                    onChange={(e) => setTempCheckoutUrlDesconto(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/zzzzz"
                    className="w-full bg-[#141414] border border-[#d6a84c]/30 hover:border-[#d6a84c]/60 focus:border-[#d6a84c] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#d6a84c]"
                  />
                </div>

                <div className="bg-[#d6a84c]/5 border border-[#d6a84c]/10 rounded-lg p-3 flex gap-2.5 items-start">
                  <Info className="w-4 h-4 text-[#f0c86c] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Estes links serão associados aos respectivos botões de compra de cada oferta. Os links serão mantidos de forma persistente e segura no seu navegador.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsEditingCheckout(false)}
                    className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white font-bold text-xs py-2.5 rounded-lg transition-colors uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => saveCheckoutUrls(tempCheckoutUrl, tempCheckoutUrlBasico, tempCheckoutUrlDesconto)}
                    className="flex-1 bg-[#d6a84c] hover:bg-[#f0c86c] text-[#17120a] font-bold text-xs py-2.5 rounded-lg transition-all uppercase tracking-wider"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
