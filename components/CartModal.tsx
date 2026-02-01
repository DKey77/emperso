
import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../App';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity } = useGlobal();

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.selectedPrice || item.product.price) * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-brand-light dark:bg-brand-dark shadow-2xl animate-in slide-in-from-right duration-300 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-black font-display uppercase tracking-tighter">Кошик</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <ShoppingBag size={64} />
            <p className="text-xl font-light uppercase tracking-widest">Ваш кошик порожній</p>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-black dark:border-white text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              До покупок
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-8">
              {cart.map((item) => {
                const itemPrice = item.selectedPrice || item.product.price;
                return (
                  <div key={`${item.product.id}-${item.size}-${item.selectedPrice}`} className="flex gap-4 group">
                    <div className="w-24 aspect-[3/4] bg-gray-100 dark:bg-white/5 overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-[11px] uppercase tracking-wider leading-tight max-w-[140px]">{item.product.name}</h3>
                          {item.selectedPrice && (
                            <p className="text-[8px] font-black uppercase tracking-widest text-brand-dark dark:text-brand-light opacity-60 mt-1">Партнерська ціна</p>
                          )}
                        </div>
                        <span className="text-[9px] font-black bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 shrink-0">
                          {item.size}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border border-black/10 dark:border-white/10">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.size, -1)}
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[11px] font-black w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.size, 1)}
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="p-1 text-black/20 dark:text-white/20 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <p className="text-lg font-black mt-2">₴{itemPrice * item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t border-black/10 dark:border-white/10 mt-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] uppercase font-black tracking-[0.4em] opacity-40">Разом:</span>
                <span className="text-3xl font-black">₴{total}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center py-6 bg-black text-white dark:bg-white dark:text-black text-[11px] font-black uppercase tracking-[0.4em] hover:invert transition-all duration-300"
              >
                Оформити замовлення
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
