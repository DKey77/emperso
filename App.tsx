import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Partnership from './pages/Partnership';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Logo from './components/Logo';
import { Product, Order, SiteSettings, CartItem } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { supabase, isSupabaseConfigured } from './lib/supabase';

interface GlobalContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, size: 'S' | 'M' | 'L', price?: number, quantity?: number) => void;
  updateCartQuantity: (productId: string, size: 'S' | 'M' | 'L', delta: number) => void;
  removeFromCart: (productId: string, size: 'S' | 'M' | 'L') => void;
  clearCart: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  isLoading: boolean;
  isDbConnected: boolean;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Ініціалізація системи...');
  const [isDbConnected, setIsDbConnected] = useState(isSupabaseConfigured);
  const [settings, setSettings] = useState<SiteSettings>({
    heroImage: '',
    homeAboutTitle: 'ЛАСКАВО ПРОСИМО У НАШ СВІТ',
    homeAboutText: 'EMPERSO — це не просто одяг. Це маніфест свободи та вишуканого стилю.',
    aboutPageImage: '',
    aboutPageTitle: 'ПРО НАС',
    aboutPageText: 'Історія нашого бренду почалася з мрії про ідеальний оверсайз.',
    telegramChatId: ''
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('emperso_theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const mapProductFromDb = (dbProduct: any): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    price: Number(dbProduct.price),
    wholesalePrice: Number(dbProduct.wholesale_price || 0),
    dropshippingPrice: Number(dbProduct.dropshipping_price || 0),
    description: dbProduct.description,
    images: dbProduct.images || [],
    availableSizes: dbProduct.available_sizes || ['S', 'M', 'L'],
    isFeatured: dbProduct.is_featured || false
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isSupabaseConfigured) {
        setLoadingStatus('Завантаження локальних даних...');
        setProducts(INITIAL_PRODUCTS);
        setTimeout(() => setIsLoading(false), 800);
        return;
      }

      try {
        setLoadingStatus('Встановлення зв\'язку з базою...');
        
        // Паралельне завантаження для економії часу, але чекаємо на все
        const [settingsRes, productsRes] = await Promise.all([
          supabase.from('site_settings').select('*').maybeSingle().then(res => {
            setLoadingStatus('Завантаження конфігурації бренду...');
            return res;
          }),
          supabase.from('products').select('*').order('created_at', { ascending: false }).then(res => {
            setLoadingStatus('Синхронізація каталогу товарів...');
            return res;
          })
        ]);

        if (settingsRes.data) {
          setSettings({
            heroImage: settingsRes.data.hero_image || '',
            homeAboutTitle: settingsRes.data.home_about_title || 'EMPERSO',
            homeAboutText: settingsRes.data.home_about_text || '',
            aboutPageImage: settingsRes.data.about_page_image || '',
            aboutPageTitle: settingsRes.data.about_page_title || 'ПРО НАС',
            aboutPageText: settingsRes.data.about_page_text || '',
            telegramChatId: settingsRes.data.telegram_chat_id || ''
          });
        }

        if (productsRes.data) {
          setLoadingStatus('Обробка медіа-контенту...');
          setProducts(productsRes.data.map(mapProductFromDb));
        }

        setLoadingStatus('Підготовка інтерфейсу...');
        setTimeout(() => {
          setLoadingStatus('Готово');
          setIsLoading(false);
        }, 500);

      } catch (err) {
        console.error("Initialization error:", err);
        setLoadingStatus('Помилка з\'єднання. Спробуйте оновити сторінку.');
        // У разі критичної помилки через 3 секунди пускаємо на сайт з порожніми даними
        setTimeout(() => setIsLoading(false), 3000);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('emperso_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (product: Product, size: 'S' | 'M' | 'L', price?: number, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size && item.selectedPrice === price);
      if (existing) {
        return prev.map(item => (item.product.id === product.id && item.size === size && item.selectedPrice === price) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity, size, selectedPrice: price }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, size: 'S' | 'M' | 'L', delta: number) => {
    setCart(prev => prev.map(item => (item.product.id === productId && item.size === size) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (productId: string, size: 'S' | 'M' | 'L') => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const clearCart = () => setCart([]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-dark transition-all duration-700">
        <div className="flex flex-col items-center gap-12 max-w-xs w-full">
          <Logo className="h-16 md:h-20 w-auto text-white animate-pulse" />
          
          <div className="w-full space-y-4 flex flex-col items-center">
            {/* Анімований статус завантаження */}
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 text-center animate-in fade-in slide-in-from-bottom-2 duration-500 key={loadingStatus}">
              {loadingStatus}
            </p>
            
            {/* Покращений прогрес-бар */}
            <div className="h-[1px] w-full bg-white/10 overflow-hidden relative rounded-full">
              <div className="h-full bg-white/60 absolute inset-y-0 animate-[loading_2s_infinite]" />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { left: -100%; width: 30%; }
            50% { width: 70%; }
            100% { left: 100%; width: 30%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <GlobalContext.Provider value={{
      products, setProducts, cart, addToCart, updateCartQuantity, removeFromCart, clearCart, orders, setOrders, theme, toggleTheme, isCartOpen, setIsCartOpen, settings, setSettings, isLoading, isDbConnected
    }}>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GlobalContext.Provider>
  );
};

export default App;