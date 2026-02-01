import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useGlobal } from '../App';
import Logo from './Logo';

const Hero: React.FC = () => {
  const { settings, isLoading } = useGlobal();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const totalScrollable = containerHeight - viewHeight;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (settings.heroImage) {
      const img = new Image();
      img.src = settings.heroImage;
      img.onload = () => { setTimeout(() => setImageLoaded(true), 200); };
      img.onerror = () => { setImageLoaded(true); }; 
    } else if (!isLoading) {
      setImageLoaded(true);
    }
  }, [settings.heroImage, isLoading]);

  const heroOpacity = imageLoaded ? Math.max(0, 1 - scrollProgress * 2.5) : 0;
  const heroScale = 1 + scrollProgress * 0.1;
  const heroBlur = `blur(${scrollProgress * 6}px)`;
  
  const aboutOpacity = Math.min(Math.max((scrollProgress - 0.4) * 2.5, 0), 1);
  const aboutTranslate = 30 * (1 - aboutOpacity);
  
  const bgBrightness = 1 - scrollProgress * 0.5;

  return (
    <div 
      ref={containerRef} 
      className="relative h-[200vh] w-full bg-brand-dark"
    >
      {/* Sticky container uses 100dvh to prevent jumping when URL bar hides */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-brand-dark sticky-gpu">
        {/* Background Image Layer */}
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-out will-change-transform ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: settings.heroImage ? `url('${settings.heroImage}')` : 'none',
            transform: `scale(${heroScale})`,
            filter: `brightness(${bgBrightness}) ${heroBlur}`,
          }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-brand-dark" />
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 z-[50] flex items-center justify-center bg-brand-dark">
             <div className="flex flex-col items-center gap-6">
               <Logo className="h-12 md:h-16 w-auto text-white opacity-40 animate-pulse" />
               <div className="h-[1px] w-20 bg-white/10 overflow-hidden relative">
                 <div className="h-full bg-white/40 absolute inset-y-0 animate-loading-bar" />
               </div>
             </div>
          </div>
        )}

        {/* Main Logo Content */}
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 will-change-[opacity,transform]"
          style={{ 
            opacity: heroOpacity, 
            transform: `translateY(${-scrollProgress * 50}px)`,
            pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto' 
          }}
        >
          <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-[90vw] md:max-w-[70vw]">
            <Logo className="w-full h-auto text-white drop-shadow-2xl" />
            <p className="text-[10px] md:text-xl font-black tracking-[0.5em] md:tracking-[0.8em] uppercase text-white/40">
              EST. 2023 • PREMIUM OVERSIZE
            </p>
          </div>
          <div className={`absolute bottom-12 transition-all duration-700 ${scrollProgress > 0.05 ? 'opacity-0 translate-y-10' : 'opacity-40 animate-bounce'}`}>
            <ArrowDown size={24} className="mx-auto text-white" />
          </div>
        </div>

        {/* Philosophy Content */}
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center px-6 will-change-[opacity,transform]"
          style={{ 
            opacity: aboutOpacity,
            transform: `translateY(${aboutTranslate}px)`,
            pointerEvents: aboutOpacity > 0.1 ? 'auto' : 'none'
          }}
        >
          <div className="max-w-7xl w-full flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-24 items-center">
            <div className="md:col-span-5 w-full space-y-4 md:space-y-8 text-center md:text-left">
              <div className="inline-block px-4 py-1 border border-white/20 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Philosophy</div>
              <h2 className="text-3xl md:text-8xl font-black font-display text-white uppercase leading-[0.85] tracking-tighter">
                {settings.homeAboutTitle}
              </h2>
            </div>
            <div className="md:col-span-7 space-y-8 md:space-y-12 w-full">
              <div className="space-y-6 text-[11px] md:text-xl font-light text-white/70 leading-[1.8] whitespace-pre-line text-center md:text-left max-w-2xl md:border-l md:border-white/10 md:pl-12">
                <p>{settings.homeAboutText}</p>
              </div>
              <div className="flex justify-center md:justify-start pt-2">
                <button 
                  onClick={() => { const el = document.getElementById('collection'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="group relative px-10 md:px-16 py-4 md:py-6 bg-white text-brand-dark text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Перейти до колекції</span>
                  <div className="absolute inset-0 bg-brand-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;