import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Plus, Edit2, Trash2, X, Image as ImageIcon, Settings, Upload, Check, ArrowLeft, MessageSquare, Loader2, Sparkles, AlertCircle, Terminal, Copy, PlusCircle, Layout, Calendar, User, Phone, Mail, MapPin, Hash, Search, Lock, ShieldAlert, Info, ChevronDown, ShoppingBag, CreditCard, Wallet, MoreVertical, MessageCircle, Send } from 'lucide-react';
import { useGlobal } from '../App';
import { Product, Order } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GoogleGenAI } from "@google/genai";
import Logo from '../components/Logo';

const TG_BOT_TOKEN = '8297791353:AAGFqxqXvvQJyz77XqwYKq153KCdYRcmi0w';

const Admin: React.FC = () => {
  const { products, setProducts, orders, setOrders, settings, setSettings, isDbConnected } = useGlobal();
  const navigate = useNavigate();
  
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    return sessionStorage.getItem('emperso_admin_auth') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'about_page'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTestingTg, setIsTestingTg] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutPageFileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: number;
    wholesalePrice: number;
    dropshippingPrice: number;
    description: string;
    images: string[];
    availableSizes: ('S' | 'M' | 'L')[];
    is_featured: boolean;
  }>({
    name: '',
    category: 'Hoodies',
    price: 0,
    wholesalePrice: 0,
    dropshippingPrice: 0,
    description: '',
    images: ['', '', '', '', ''],
    availableSizes: ['S', 'M', 'L'],
    is_featured: true
  });

  // Завантажуємо замовлення тільки коли заходимо в адмінку і відкриваємо вкладку замовлень
  useEffect(() => {
    if (isAdminAuthorized && activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [isAdminAuthorized, activeTab]);

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setOrders(data.map((o: any) => ({
          id: o.id,
          items: o.items,
          total: Number(o.total),
          customer: o.customer,
          paymentMethod: o.payment_method || 'cash',
          status: o.status || 'pending',
          date: o.date,
          created_at: o.created_at
        })));
      }
    } catch (err) {
      console.error("Orders load error:", err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'emperso16180339887') {
      setIsAdminAuthorized(true);
      sessionStorage.setItem('emperso_admin_auth', 'true');
    } else {
      alert('Невірний код доступу.');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthorized(false);
    sessionStorage.removeItem('emperso_admin_auth');
    navigate('/');
  };

  const handleTestTelegram = async () => {
    if (!settings.telegramChatId) return alert("Спочатку введіть Chat ID!");
    setIsTestingTg(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: "🚀 <b>EMPERSO SYSTEM TEST</b>\nБот підключений успішно!",
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      if (data.ok) alert("Тестове повідомлення надіслано!");
      else alert(`Помилка: ${data.description}`);
    } catch (err) {
      alert("Не вдалося надіслати повідомлення.");
    } finally {
      setIsTestingTg(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err: any) {
      alert(`Помилка оновлення статусу: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Видалити замовлення #${orderId}?`)) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err: any) {
      alert(`Помилка видалення: ${err.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'hero' | 'about_page') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (target === 'hero') setSettings(prev => ({ ...prev, heroImage: base64 }));
      else if (target === 'about_page') setSettings(prev => ({ ...prev, aboutPageImage: base64 }));
      else if (target === 'product' && activeImageIndex !== null) {
        const newImgs = [...formData.images];
        newImgs[activeImageIndex] = base64;
        setFormData(prev => ({ ...prev, images: newImgs }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const filteredImages = formData.images.filter(img => img && img.trim() !== '');
    try {
      const payload: any = {
        name: formData.name, category: formData.category,
        price: Number(formData.price), wholesale_price: Number(formData.wholesalePrice),
        dropshipping_price: Number(formData.dropshippingPrice), description: formData.description,
        images: filteredImages, available_sizes: formData.availableSizes, is_featured: formData.is_featured,
      };
      if (editingProduct?.id) payload.id = editingProduct.id;
      const { data, error } = await supabase.from('products').upsert(payload).select().single();
      if (error) throw error;
      
      const mapped: Product = {
        id: data.id, name: data.name, category: data.category, price: Number(data.price),
        wholesalePrice: Number(data.wholesale_price), dropshippingPrice: Number(data.dropshipping_price),
        description: data.description, images: data.images, availableSizes: data.available_sizes,
        isFeatured: data.is_featured
      };
      if (editingProduct) setProducts(prev => prev.map(p => p.id === editingProduct.id ? mapped : p));
      else setProducts(prev => [mapped, ...prev]);
      setIsModalOpen(false);
    } catch (err: any) { alert(`Помилка: ${err.message}`); } finally { setIsSaving(false); }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 1, hero_image: settings.heroImage, home_about_title: settings.homeAboutTitle, 
        home_about_text: settings.homeAboutText, about_page_image: settings.aboutPageImage, 
        about_page_title: settings.aboutPageTitle, about_page_text: settings.aboutPageText,
        telegram_chat_id: settings.telegramChatId
      });
      if (error) throw error;
      alert("Налаштування збережено!");
    } catch (err: any) { alert(`Помилка: ${err.message}`); } finally { setIsSavingSettings(false); }
  };

  const generateDescriptionWithAI = async () => {
    if (!formData.name) return alert("Введіть назву");
    setIsGeneratingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Напиши лаконічний опис для товару "${formData.name}". Стиль: преміум, оверсайз, українською.`,
      });
      if (response.text) setFormData(prev => ({ ...prev, description: response.text.trim() }));
    } catch (err) { alert("Помилка AI"); } finally { setIsGeneratingAi(false); }
  };

  const handleOpenModal = (prod: any = null) => {
    if (prod) {
      setEditingProduct(prod);
      const imgs = [...(prod.images || [])];
      while (imgs.length < 5) imgs.push('');
      setFormData({ ...prod, images: imgs, availableSizes: prod.availableSizes || ['S', 'M', 'L'], is_featured: prod.isFeatured ?? true });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Hoodies', price: 0, wholesalePrice: 0, dropshippingPrice: 0, description: '', images: ['', '', '', '', ''], availableSizes: ['S', 'M', 'L'], is_featured: true });
    }
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter(o => {
    const query = orderSearchQuery.toLowerCase().trim();
    return !query || o.id.toLowerCase().includes(query) || o.customer?.name?.toLowerCase().includes(query);
  });

  if (!isAdminAuthorized) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark">
        <div className="w-full max-w-md p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 text-center space-y-12">
           <Logo className="h-10 w-auto text-white mx-auto" />
           <form onSubmit={handleAdminLogin} className="space-y-6">
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full py-6 bg-white/5 text-white text-center text-xs font-black tracking-widest outline-none border-b border-white/10 focus:border-white transition-all" />
              <button type="submit" className="w-full py-6 bg-white text-black font-black uppercase text-[11px] tracking-widest">Увійти</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex justify-between items-center">
           <button onClick={handleLogout} className="text-[9px] font-black uppercase opacity-30 hover:opacity-100"> Вийти </button>
           <button onClick={() => setShowSqlHelper(!showSqlHelper)} className="px-6 py-3 bg-amber-500 text-black text-[10px] font-black uppercase rounded-full"> <Terminal size={14} className="inline mr-2" /> SQL Помічник </button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Адмін-панель</h1>
          <div className="flex flex-wrap bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5">
            {['products', 'orders', 'settings', 'about_page'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl' : 'opacity-40 hover:opacity-100'}`}>
                {tab === 'products' ? 'Товари' : tab === 'orders' ? 'Замовлення' : tab === 'settings' ? 'Головна' : 'Про Нас'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-end">
              <button onClick={() => handleOpenModal()} className="px-10 py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:invert transition-all"> <Plus size={18} /> Додати </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-white dark:bg-white/5 p-4 border border-black/5 flex flex-col gap-4 group">
                  <div className="aspect-[3/4] overflow-hidden bg-black/5"> <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /> </div>
                  <div className="flex justify-between items-center">
                    <div> <h3 className="font-black uppercase text-xs truncate max-w-[120px]">{p.name}</h3> <p className="font-bold text-sm">₴{p.price}</p> </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenModal(p)} className="p-2 bg-black/5 dark:bg-white/5"><Edit2 size={12}/></button>
                      <button onClick={() => handleDeleteOrder(p.id)} className="p-2 text-red-500"><Trash2 size={12}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-12 animate-in fade-in">
             <div className="relative max-w-2xl mx-auto mb-12">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={20} />
               <input type="text" placeholder="Пошук..." value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)} className="w-full py-6 pl-16 pr-8 bg-black/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest outline-none border-b-2 border-black/10 focus:border-black" />
             </div>
             {isOrdersLoading ? (
               <div className="text-center py-20"><Loader2 className="animate-spin mx-auto opacity-20" size={40} /></div>
             ) : filteredOrders.length === 0 ? (
               <div className="text-center py-20 opacity-30 uppercase font-black">Замовлень поки немає</div>
             ) : (
               filteredOrders.map(o => (
                  <div key={o.id} className="bg-white dark:bg-white/5 border border-black/5 rounded-[2rem] p-8 md:p-12 space-y-10 hover:shadow-2xl transition-all duration-500">
                     <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-black/5 pb-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 flex-wrap">
                              <h3 className="text-3xl font-black uppercase tracking-tighter">#{o.id}</h3>
                              <select 
                                value={o.status} 
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className={`appearance-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest outline-none border-2 transition-all ${
                                  o.status === 'completed' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                                  o.status === 'cancelled' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                                  'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                }`}
                              >
                                <option value="pending">Очікується</option>
                                <option value="completed">Виконано</option>
                                <option value="cancelled">Скасовано</option>
                              </select>
                              <button onClick={() => handleDeleteOrder(o.id)} className="p-2 text-red-500/40 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                           </div>
                           <p className="text-sm font-bold opacity-40 uppercase"><Calendar size={14} className="inline mr-2" />{new Date(o.created_at || o.date).toLocaleString('uk-UA')}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Загальна сума</p>
                           <p className="text-5xl font-black">₴{o.total}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <h4 className="text-sm font-black uppercase tracking-widest opacity-30">Клієнт</h4>
                           <div className="space-y-2 border-l-2 border-black/5 pl-8">
                              <p className="text-lg font-black uppercase">{o.customer?.name}</p>
                              <p className="text-sm opacity-60"><Phone size={14} className="inline mr-2" />{o.customer?.phone}</p>
                              <p className="text-sm opacity-60 uppercase"><MapPin size={14} className="inline mr-2" />{o.customer?.address}</p>
                              {o.customer?.comment && (
                                <div className="mt-4 p-4 bg-brand-light dark:bg-white/5 rounded-xl text-sm italic opacity-80">"{o.customer.comment}"</div>
                              )}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h4 className="text-sm font-black uppercase tracking-widest opacity-30">Товари</h4>
                           <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                              {o.items?.map((item: any, idx: number) => {
                                 const productId = item.p_id || item.product?.id || item.id;
                                 const liveProduct = products.find(p => p.id === productId);
                                 // ФОТО: пріоритет на збережене в замовленні фото, потім на живе
                                 const img = item.img || liveProduct?.images?.[0] || item.product?.images?.[0];
                                 const name = item.n || item.product?.name || item.name || 'Товар';
                                 const size = item.s || item.size || '-';
                                 const qty = item.q || item.quantity || 1;
                                 const price = item.pr || item.product?.price || item.price || 0;

                                 return (
                                   <div key={idx} className="flex gap-4 items-center p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5">
                                      <div className="w-14 h-14 bg-black/10 overflow-hidden flex-shrink-0 flex items-center justify-center"> 
                                        {img ? <img src={img} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="opacity-20" />}
                                      </div>
                                      <div className="flex-grow">
                                         <p className="text-[11px] font-black uppercase tracking-wider">{name}</p>
                                         <p className="text-[10px] font-black opacity-40 uppercase">Розмір: {size} | К-сть: {qty}</p>
                                      </div>
                                      <div className="text-right font-black text-sm"> ₴{price * qty} </div>
                                   </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
            <div className="bg-white dark:bg-white/5 p-12 border border-black/5 rounded-[3rem] shadow-2xl space-y-12">
              <h3 className="text-[14px] font-black uppercase tracking-[0.4em] border-b border-black/10 pb-4">Налаштування</h3>
              
              <div className="space-y-12">
                <div className="p-8 bg-blue-500/5 border-2 border-blue-500/20 rounded-[2rem] space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 text-white rounded-full"><Send size={24} /></div>
                    <h3 className="text-lg font-black uppercase tracking-tighter">Telegram Сповіщення</h3>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase opacity-60">Ваш Telegram Chat ID</label>
                     <input placeholder="123456789" value={settings.telegramChatId} onChange={e => setSettings({...settings, telegramChatId: e.target.value})} className="w-full p-6 bg-white dark:bg-white/5 border-2 border-black/5 rounded-2xl outline-none focus:border-blue-500" />
                     <button onClick={handleTestTelegram} disabled={isTestingTg} className="w-full py-4 bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2">
                        {isTestingTg ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Перевірити зв'язок
                     </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Банер головної</h3>
                    <div className="aspect-video w-full bg-black/5 relative overflow-hidden border-2 border-dashed border-black/10 rounded-2xl">
                       {settings.heroImage ? <img src={settings.heroImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full opacity-20"><ImageIcon size={48} /></div>}
                       <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-all"> <button onClick={() => heroFileInputRef.current?.click()} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase">Завантажити</button> </div>
                    </div>
                  </div>
                  <div className="space-y-4"> <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Заголовок головної</h3> <input value={settings.homeAboutTitle} onChange={e => setSettings({...settings, homeAboutTitle: e.target.value})} className="w-full p-6 bg-black/5 dark:bg-white/5 text-2xl font-black uppercase outline-none border-b-2 border-black/10 rounded-xl" /> </div>
                  <div className="space-y-4"> <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Текст головної</h3> <textarea rows={4} value={settings.homeAboutText} onChange={e => setSettings({...settings, homeAboutText: e.target.value})} className="w-full p-6 bg-black/5 dark:bg-white/5 text-lg font-light outline-none rounded-xl" /> </div>
                </div>
              </div>
              <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full py-8 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.5em] text-sm hover:invert transition-all"> {isSavingSettings ? <Loader2 className="animate-spin mx-auto" /> : 'Зберегти налаштування'} </button>
            </div>
            <input type="file" ref={heroFileInputRef} className="hidden" onChange={e => handleFileUpload(e, 'hero')} accept="image/*" />
          </div>
        )}

        {activeTab === 'about_page' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
            <div className="bg-white dark:bg-white/5 p-12 border border-black/5 rounded-[3rem] shadow-2xl space-y-12">
              <h3 className="text-[14px] font-black uppercase tracking-[0.4em] border-b border-black/10 pb-4">Сторінка "Про Нас"</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Фото на сторінці</h3>
                  <div className="aspect-[4/5] max-w-sm mx-auto bg-black/5 relative overflow-hidden border-2 border-dashed border-black/10 rounded-2xl">
                     {settings.aboutPageImage ? <img src={settings.aboutPageImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full opacity-20"><ImageIcon size={48} /></div>}
                     <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-all"> <button onClick={() => aboutPageFileInputRef.current?.click()} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase">Завантажити</button> </div>
                  </div>
                </div>
                <div className="space-y-4"> <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Заголовок</h3> <input value={settings.aboutPageTitle} onChange={e => setSettings({...settings, aboutPageTitle: e.target.value})} className="w-full p-6 bg-black/5 dark:bg-white/5 text-2xl font-black uppercase outline-none border-b-2 border-black/10 rounded-xl" /> </div>
                <div className="space-y-4"> <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Текст</h3> <textarea rows={10} value={settings.aboutPageText} onChange={e => setSettings({...settings, aboutPageText: e.target.value})} className="w-full p-6 bg-black/5 dark:bg-white/5 text-lg font-light outline-none rounded-xl" /> </div>
              </div>
              <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full py-8 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.5em] text-sm hover:invert transition-all"> {isSavingSettings ? <Loader2 className="animate-spin mx-auto" /> : 'Оновити'} </button>
            </div>
            <input type="file" ref={aboutPageFileInputRef} className="hidden" onChange={e => handleFileUpload(e, 'about_page')} accept="image/*" />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => !isSaving && setIsModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-brand-light dark:bg-brand-dark p-12 shadow-2xl rounded-[3rem] max-h-[90vh] overflow-y-auto border border-black/10">
             <div className="flex justify-between items-center mb-10"> <h2 className="text-3xl font-black uppercase tracking-tighter">{editingProduct ? 'Редагувати' : 'Новий товар'}</h2> <button onClick={() => setIsModalOpen(false)} className="p-3 bg-black/5 rounded-full"><X size={24} /></button> </div>
             <form onSubmit={handleSaveProduct} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="space-y-1"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">Назва</label> <input required placeholder="ВВЕДІТЬ НАЗВУ" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-black/5 font-black uppercase outline-none border-b-2 border-black/10 dark:bg-white/5" /> </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1 relative"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">Категорія</label> <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-5 bg-black/5 font-black uppercase outline-none border-b-2 border-black/10 appearance-none cursor-pointer dark:bg-white/5"> <option value="Hoodies">Худі</option> <option value="T-Shirts">Футболки</option> </select> <ChevronDown className="absolute right-4 bottom-5 opacity-20 pointer-events-none" size={18} /> </div>
                      <div className="space-y-1"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">Розміри</label> <div className="flex gap-2"> {['S', 'M', 'L'].map((size) => ( <button key={size} type="button" onClick={() => { const sizes = formData.availableSizes.includes(size as any) ? formData.availableSizes.filter(s => s !== size) : [...formData.availableSizes, size]; setFormData({...formData, availableSizes: sizes as any}); }} className={`flex-1 py-4 text-xs font-black transition-all border-2 ${ formData.availableSizes.includes(size as any) ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-black/5 border-transparent opacity-40' }`} > {size} </button> ))} </div> </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-1"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">РРЦ</label> <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: +e.target.value})} className="w-full p-4 bg-black/5 font-bold outline-none dark:bg-white/5" /> </div>
                      <div className="space-y-1"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">ОПТ</label> <input type="number" required value={formData.wholesalePrice} onChange={e => setFormData({...formData, wholesalePrice: +e.target.value})} className="w-full p-4 bg-black/5 font-bold outline-none dark:bg-white/5" /> </div>
                      <div className="space-y-1"> <label className="text-[10px] font-black opacity-40 uppercase ml-1">ДРОП</label> <input type="number" required value={formData.dropshippingPrice} onChange={e => setFormData({...formData, dropshippingPrice: +e.target.value})} className="w-full p-4 bg-black/5 font-bold outline-none dark:bg-white/5" /> </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl dark:bg-white/5"> <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5" /> <label htmlFor="is_featured" className="text-[10px] font-black uppercase cursor-pointer">Топ товар</label> </div>
                    <div className="space-y-4"> <div className="flex justify-between items-center"> <label className="text-[11px] font-black uppercase opacity-60">Опис</label> <button type="button" onClick={generateDescriptionWithAI} disabled={isGeneratingAi} className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-600"> {isGeneratingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Генерація </button> </div> <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-5 bg-black/5 font-medium outline-none text-sm dark:bg-white/5" placeholder="Опишіть товар..." /> </div>
                  </div>
                  <div className="space-y-8">
                    <label className="text-[11px] font-black uppercase opacity-60">Фото (MAX 5)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                       {formData.images.map((img, i) => (
                         <div key={i} className="aspect-[3/4] border-2 border-dashed flex items-center justify-center cursor-pointer relative overflow-hidden bg-black/5 dark:bg-white/5" onClick={() => { setActiveImageIndex(i); productFileInputRef.current?.click(); }}> 
                            {img ? <img src={img} className="w-full h-full object-cover" /> : <Upload size={24} className="opacity-20" />}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
                <input type="file" ref={productFileInputRef} className="hidden" onChange={e => handleFileUpload(e, 'product')} accept="image/*" />
                <button type="submit" disabled={isSaving} className="w-full py-10 bg-black text-white font-black uppercase tracking-[0.5em] text-sm rounded-2xl shadow-2xl hover:invert transition-all dark:bg-white dark:text-black"> {isSaving ? <Loader2 className="animate-spin mx-auto" /> : 'Зберегти товар'} </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;