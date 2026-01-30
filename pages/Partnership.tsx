import React, { useState } from 'react';
import { Lock, CheckCircle2, X, FileText, ChevronDown, ChevronUp, ShoppingBag, Plus, Minus, ZoomIn, Maximize2 } from 'lucide-react';
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

  // New states for the purchase modal
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
    if (type === 'opt') {
      setQuantity(10);
    } else {
      setQuantity(1);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const OfferModal = ({ type, onClose }: { type: 'wholesale' | 'dropshipping', onClose: () => void }) => {
    const isWholesale = type === 'wholesale';
    
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-3xl bg-brand-light dark:bg-brand-dark p-6 md:p-12 shadow-2xl border border-black/10 dark:border-white/10 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8 border-b border-black/10 dark:border-white/10 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter">
                ПУБЛІЧНИЙ ДОГОВОР (ОФЕРТА)
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                — {isWholesale ? 'ОПТОВА КУПІВЛЯ-ПРОДАЖ' : 'ДРОПШИПІНГ'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors shrink-0">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 text-xs md:text-sm font-light leading-relaxed opacity-80 text-justify">
            {isWholesale ? (
              <>
                <p className="font-medium text-center italic">на оптову купівлю-продаж одягу бренду EMPERSO</p>
                
                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">1. ЗАГАЛЬНІ ПОЛОЖЕННЯ</p>
                  <p>1.1. Цей документ є офіційною та публічною пропозицією (публічним договором, офертою) ФОП Брежнєвої Наталії Леонідівни (далі — «Продавець»), адресованою невизначеному колу осіб (далі — «Оптовий Партнер»), укласти договір оптової купівлі-продажу товарів на умовах, викладених нижче.</p>
                  <p>1.2. Шляхом акцепту цієї оферти Партнер погоджується з усіма її умовами без змін. Акцептом вважається здійснення повної передоплати за замовлення відповідно до виставленого рахунку. З моменту акцепту договір укладено.</p>
                  <p>1.3. Партнер підтверджує, що він є юридичною особи або фізичною особою-підприємцем, який здійснює господарську діяльність та закуповує товар для подальшої перепродажі.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">2. ПРЕДМЕТ ДОГОВОРУ</p>
                  <p>2.1. Продавець зобов’язується передати у власність Оптовому Партнеру товари бренду EMPERSO, а Оптовий Партнер зобов’язується прийняти та оплатити Товар на умовах цього договору.</p>
                  <p>2.2. Асортимент, характеристики та ціни визначаються актуальним Оптовим прайс-листом, розміщеним в захищеній партнерській зоні на сайті після авторизації.</p>
                  <p>2.3. Мінімальна сума оптового замовлення становить 5 000 гривень без урахування доставки. Продавець може змінювати мінімальну суму, попередивши партнерів за 5 робочих днів.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">3. ПОРЯДОК ОФОРМЛЕННЯ ТА ОПЛАТИ</p>
                  <p>3.1. Оптовий Партнер формує заявку шляхом відправки повного списку товарів з артикулом, розміром та кількістю на електронну пошту або через месенджер.</p>
                  <p>3.2. Після узгодження наявності та вартості Продавець виставляє рахунок на оплату з урахуванням оптових цін.</p>
                  <p>3.3. Запас резервується лише після отримання 100% передоплати. Термін резерву — до 5 робочих днів.</p>
                  <p>3.4. Замовлення комплектується та відправляється протягом 1–3 робочих днів після підтвердження оплати.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">4. УМОВИ ДОСТАВКИ</p>
                  <p>4.1. Доставка здійснюється службою «Нова Пошта» за рахунок Оптового Партнера, якщо інше не узгоджено.</p>
                  <p>4.2. Ризик втрати або пошкодження переходить на Оптовий Партнера з моменту передачі посилки службі доставки.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">5. ГАРАНТІЇ ТА УМОВИ ПОВЕРНЕННЯ</p>
                  <p>5.1. Продавець гарантує відповідність якості товару опису в партнерській зоні.</p>
                  <p>5.2. Товар належної якості, придбаний оптом, обміну та поверненню не підлягає.</p>
                  <p>5.3. У разі виробничого браку Партнер може пред'явити претензію протягом 3 календарних днів з моменту отримання, надавши фото/відеодокази. Повернення здійснюється за рахунок Продавця; після перевірки здійснюється заміна або повернення коштів.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">6. ВІДПОВІДАЛЬНІСТЬ СТОРІН</p>
                  <p>6.1. За порушення термінів оплати або відмову від оплаченого замовлення Продавець має право стягнути штраф у розмірі 20% від суми замовлення.</p>
                  <p>6.2. Усі спори вирішуються шляхом переговорів, або за неможливості — відповідно до чинного законодавства України.</p>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium text-center italic">на надання послуг з організації дропшипінгу товарів бренду EMPERSO</p>
                
                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">1. ЗАГАЛЬНІ ПОЛОЖЕННЯ</p>
                  <p>1.1. Цей документ є офіційною пропозицією (публічним договором, офертою) ФОП Брежнєвої Наталії Леонідівни (далі — «Постачальник»), укладену для співпраці за моделлю дропшипінг.</p>
                  <p>1.2. Дропшип-Партнером може бути юридична особа або ФОП; акцептом оферти вважається успішна реєстрація/авторизація в партнерській зоні та подання першого замовлення.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">2. ПРЕДМЕТ ДОГОВОРУ</p>
                  <p>2.1. Постачальник надає Партнеру право на перепродаж товарів EMPERSO кінцевим споживачам, а також здійснює зберігання, пакування та пряму відправку товару Покупцям за дорученням Партнера.</p>
                  <p>2.2. Партнер формує роздрібну ціну; дропшип-прайс є конфіденційною інформацією в партнерській зоні.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">3. ПОРЯДОК ВЗАЄМОДІЇ</p>
                  <p>3.1. Партнер приймає оплату від Покупця через власні платіжні рішення.</p>
                  <p>3.2. Партнер перераховує на рахунок Постачальника суму: дропшип-прайс + вартість доставки + пакування.</p>
                  <p>3.3. Після підтвердження оплати Партнер надає точні дані для відправки: ПІБ Покупця, телефон, адресу.</p>
                  <p>3.4. Постачальник упаковує товар у нейтральне пакування або з логотипом Партнера (за домовленістю) та відправляє протягом 1–2 робочих днів; трек-номер надається Партнеру.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">4. ВІДПОВІДАЛЬНІСТЬ СТОРІН ТА ГАРАНТІЇ</p>
                  <p>4.1. Постачальник відповідає за наявність товару, його відповідність опису та відправку за наданими даними.</p>
                  <p>4.2. Партнер відповідає за інформаційний супровід, прийом платежів та відповідність вимогам законодавства щодо прав споживачів.</p>
                  <p>4.3. У разі виробничого браку Партнер організовує повернення згідно інструкцій Постачальника; вартість доставки при поверненні покриває Постачальник.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-black uppercase tracking-widest text-[11px]">5. КОНФІДЕНЦІЙНІСТЬ ТА ОБРОБКА ДАНИХ</p>
                  <p>5.1. Умови дропшипінг-прайсу та комерційні аспекти є конфіденційними; Партнер зобов'язується не розголошувати їх.</p>
                  <p>5.2. Партнер самостійно та відповідально обробляє персональні дані Покупців згідно з законом; Постачальник обробляє дані лише для відправки замовлення.</p>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-4">
             <button 
               onClick={onClose}
               className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
             >
               Я погоджуюсь з умовами
             </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 pt-32">
        <div className="w-full max-w-md p-12 bg-white dark:bg-white/5 shadow-2xl space-y-8 text-center border border-black/5">
          <div className="flex justify-center">
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-full">
              <Lock size={40} className="opacity-50" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Партнерська зона</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Тільки для верифікованих партнерів</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ВВЕДІТЬ ПАРОЛЬ"
              className="w-full px-4 py-4 bg-black/5 dark:bg-white/10 outline-none border-b-2 border-transparent focus:border-black dark:focus:border-white transition-all text-center text-xs tracking-[0.5em]"
            />
            {error && <p className="text-red-500 text-[10px] uppercase font-bold">{error}</p>}
            <button className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold uppercase text-xs tracking-widest hover:invert transition-all">
              Увійти
            </button>
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
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-black/20 dark:border-white/20 pb-4">Умови ОПТ</h3>
          <ul className="space-y-5 text-sm font-light opacity-80 flex-grow">
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Мінімальне замовлення від 10 одиниць</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Пріоритетна відправка протягом 24 годин</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> фото/відео контент</li>
          </ul>
          <button 
            onClick={() => setActiveOffer('wholesale')}
            className="mt-12 flex items-center justify-center gap-3 py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl"
          >
            <FileText size={16} /> Договір оферти ОПТ
          </button>
        </div>

        <div className="p-10 border border-black/10 dark:border-white/10 flex flex-col group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-black/20 dark:border-white/20 pb-4">Дропшипінг</h3>
          <ul className="space-y-5 text-sm font-light opacity-80 flex-grow">
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Виплата прибутку кожного тижня</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> Відправка напряму клієнту</li>
            <li className="flex gap-4 items-start"><CheckCircle2 size={16} className="shrink-0 mt-0.5 opacity-40" /> фото/відео контент</li>
          </ul>
          <button 
            onClick={() => setActiveOffer('dropshipping')}
            className="mt-12 flex items-center justify-center gap-3 py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl"
          >
            <FileText size={16} /> Договір оферти ДРОП
          </button>
        </div>

        <div className="p-10 bg-black text-white dark:bg-white dark:text-black flex flex-col shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/20 dark:border-black/20 pb-4">Контакт</h3>
          <p className="text-sm font-light opacity-70 leading-relaxed mb-12 flex-grow">
            Ми шукаємо амбітних партнерів, які цінують якість та стиль. 
          </p>
          <a 
            href="https://t.me/EMPERSO_manager" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-6 border-2 border-white dark:border-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all text-center"
          >
            Зв'язатись у Telegram
          </a>
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Прайс-лист</h2>
          <div className="h-px flex-grow bg-black/10 dark:bg-white/10" />
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black/20 dark:border-white/20">
                <th className="text-left py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">Товар</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">РРЦ (₴)</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">ДРОП (₴)</th>
                <th className="text-center py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">ОПТ (₴)</th>
                <th className="text-right py-6 px-4 text-[10px] uppercase font-black tracking-widest opacity-40">Дія</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <React.Fragment key={p.id}>
                  <tr 
                    onClick={() => toggleExpand(p.id)}
                    className={`border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer ${expandedProductId === p.id ? 'bg-black/[0.03] dark:bg-white/[0.03]' : ''}`}
                  >
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 overflow-hidden bg-black/5 flex-shrink-0 border border-black/5 dark:border-white/5">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-wider flex items-center gap-3">
                          {p.name}
                          {expandedProductId === p.id ? <ChevronUp size={16} className="opacity-30" /> : <ChevronDown size={16} className="opacity-30" />}
                        </span>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-center font-medium opacity-60">₴{p.price}</td>
                    <td className="py-8 px-4 text-center font-black text-brand-dark dark:text-brand-light">₴{p.dropshippingPrice}</td>
                    <td className="py-8 px-4 text-center font-black text-xl">₴{p.wholesalePrice}</td>
                    <td className="py-8 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectingSizeFor(p);
                        }}
                        className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-lg active:scale-95"
                      >
                        Придбати
                      </button>
                    </td>
                  </tr>
                  
                  {expandedProductId === p.id && (
                    <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
                      <td colSpan={5} className="px-4 py-16 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                          
                          {/* Photo Gallery (Improved Slider) */}
                          <div className="md:col-span-6 space-y-4">
                            <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mb-4">Галерея продукту</h4>
                            <div className="flex gap-4 overflow-x-auto pb-6 px-2 custom-scrollbar snap-x">
                              {p.images.map((img, i) => (
                                <div 
                                  key={i} 
                                  onClick={() => setFullsizeImage(img)}
                                  className="group relative h-80 w-64 flex-shrink-0 snap-center cursor-zoom-in overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]"
                                >
                                  <img src={img} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={32} className="text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-[9px] opacity-30 uppercase tracking-widest text-center">Натисніть на фото для збільшення • Скрольте горизонтально</p>
                          </div>

                          {/* Info Column */}
                          <div className="md:col-span-6 space-y-10">
                            <div>
                              <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mb-4">Детальна інформація</h4>
                              <p className="text-base font-light leading-relaxed max-w-xl opacity-80 whitespace-pre-line">{p.description}</p>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30">Розмірна сітка</h4>
                              <div className="flex flex-wrap gap-2">
                                {p.availableSizes.map(s => (
                                  <span key={s} className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black uppercase">{s}</span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-6">
                               <button 
                                 onClick={() => setSelectingSizeFor(p)}
                                 className="w-full py-5 border-2 border-black dark:border-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                               >
                                 Швидке замовлення
                               </button>
                            </div>
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

      {/* Lightbox (Fullsize Image Modal) */}
      {fullsizeImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setFullsizeImage(null)} />
          <button 
            onClick={() => setFullsizeImage(null)}
            className="absolute top-8 right-8 p-4 text-white hover:rotate-90 transition-transform duration-300 z-[210]"
          >
            <X size={40} />
          </button>
          <div className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center z-[205]">
            <img 
              src={fullsizeImage} 
              className="max-w-full max-h-[90vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.1)] animate-in zoom-in-95 duration-500" 
              alt="EMPERSO Product"
            />
          </div>
        </div>
      )}

      {/* Purchase Modal (Price Selection + Qty) */}
      {selectingSizeFor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={resetPurchaseStates} />
          <div className="relative w-full max-w-md bg-brand-light dark:bg-brand-dark p-8 md:p-12 shadow-2xl border border-black/10 dark:border-white/10 rounded-3xl space-y-8 animate-in zoom-in duration-300">
            <div className="text-center">
              <p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30 mb-2">Оформлення</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{selectingSizeFor.name}</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-3">
                 <h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">1. Оберіть розмір:</h4>
                 <div className="flex justify-center gap-3">
                    {selectingSizeFor.availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 flex items-center justify-center border-2 transition-all font-black text-sm ${
                          selectedSize === size 
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                            : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">2. Тип ціни:</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handlePriceTypeChange('drop')}
                      className={`py-4 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        priceType === 'drop'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                          : 'border-black/5 dark:border-white/5 opacity-40'
                      }`}
                    >
                      Дропшипінг
                      <p className="text-[9px] opacity-60">₴{selectingSizeFor.dropshippingPrice}</p>
                    </button>
                    <button 
                      onClick={() => handlePriceTypeChange('opt')}
                      className={`py-4 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        priceType === 'opt'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                          : 'border-black/5 dark:border-white/5 opacity-40'
                      }`}
                    >
                      ОПТ (від 10 шт)
                      <p className="text-[9px] opacity-60">₴{selectingSizeFor.wholesalePrice}</p>
                    </button>
                 </div>
               </div>

               <div className="space-y-3">
                 <h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50">3. Кількість:</h4>
                 <div className="flex items-center justify-center gap-6">
                    <button 
                      disabled={priceType === 'opt' ? quantity <= 10 : quantity <= 1}
                      onClick={() => setQuantity(q => q - 1)}
                      className="p-3 border border-black/10 dark:border-white/10 disabled:opacity-20"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-black min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 border border-black/10 dark:border-white/10"
                    >
                      <Plus size={20} />
                    </button>
                 </div>
                 {priceType === 'opt' && (
                   <p className="text-[9px] font-black text-center text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                     Мінімальне замовлення для оптової ціни — 10 шт.
                   </p>
                 )}
               </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase opacity-40">Разом за позицію:</span>
                <span className="text-2xl font-black">₴{(priceType === 'drop' ? selectingSizeFor.dropshippingPrice : selectingSizeFor.wholesalePrice) * quantity}</span>
              </div>
              <button 
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`w-full py-6 font-black uppercase text-xs tracking-[0.4em] transition-all ${
                  selectedSize 
                    ? 'bg-black text-white dark:bg-white dark:text-black hover:invert active:scale-95' 
                    : 'bg-black/5 text-black/20 dark:bg-white/5 dark:text-white/20 cursor-not-allowed'
                }`}
              >
                {selectedSize ? 'Додати до кошика' : 'Спершу оберіть розмір'}
              </button>
              <button 
                onClick={resetPurchaseStates}
                className="w-full text-[10px] uppercase font-black tracking-widest opacity-30 hover:opacity-100 transition-opacity"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {activeOffer && (
        <OfferModal type={activeOffer} onClose={() => setActiveOffer(null)} />
      )}
    </div>
  );
};

export default Partnership;