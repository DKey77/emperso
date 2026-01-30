import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Logo from '../components/Logo';
import { useGlobal } from '../App';
import { Instagram, Send } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const CATEGORIES_MAP = ['ВСЕ', 'ХУДІ', 'ФУТБОЛКИ'];

const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Home: React.FC = () => {
  const { products } = useGlobal();
  const [activeCategory, setActiveCategory] = useState('ВСЕ');
  const collectionRef = useRef<HTMLDivElement>(null);

  // Сортуємо: спочатку Featured, потім всі інші
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isFeatured === b.isFeatured) return 0;
    return a.isFeatured ? -1 : 1;
  });

  const filteredProducts = activeCategory === 'ВСЕ' 
    ? sortedProducts 
    : sortedProducts.filter(p => {
        if (activeCategory === 'ХУДІ') return p.category === 'Hoodies';
        if (activeCategory === 'ФУТБОЛКИ') return p.category === 'T-Shirts';
        return p.category === activeCategory;
      });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = document.querySelectorAll('.product-card-reveal');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredProducts]);

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark transition-colors duration-500">
      <Hero />

      <section id="collection" ref={collectionRef} className="py-24 px-6 container mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] opacity-30">Selection</p>
            <h3 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter">Колекція</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {CATEGORIES_MAP.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] uppercase font-black tracking-widest px-8 py-4 border transition-all duration-500 ${
                  activeCategory === cat 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xl' 
                    : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white opacity-40 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card-reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-40 opacity-20 text-2xl font-black uppercase tracking-[0.3em] animate-pulse">
            Незабаром у наявності
          </div>
        )}
      </section>

      <section className="py-32 bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-white overflow-hidden relative transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-black dark:bg-white blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-black dark:bg-white blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-12">
            <Logo className="w-full max-w-[18rem] md:max-w-[45rem] opacity-5 text-black dark:text-white transition-colors duration-500" />
          </div>
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              МИ У СОЦМЕРЕЖАХ
            </h2>
            
            <div className="flex justify-center items-center gap-8 md:gap-14">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
                <div className="p-4 md:p-5 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                  <Instagram size={28} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">Instagram</span>
              </a>
              <a href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
                <div className="p-4 md:p-5 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                  <TikTokIcon size={28} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">TikTok</span>
              </a>
              <a href={CONTACT_INFO.telegram} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
                <div className="p-4 md:p-5 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                  <Send size={28} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">Telegram</span>
              </a>
            </div>
            <div className="h-px w-24 bg-black/10 dark:bg-white/20 mx-auto transition-colors duration-500" />
            <p className="text-xs uppercase tracking-[0.5em] opacity-40">Since 2023 • Premium Oversize Era</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;