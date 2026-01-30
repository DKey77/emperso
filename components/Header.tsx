import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, Menu, X } from 'lucide-react';
import { useGlobal } from '../App';
import BracketLink from './BracketLink';
import CartModal from './CartModal';
import Logo from './Logo';

const Header: React.FC = () => {
  const { theme, toggleTheme, cart, isCartOpen, setIsCartOpen } = useGlobal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'КОЛЕКЦІЯ', to: '/#collection' },
    { label: 'ПРО НАС', to: '/about' },
    { label: 'СПІВПРАЦЯ', to: '/partnership' },
    { label: 'КОНТАКТИ', to: '#footer' },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (to: string) => {
    setIsMobileMenuOpen(false);
    
    // Check if it's a hash link
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(path);
        setTimeout(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-brand-light/80 dark:bg-brand-dark/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hover:opacity-70 transition-opacity z-[70] flex items-center"
          >
            <Logo className="h-8 md:h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <BracketLink key={item.label} to={item.to} onClick={() => handleNavClick(item.to)}>
                {item.label}
              </BracketLink>
            ))}
          </nav>

          <div className="flex items-center space-x-1 md:space-x-4 z-[70]">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black min-w-[20px] h-[20px] flex items-center justify-center rounded-full ring-2 ring-brand-light dark:ring-brand-dark px-1 animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-[80] bg-brand-light dark:bg-brand-dark transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-4 rounded-full bg-black/5 dark:bg-white/5"
        >
          <X size={28} />
        </button>

        <div className="h-full w-full flex flex-col items-center justify-center p-6">
          <nav className="flex flex-col items-center space-y-4 w-full">
            {navItems.map((item) => (
              <BracketLink key={item.label} to={item.to} onClick={() => handleNavClick(item.to)} size="lg">
                {item.label}
              </BracketLink>
            ))}
          </nav>

          <div className="absolute bottom-12 flex space-x-8 opacity-40">
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em]">Instagram</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em]">Telegram</a>
          </div>
        </div>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;