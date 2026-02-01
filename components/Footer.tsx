import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, Mail, Phone, X } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import Logo from './Logo';

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

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-brand-light dark:bg-brand-dark p-8 md:p-12 shadow-2xl border border-black/10 dark:border-white/10 max-h-[80vh] overflow-y-auto custom-scrollbar rounded-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10 border-b border-black/10 dark:border-white/10 pb-6">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="text-sm font-light leading-relaxed opacity-80 space-y-6 text-justify">
          {content}
        </div>
        <div className="mt-12 flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const privacyContent = (
    <>
      <p>Ця Політика конфіденційності описує, як бренд EMPERSO збирає, використовує та захищає вашу інформацію під час відвідування нашого сайту.</p>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">1. ЗБІР ІНФОРМАЦІЇ</p>
        <p>Ми збираємо персональні дані, які ви надаєте добровільно при оформленні замовлення: ПІБ, номер телефону, адресу доставки та електронну пошту.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">2. ВИКОРИСТАННЯ ДАНИХ</p>
        <p>Ваші дані використовуються виключно для обробки замовлень, доставки товарів службою Нова Пошта та зворотного зв'язку з вами.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">3. ЗАХИСТ ІНФОРМАЦІЇ</p>
        <p>Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших персональних даних від несанкціонованого доступу, зміни або видалення.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">4. ПЕРЕДАЧА ТРЕТІМ ОСОБАМ</p>
        <p>Ми не продаємо та не передаємо ваші дані третім особам, за винятком логістичних компаній (Нова Пошта) для виконання доставки вашого замовлення.</p>
      </div>
    </>
  );

  const termsContent = (
    <>
      <p>Використовуючи сайт EMPERSO, ви погоджуєтеся з наведеними нижче умовами використання.</p>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">1. ЗАГАЛЬНІ ПОЛОЖЕННЯ</p>
        <p>Сайт є платформою для перегляду та замовлення преміального одягу бренду EMPERSO. Весь контент (фото, логотип, тексти) є інтелектуальною власністю бренду.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">2. ЗАМОВЛЕННЯ ТА ОПЛАТА</p>
        <p>Замовлення вважається прийнятим після підтвердження менеджером. Оплата здійснюється при отриманні (післяплата) або за реквізитами ФОП.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">3. ПОВЕРНЕННЯ ТА ОБМІН</p>
        <p>Згідно із законодавством України, ви маєте право повернути або обміняти товар належної якості протягом 14 днів, якщо він не був у вжитку та зберіг товарний вигляд і бирки.</p>
      </div>
      <div className="space-y-2">
        <p className="font-black uppercase tracking-widest text-[11px]">4. ВІДПОВІДАЛЬНІСТЬ</p>
        <p>Ми не несемо відповідальності за затримки доставки з вини поштових служб, але завжди сприяємо вирішенню логістичних питань.</p>
      </div>
    </>
  );

  return (
    <footer id="footer" className="bg-white dark:bg-black border-t border-black/5 dark:border-white/5 pt-20 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6 flex flex-col">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative group block w-fit"
            >
              <Logo className="h-14 md:h-20 w-auto relative z-10" />
              <p className="text-[10px] md:text-[11px] font-black tracking-[0.25em] opacity-30 max-w-xs uppercase -mt-3 md:-mt-5 ml-1 relative z-0 transition-all duration-500 group-hover:opacity-60">
                MADE IN UKRAINE
              </p>
            </Link>
            
            <div className="flex space-x-6 pt-2">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-60 hover:opacity-100" title="Instagram">
                <span className="sr-only">Instagram</span>
                <Instagram size={22} />
              </a>
              <a href={CONTACT_INFO.tiktok} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-60 hover:opacity-100" title="TikTok">
                <span className="sr-only">TikTok</span>
                <TikTokIcon size={22} />
              </a>
              <a href={CONTACT_INFO.telegram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-60 hover:opacity-100" title="Telegram">
                <span className="sr-only">Telegram</span>
                <Send size={22} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase font-bold tracking-widest opacity-30">Меню</h4>
            <ul className="space-y-4 text-sm uppercase tracking-wider font-medium">
              <li><Link to="/" className="hover:opacity-50 transition-opacity">Головна</Link></li>
              <li><Link to="/about" className="hover:opacity-50 transition-opacity">Про Нас</Link></li>
              <li><Link to="/partnership" className="hover:opacity-50 transition-opacity">Співпраця</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase font-bold tracking-widest opacity-30">Контакти</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-center gap-3">
                <Mail size={16} />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="hover:underline">{CONTACT_INFO.phone}</a>
              </li>
              <li>
                <p className="opacity-60">{CONTACT_INFO.schedule}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 dark:border-white/5 opacity-30 text-[10px] uppercase tracking-[0.3em]">
          <p>© {new Date().getFullYear()} EMPERSO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <button onClick={() => setActiveModal('privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:underline">Terms of Service</button>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy Policy" 
        content={privacyContent} 
      />
      <LegalModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        title="Terms of Service" 
        content={termsContent} 
      />
    </footer>
  );
};

export default Footer;