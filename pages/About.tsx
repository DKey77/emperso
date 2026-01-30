import React, { useEffect } from 'react';
import { useGlobal } from '../App';
import Logo from '../components/Logo';

const About: React.FC = () => {
  const { settings } = useGlobal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light pt-32 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30">Our Story</span>
            <div className="h-px w-12 bg-black/10 dark:bg-white/10" />
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-display uppercase tracking-tighter leading-[0.9]">
            {settings.aboutPageTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Image Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[4/5] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-2xl">
              {settings.aboutPageImage ? (
                <img 
                  src={settings.aboutPageImage} 
                  alt="EMPERSO Workshop" 
                  className="w-full h-full object-cover animate-in fade-in duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <Logo className="w-32 h-auto" />
                </div>
              )}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 text-center">
              Since 2023 • Premium Quality Standards
            </p>
          </div>

          {/* Text Section */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                Бренд Справжньої Свободи
              </h2>
              <div className="h-px w-24 bg-black dark:bg-white opacity-10" />
              <p className="text-lg md:text-xl font-light leading-relaxed opacity-70 whitespace-pre-line text-justify">
                {settings.aboutPageText}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="p-8 border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Values</h4>
                <p className="text-sm font-bold uppercase tracking-wider">Якість понад усе</p>
              </div>
              <div className="p-8 border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Origin</h4>
                <p className="text-sm font-bold uppercase tracking-wider">Made In Ukraine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;