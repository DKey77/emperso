import React, { useState } from 'react';
import { Lock, CheckCircle2, X, FileText, ChevronDown, ChevronUp, ShoppingBag, Plus, Minus, ZoomIn, Maximize2, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { useGlobal } from '../App';
import { Product } from '../types';

const Partnership: React.FC = () => {
  const { products, addToCart } = useGlobal();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [activeOffer, setActiveOffer] = useState<'wholesale' | 'dropshipping' | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectingSizeFor, setSelectingSizeFor] = useState<Product | null>(null);
  const [fullsizeImage, setFullsizeImage] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | null>(null);
  const [priceType, setPriceType] = useState<'drop' | 'opt'>('drop');
  const [quantity, setQuantity] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'emperso2026') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Невірний пароль');
    }
  };

  const resetPurchaseStates = () => {
    setSelectingSizeFor(null);
    setSelectedSize(null);
    setPriceType('drop');
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectingSizeFor || !selectedSize) return;
    const price = priceType === 'drop' ? selectingSizeFor.dropshippingPrice : selectingSizeFor.wholesalePrice;
    addToCart(selectingSizeFor, selectedSize, price, quantity);
    resetPurchaseStates();
  };

  const handlePriceTypeChange = (type: 'drop' | 'opt') => {
    setPriceType(type);
    if (type === 'opt') setQuantity(10);
    else setQuantity(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const OfferModal = ({ type, onClose }: { type: 'wholesale' | 'dropshipping', onClose: () => void }) => {
    const isWholesale = type === 'wholesale';
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-3xl bg-brand-light dark:bg-brand-dark p-6 md:p-12 shadow-2xl border border-black/10 dark:border-white/10 max-h-[85vh] overflow-y-auto custom-scrollbar rounded-2xl">
          <div className="flex justify-between items-start mb-8 border-b border-black/10 dark:border-white/10 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter">ПУБЛІЧНИЙ ДОГОВОР (ОФЕРТА)</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">— {isWholesale ? 'ОПТОВА КУПІВЛЯ-ПРОДАЖ' : 'ДРОПШИПІНГ'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors shrink-0"><X size={24} /></button>
          </div>
          <div className="space-y-8 text-xs md:text-sm font-light leading-relaxed opacity-80 text-justify">
             <p className="font-bold uppercase tracking-widest text-[11px] text-center mb-6">Даний документ регулює умови співпраці з брендом EMPERSO</p>
             <div className="space-y-6">
                <p>1. Використовуючи цей прайс-лист, ви погоджуєтесь з умовами ціноутворення та логістики бренду.</p>
                <p>2. Роздрібна ціна (РРЦ) є обов'язковою для дотримання всіма партнерами. Демпінг цін призводить до припинення співпраці.</p>
                <p>3. Повернення та обмін здійснюються згідно чинного законодавства та внутрішніх правил бренду.</p>
             </div>
          </div>
          <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col items-center">
             <button onClick={onClose} className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all">Я погоджуюсь з умовами</button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 pt-32">
        <div className="w-full max-w-md p-12 bg-white dark:bg-brand-dark shadow-2xl space-y-8 text-center border border-black/5 rounded-[2rem]">
          <div className="flex justify-center"><div className="p-4 bg-black/5 dark:bg-white/5 rounded-full"><Lock size={40} className="opacity-50" /></div></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Партнерська зона</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Тільки для верифікованих партнерів</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ВВЕДІТЬ ПАРОЛЬ" className="w-full px-4 py-4 bg-black/5 dark:bg-white/10 outline-none border-b-2 border-transparent focus:border-black dark:focus:border-white transition-all text-center text-xs tracking-[0.5em]" />
            {error && <p className="text-red-500 text-[10px] uppercase font-bold">{error}</p>}
            <button className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold uppercase text-xs tracking-widest hover:invert transition-all">Увійти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-48 pb-20">
      <div className="mb-20 text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter">Співпраця</h1>
        <p className="text-xs opacity-50 uppercase tracking-[0.4em]">Оптові ціни та Дропшипінг</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
        <div className="p-10 border border-black/10 dark:border-white/10 flex flex-col group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-black/20 pb-4">Умови ОПТ</h3>
          <ul className="space-y-5 text-sm font-light opacity-80 flex-grow">
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Мінімальне замовлення від 10 одиниць</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Пріоритетна відправка протягом 24 годин</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Маркетинговий контент для реклами</li>
          </ul>
          <button onClick={() => setActiveOffer('wholesale')} className="mt-12 flex items-center justify-center gap-3 py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl"><FileText size={16} /> Договір оферти ОПТ</button>
        </div>
        <div className="p-10 border border-black/10 dark:border-white/10 flex flex-col group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-black/20 pb-4">Дропшипінг</h3>
          <ul className="space-y-5 text-sm font-light opacity-80 flex-grow">
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Виплата прибутку кожного тижня</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Відправка напряму кінцевому клієнту</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Актуальні залишки 24/7</li>
          </ul>
          <button onClick={() => setActiveOffer('dropshipping')} className="mt-12 flex items-center justify-center gap-3 py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl"><FileText size={16} /> Договір оферти ДРОП</button>
        </div>
        <div className="p-10 bg-black text-white dark:bg-white dark:text-black flex flex-col shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/20 dark:border-black/20 pb-4">Контакт</h3>
          <p className="text-sm font-light opacity-70 leading-relaxed mb-12 flex-grow">Ми шукаємо амбітних партнерів, які цінують якість. Приєднуйтесь до родини EMPERSO.</p>
          <a href="https://t.me/EMPERSO_manager" target="_blank" rel="noopener noreferrer" className="w-full py-6 border-2 border-white dark:border-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all text-center">Зв'язатись у Telegram</a>
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Прайс-лист</h2>
          <div className="h-px flex-grow bg-black/10 dark:bg-white/10" />
        </div>
        
        {/* ПОВНІСТЮ ОНОВЛЕНА ТАБЛИЦЯ */}
        <div className="relative overflow-visible">
          <table className="w-full border-collapse">
            <thead className="sticky top-[64px] md:top-[80px] z-40">
              <tr className="bg-brand-light dark:bg-brand-dark border-b-2 border-black/20 dark:border-white/20">
                <th className="text-left py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">Товар</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">РРЦ (₴)</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">ДРОП (₴)</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">ОПТ (₴)</th>
                <th className="text-right py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">Дія</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {products.map(p => (
                <React.Fragment key={p.id}>
                  <tr 
                    onClick={() => toggleExpand(p.id)}
                    className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all group cursor-pointer ${expandedProductId === p.id ? 'bg-black/[0.04] dark:bg-white/[0.04]' : ''}`}
                  >
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 overflow-hidden bg-black/5 flex-shrink-0 border border-black/5 dark:border-white/5 rounded-lg shadow-sm">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                            {p.name}
                            <span className="opacity-30 group-hover:opacity-100 transition-opacity">
                              {expandedProductId === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                          </span>
                          <span className="text-[9px] opacity-40 uppercase font-bold tracking-widest">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center font-black opacity-30 text-xs">₴{p.price}</td>
                    <td className="py-8 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-brand-dark dark:text-brand-light text-sm">₴{p.dropshippingPrice}</span>
                        <div className="mt-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
                           <span className="text-[8px] font-black text-green-600 dark:text-green-400 uppercase tracking-tighter">ЗАРОБІТОК: +₴{p.price - p.dropshippingPrice}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-lg text-brand-dark dark:text-brand-light">₴{p.wholesalePrice}</span>
                        <div className="mt-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
                           <span className="text-[8px] font-black text-green-600 dark:text-green-400 uppercase tracking-tighter">ЗАРОБІТОК: +₴{p.price - p.wholesalePrice}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectingSizeFor(p); }} 
                        className="px-6 md:px-10 py-3 bg-black text-white dark:bg-white dark:text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                      >
                        Замовити
                      </button>
                    </td>
                  </tr>
                  {expandedProductId === p.id && (
                    <tr className="bg-black/[0.03] dark:bg-white/[0.03]">
                      <td colSpan={5} className="px-4 py-12 md:py-20 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                          <div className="md:col-span-5 space-y-6">
                            <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mb-4">Медіа-галерея</h4>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                              {p.images.map((img, i) => (
                                <div key={i} onClick={() => setFullsizeImage(img)} className="group relative h-72 w-56 flex-shrink-0 snap-center cursor-zoom-in overflow-hidden shadow-xl border border-black/5">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><Maximize2 size={24} className="text-white" /></div>
                                </div>
                              ))}
                            </div>
                            <p className="text-[8px] opacity-30 uppercase tracking-[0.2em]">Гортайте вбік для перегляду всіх фото</p>
                          </div>
                          <div className="md:col-span-7 space-y-12">
                            <div className="space-y-4">
                              <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">Про продукт</h4>
                              <p className="text-sm md:text-base font-light leading-relaxed opacity-80 whitespace-pre-line border-l border-black/10 dark:border-white/10 pl-8">{p.description}</p>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">Наявні розміри</h4>
                              <div className="flex flex-wrap gap-2">
                                {p.availableSizes.map(s => (<span key={s} className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase shadow-sm">{s}</span>))}
                              </div>
                            </div>
                            <button 
                               onClick={() => setSelectingSizeFor(p)} 
                               className="w-full py-6 border-2 border-black dark:border-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                             >
                               Оформити швидку закупку
                             </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS REMAIN THE SAME BUT ENSURE Z-INDEX */}
      {fullsizeImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setFullsizeImage(null)} />
          <button onClick={() => setFullsizeImage(null)} className="absolute top-8 right-8 p-4 text-white hover:rotate-90 transition-transform duration-300 z-[210]"><X size={40} /></button>
          <div className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center z-[205]"><img src={fullsizeImage} className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500" alt="EMPERSO" /></div>
        </div>
      )}

      {selectingSizeFor && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={resetPurchaseStates} />
          <div className="relative w-full max-w-md bg-brand-light dark:bg-brand-dark p-8 md:p-12 shadow-2xl border border-black/10 dark:border-white/10 rounded-3xl space-y-8 animate-in zoom-in duration-300">
            <div className="text-center"><p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30 mb-2">Оберіть параметри</p><h3 className="text-2xl font-black uppercase tracking-tighter">{selectingSizeFor.name}</h3></div>
            <div className="space-y-6">
               <div className="space-y-3"><h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">1. Розмір:</h4><div className="flex justify-center gap-3">{selectingSizeFor.availableSizes.map(size => (<button key={size} onClick={() => setSelectedSize(size)} className={`w-14 h-14 flex items-center justify-center border-2 transition-all font-black text-sm ${selectedSize === size ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-black/10 dark:border-white/10 hover:border-black/30'}`}>{size}</button>))}</div></div>
               <div className="space-y-3"><h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">2. Тариф:</h4><div className="grid grid-cols-2 gap-3"><button onClick={() => handlePriceTypeChange('drop')} className={`py-4 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${priceType === 'drop' ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-black/5 opacity-40'}`}>ДРОП<p className="text-[9px] opacity-60">₴{selectingSizeFor.dropshippingPrice}</p></button><button onClick={() => handlePriceTypeChange('opt')} className={`py-4 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${priceType === 'opt' ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-black/5 opacity-40'}`}>ОПТ (10+)<p className="text-[9px] opacity-60">₴{selectingSizeFor.wholesalePrice}</p></button></div></div>
               <div className="space-y-3"><h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">3. Кількість:</h4><div className="flex items-center justify-center gap-6"><button disabled={priceType === 'opt' ? quantity <= 10 : quantity <= 1} onClick={() => setQuantity(q => q - 1)} className="p-3 border border-black/10 disabled:opacity-20"><Minus size={20} /></button><span className="text-3xl font-black min-w-[3rem] text-center">{quantity}</span><button onClick={() => setQuantity(q => q + 1)} className="p-3 border border-black/10"><Plus size={20} /></button></div></div>
            </div>
            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center px-2"><span className="text-[10px] font-black uppercase opacity-40">Разом до оплати:</span><span className="text-2xl font-black">₴{(priceType === 'drop' ? selectingSizeFor.dropshippingPrice : selectingSizeFor.wholesalePrice) * quantity}</span></div>
              <button disabled={!selectedSize} onClick={handleAddToCart} className={`w-full py-6 font-black uppercase text-xs tracking-[0.4em] transition-all ${selectedSize ? 'bg-black text-white dark:bg-white dark:text-black hover:invert active:scale-95' : 'bg-black/5 text-black/20 cursor-not-allowed'}`}>{selectedSize ? 'Додати в кошик' : 'Оберіть розмір'}</button>
            </div>
          </div>
        </div>
      )}

      {activeOffer && <OfferModal type={activeOffer} onClose={() => setActiveOffer(null)} />}
    </div>
  );
};

export default Partnership;