import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../App';
import { Order, CartItem } from '../types';
import { ArrowLeft, Truck, ShieldCheck, CreditCard, Search, Loader2, MessageSquare, Check, ChevronDown, ShoppingBag, Mail, User, Phone, MapPin, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';

const NP_API_KEY = 'e5f65cbb434b5037a4321e1e7299e4a3';
const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';
const TG_BOT_TOKEN = '8297791353:AAGFqxqXvvQJyz77XqwYKq153KCdYRcmi0w';

interface NPCity {
  Present: string;
  DeliveryCity: string;
  MainDescription: string;
}

interface NPWarehouse {
  Description: string;
  Ref: string;
}

const Checkout: React.FC = () => {
  const { cart, clearCart, setOrders, settings } = useGlobal();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NPCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NPCity | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [warehouseQuery, setWarehouseQuery] = useState('');
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  
  const cityTimeoutRef = useRef<number | null>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const warehouseDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) setShowCityDropdown(false);
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(event.target as Node)) setShowWarehouseDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async (query: string) => {
    if (query.trim().length < 2) return;
    setLoadingCities(true);
    try {
      const response = await fetch(NP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: NP_API_KEY,
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: { CityName: query, Limit: "20", Page: "1" }
        })
      });
      const result = await response.json();
      if (result.success && result.data && result.data[0]?.Addresses) {
        setCities(result.data[0].Addresses);
      }
    } catch (err) {
      console.error("NP Cities fetch failed:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchWarehouses = async (cityRef: string) => {
    setLoadingWarehouses(true);
    try {
      const response = await fetch(NP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: NP_API_KEY,
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: { CityRef: cityRef }
        })
      });
      const result = await response.json();
      if (result.success) setWarehouses(result.data || []);
    } catch (err) {
      console.error("NP Warehouses fetch failed:", err);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCityQuery(val);
    setSelectedCity(null);
    setShowCityDropdown(true);
    if (cityTimeoutRef.current) window.clearTimeout(cityTimeoutRef.current);
    cityTimeoutRef.current = window.setTimeout(() => fetchCities(val), 500);
  };

  const handleSelectCity = (city: NPCity) => {
    setSelectedCity(city);
    setCityQuery(city.Present);
    setShowCityDropdown(false);
    fetchWarehouses(city.DeliveryCity);
  };

  const total = cart.reduce((sum, item) => sum + (item.selectedPrice || item.product.price) * item.quantity, 0);

  const sendTelegramNotification = async (orderId: string, fullAddress: string, chatId: string) => {
    if (!chatId) return;

    const itemsText = cart.map((item, index) => {
      const price = item.selectedPrice || item.product.price;
      return `${index + 1}. <b>${item.product.name}</b>\n   Розмір: <code>${item.size}</code> | К-сть: <code>${item.quantity}</code>\n   Сума: ₴${price * item.quantity}`;
    }).join('\n\n');
    
    const fullMessage = `📦 <b>НОВЕ ЗАМОВЛЕННЯ #${orderId}</b>\n` +
      `---------------------------\n` +
      `👤 <b>Клієнт:</b> ${formData.name}\n` +
      `📞 <b>Телефон:</b> <code>${formData.phone}</code>\n` +
      `📍 <b>Адреса:</b> ${fullAddress}\n` +
      `💰 <b>РАЗОМ: ₴${total}</b>\n` +
      `💳 <b>Оплата:</b> ${paymentMethod === 'cash' ? 'Післяплата' : 'Картка'}\n` +
      (formData.comment ? `💬 <b>Коментар:</b> "${formData.comment}"\n` : '') +
      `---------------------------\n` +
      `🛒 <b>ТОВАРИ:</b>\n\n${itemsText}`;

    try {
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: fullMessage,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;
    
    if (!selectedCity || !selectedWarehouse) {
      alert("Оберіть місто та відділення Нової Пошти зі списку.");
      return;
    }

    setIsSubmitting(true);
    const orderId = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullAddress = `${selectedCity.Present}, ${selectedWarehouse}`;

    // Створюємо об'єкт замовлення
    const optimizedItems = cart.map(item => ({
      p_id: item.product.id,
      n: item.product.name,
      s: item.size,
      q: item.quantity,
      pr: item.selectedPrice || item.product.price,
      img: item.product.images[0] // Зберігаємо тільки одне фото для економії місця
    }));

    const dbOrder = {
      id: orderId,
      items: optimizedItems,
      total,
      customer: { 
        name: formData.name, 
        phone: formData.phone, 
        email: formData.email, 
        address: fullAddress, 
        comment: formData.comment 
      },
      payment_method: paymentMethod,
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      // КЛЮЧОВЕ: Запускаємо сповіщення і запис в базу ОДНОЧАСНО
      const notificationPromise = sendTelegramNotification(orderId, fullAddress, settings.telegramChatId);
      const dbPromise = supabase.from('orders').insert(dbOrder);

      const [_, dbResult] = await Promise.all([notificationPromise, dbPromise]);
      
      if (dbResult.error) throw new Error(dbResult.error.message);

      setOrders(prev => [{ ...dbOrder, items: cart, paymentMethod: paymentMethod } as any, ...prev]);
      setLastOrderId(orderId);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error("Order process error:", err);
      alert(`Помилка оформлення. Перевірте інтернет та спробуйте ще раз.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="text-center space-y-12 px-6 w-full max-w-4xl">
          <Check size={64} className="mx-auto text-green-500 animate-bounce" />
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">ВЗЯТО В РОБОТУ</h2>
          <p className="text-xl font-black tracking-widest opacity-40 uppercase">ЗАМОВЛЕННЯ № {lastOrderId}</p>
          <button onClick={() => navigate('/')} className="px-16 py-6 border-2 border-black dark:border-white text-xs font-black uppercase tracking-widest hover:invert transition-all">На головну</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-48 pb-32">
      <div className="mb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={14} /> Повернутися
        </button>
        <h1 className="text-5xl md:text-8xl font-black font-display uppercase tracking-tighter">Оформлення</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
        <div className="lg:col-span-7 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-brand-dark dark:text-brand-light opacity-20 font-black text-4xl">01</span>
                <h2 className="text-lg font-black uppercase tracking-widest">Контактні дані</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                   <input required placeholder="ПІБ" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white" />
                </div>
                <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                   <input required placeholder="ТЕЛЕФОН" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white" />
                </div>
                <div className="relative group md:col-span-2">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                   <input type="email" placeholder="EMAIL (НЕОБОВ'ЯЗКОВО)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white" />
                </div>
              </div>
            </section>
            
            <section className="space-y-8">
               <div className="flex items-center gap-4">
                 <span className="text-brand-dark dark:text-brand-light opacity-20 font-black text-4xl">02</span>
                 <h2 className="text-lg font-black uppercase tracking-widest">Логістика</h2>
               </div>
               <div className="space-y-4">
                  <div className="relative group" ref={cityDropdownRef}>
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input autoComplete="off" placeholder="ОБЕРІТЬ МІСТО" value={cityQuery} onChange={handleCityInput} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white" />
                    {showCityDropdown && cityQuery.length >= 2 && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-brand-dark border border-black/10 shadow-2xl max-h-60 overflow-y-auto">
                        {loadingCities ? (
                          <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto opacity-20" size={20} /></div>
                        ) : cities.map((city, idx) => (
                          <button key={idx} type="button" onClick={() => handleSelectCity(city)} className="w-full text-left p-4 hover:bg-black/5 text-[10px] font-bold uppercase border-b border-black/5 dark:text-white dark:hover:bg-white/5">{city.Present}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedCity && (
                    <div className="relative group animate-in fade-in slide-in-from-top-2" ref={warehouseDropdownRef}>
                       <Truck className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                       <input autoComplete="off" placeholder="ВІДДІЛЕННЯ НОВОЇ ПОШТИ" value={warehouseQuery} onChange={e => {setWarehouseQuery(e.target.value); setShowWarehouseDropdown(true)}} onFocus={() => setShowWarehouseDropdown(true)} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white" />
                       {showWarehouseDropdown && (
                         <div className="absolute z-50 w-full mt-1 bg-white dark:bg-brand-dark border border-black/10 shadow-xl max-h-60 overflow-y-auto">
                           {warehouses.filter(w => w.Description.toLowerCase().includes(warehouseQuery.toLowerCase())).map((w, idx) => (
                             <button key={idx} type="button" onClick={() => {setSelectedWarehouse(w.Description); setWarehouseQuery(w.Description); setShowWarehouseDropdown(false)}} className="w-full text-left p-4 hover:bg-black/5 text-[10px] font-bold uppercase border-b border-black/5 dark:text-white dark:hover:bg-white/5">{w.Description}</button>
                           ))}
                         </div>
                       )}
                    </div>
                  )}
               </div>
            </section>

            <section className="space-y-8">
               <div className="flex items-center gap-4">
                 <span className="text-brand-dark dark:text-brand-light opacity-20 font-black text-4xl">03</span>
                 <h2 className="text-lg font-black uppercase tracking-widest">Спосіб оплати</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-start gap-4 p-8 border-2 transition-all duration-300 text-left ${paymentMethod === 'cash' ? 'border-black dark:border-white bg-black/5 dark:bg-white/5' : 'border-black/5 dark:border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <Wallet size={24} />
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest">Післяплата</p>
                      <p className="text-[9px] font-medium opacity-60 uppercase">При отриманні + комісія НП</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex flex-col items-start gap-4 p-8 border-2 transition-all duration-300 text-left ${paymentMethod === 'card' ? 'border-black dark:border-white bg-black/5 dark:bg-white/5' : 'border-black/5 dark:border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <CreditCard size={24} />
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest">Картка</p>
                      <p className="text-[9px] font-medium opacity-60 uppercase">VISA & MasterCard (Онлайн)</p>
                    </div>
                  </button>
               </div>
            </section>

            <section className="space-y-8">
               <div className="flex items-center gap-4">
                 <span className="text-brand-dark dark:text-brand-light opacity-20 font-black text-4xl">04</span>
                 <h2 className="text-lg font-black uppercase tracking-widest">Додатково</h2>
               </div>
               <div className="relative group">
                  <MessageSquare className="absolute left-4 top-6 opacity-20" size={18} />
                  <textarea rows={4} placeholder="ВАШ КОМЕНТАР" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 p-5 pl-12 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none dark:text-white" />
               </div>
            </section>

            <button type="submit" disabled={isSubmitting} className="w-full py-10 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.5em] text-sm hover:invert transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]">
               {isSubmitting ? <Loader2 className="animate-spin" /> : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-5">
           <div className="sticky top-32 bg-black/5 dark:bg-white/5 p-10 rounded-[2rem] space-y-10 border border-black/5 dark:border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <ShoppingBag size={20} /> Ваше замовлення
              </h3>
              <div className="space-y-6">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-black/5 overflow-hidden flex-shrink-0 border border-black/5 dark:border-white/5">
                      <img src={item.product.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-wider">{item.product.name}</span>
                        <span className="font-black text-xs">₴{(item.selectedPrice || item.product.price) * item.quantity}</span>
                      </div>
                      <div className="flex gap-4 text-[9px] font-bold opacity-40 uppercase mt-1">
                        <span>Розмір: {item.size}</span>
                        <span>Кількість: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-black/10 dark:border-white/10 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40 tracking-widest">
                  <span>Доставка:</span>
                  <span>За тарифами НП</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                   <span className="text-xs font-black uppercase tracking-widest">Всього до оплати:</span>
                   <span className="text-4xl font-black">₴{total}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                 <ShieldCheck className="text-green-500 shrink-0" size={20} />
                 <p className="text-[9px] font-black uppercase opacity-60 leading-tight">Ваші дані захищені. Оплата при отриманні або на розрахунковий рахунок.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;