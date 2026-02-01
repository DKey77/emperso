import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, X, Maximize2 } from 'lucide-react';
import { useGlobal } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useGlobal();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | null>(null);
  const [fullsizeImage, setFullsizeImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      
      // SEO: Динамічне оновлення Title та Meta
      document.title = `${product.name} | EMPERSO Official`;
      
      // Додавання Schema.org JSON-LD для ШІ та Google
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": "EMPERSO"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "UAH",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      script.id = 'product-schema';
      document.head.appendChild(script);

      return () => {
        document.title = 'EMPERSO | Premium Apparel';
        const existingScript = document.getElementById('product-schema');
        if (existingScript) existingScript.remove();
      };
    }
  }, [product]);

  // Блокування скролу при відкритому Lightbox
  useEffect(() => {
    if (fullsizeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [fullsizeImage]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-40 text-center">
        <h2 className="text-3xl font-bold mb-8 uppercase">Товар не знайдено</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white uppercase font-bold text-xs tracking-widest">
          Назад до каталогу
        </button>
      </div>
    );
  }

  const nextImg = () => setCurrentImage((prev) => (prev + 1) % product.images.length);
  const prevImg = () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const nextFullImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentImage + 1) % product.images.length;
    setCurrentImage(nextIdx);
    setFullsizeImage(product.images[nextIdx]);
  };

  const prevFullImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentImage - 1 + product.images.length) % product.images.length;
    setCurrentImage(prevIdx);
    setFullsizeImage(product.images[prevIdx]);
  };

  // Swipe handling
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImg();
    if (isRightSwipe) prevImg();
  };

  const availableSizes = product.availableSizes || ['S', 'M', 'L'];

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 bg-brand-light dark:bg-brand-dark transition-colors duration-500 min-h-screen" itemScope itemType="https://schema.org/Product">
      <button 
        onClick={() => navigate('/')} 
        className="group flex items-center gap-3 text-[10px] uppercase font-black tracking-[0.3em] mb-12 opacity-40 hover:opacity-100 transition-all"
      >
        <div className="p-2 border border-black/10 dark:border-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
          <ArrowLeft size={14} />
        </div>
        Назад до колекції
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Advanced Carousel Section */}
        <div className="lg:col-span-7 relative">
          <div 
            className="relative h-[500px] md:h-[700px] w-full overflow-hidden flex items-center justify-center select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {product.images.map((img, idx) => {
              const isActive = idx === currentImage;
              const isPrev = idx === (currentImage - 1 + product.images.length) % product.images.length;
              const isNext = idx === (currentImage + 1) % product.images.length;

              let zIndex = 0;
              let scale = 0.8;
              let opacity = 0;
              let translateX = '0%';
              let blur = 'blur(0px)';

              if (isActive) {
                zIndex = 30;
                scale = 1;
                opacity = 1;
                translateX = '0%';
              } else if (isPrev) {
                zIndex = 20;
                scale = 0.85;
                opacity = 0.4;
                translateX = '-45%';
                blur = 'blur(4px)';
              } else if (isNext) {
                zIndex = 20;
                scale = 0.85;
                opacity = 0.4;
                translateX = '45%';
                blur = 'blur(4px)';
              } else {
                opacity = 0;
                scale = 0.7;
              }

              return (
                <div
                  key={idx}
                  className={`absolute w-full h-full max-w-[85%] md:max-w-[75%] transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1) ${isActive ? 'cursor-zoom-in' : 'cursor-pointer'}`}
                  style={{
                    transform: `translateX(${translateX}) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: blur
                  }}
                  onClick={() => {
                    if (isPrev) prevImg();
                    if (isNext) nextImg();
                    if (isActive) setFullsizeImage(img);
                  }}
                >
                  <div className="w-full h-full bg-black/5 dark:bg-white/5 overflow-hidden shadow-2xl relative group">
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx}`} 
                      className="w-full h-full object-cover"
                      draggable={false}
                      itemProp="image"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden md:flex">
                        <Maximize2 size={32} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Navigation Overlay */}
            {product.images.length > 1 && (
              <>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-40 pointer-events-none">
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    className="p-5 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-black/20 text-black dark:text-white rounded-full pointer-events-auto hover:bg-white dark:hover:bg-white hover:text-black dark:hover:text-black transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    className="p-5 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-black/20 text-black dark:text-white rounded-full pointer-events-auto hover:bg-white dark:hover:bg-white hover:text-black dark:hover:text-black transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-40">
                  {product.images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }}
                      className={`h-1.5 transition-all duration-500 rounded-full ${currentImage === idx ? 'bg-black dark:bg-white w-12' : 'bg-black/20 dark:bg-white/20 w-4'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30">
                {product.category}
              </span>
              <div className="h-px w-12 bg-black/10 dark:bg-white/10" />
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-dark dark:text-brand-light">
                In Stock
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase mb-6 leading-[0.9] tracking-tighter" itemProp="name">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4" itemProp="offers" itemScope itemType="https://schema.org/Offer">
               <meta itemProp="priceCurrency" content="UAH" />
               <p className="text-4xl font-black">₴<span itemProp="price">{product.price}</span></p>
            </div>
          </div>

          <div className="space-y-12 mb-16">
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">Оберіть розмір</h4>
               </div>
               <div className="flex gap-4">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-grow py-5 border-2 text-xs font-black transition-all ${
                        selectedSize === size 
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                          : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">ІНФОРМАЦІЯ</h4>
              <p className="text-lg font-light leading-relaxed opacity-70 border-l-2 border-black/5 dark:border-white/5 pl-8 py-2 whitespace-pre-line" itemProp="description">
                {product.description}
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <button 
              onClick={() => selectedSize && addToCart(product, selectedSize)}
              disabled={!selectedSize}
              className={`group relative w-full py-8 font-black uppercase tracking-[0.5em] text-sm overflow-hidden transition-all ${
                selectedSize 
                  ? 'bg-black text-white dark:bg-white dark:text-black active:scale-95' 
                  : 'bg-black/10 text-black/20 dark:bg-white/10 dark:text-white/20 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">
                {selectedSize ? 'Додати до кошика' : 'Оберіть розмір'}
              </span>
              {selectedSize && (
                <div className="absolute inset-0 bg-brand-light dark:bg-brand-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                 <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">Логістика</p>
                 <p className="text-[10px] font-black uppercase tracking-wider">Нова Пошта (1-2 дні)</p>
               </div>
               <div className="p-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                 <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">Транзакція</p>
                 <p className="text-[10px] font-black uppercase tracking-wider">Безпечна оплата</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {fullsizeImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setFullsizeImage(null)} />
          <button 
            onClick={() => setFullsizeImage(null)}
            className="absolute top-8 right-8 p-4 text-white hover:rotate-90 transition-transform duration-300 z-[220] bg-white/10 rounded-full backdrop-blur-md"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center z-[205]">
            <img 
              src={fullsizeImage} 
              className="max-w-full max-h-[90vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.1)] animate-in zoom-in-95 duration-500 select-none" 
              alt="EMPERSO Product"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;