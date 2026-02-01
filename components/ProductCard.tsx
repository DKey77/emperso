import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { Product } from '../types';
import { useGlobal } from '../App';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useGlobal();
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleSizeSelect = (size: 'S' | 'M' | 'L') => {
    addToCart(product, size);
    setShowSizeSelector(false);
  };

  const availableSizes = product.availableSizes || ['S', 'M', 'L'];

  return (
    <div className="group flex flex-col space-y-4 bg-white dark:bg-white/5 p-2 rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-none" itemScope itemType="https://schema.org/Product">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-lg">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            itemProp="image"
          />
        </Link>
        
        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowSizeSelector(true);
          }}
          className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-xl transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-90 z-10"
        >
          <Plus size={24} />
        </button>

        {/* Quick Size Selector Overlay */}
        {showSizeSelector && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowSizeSelector(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <p className="text-[10px] text-white/50 uppercase font-black tracking-[0.4em] mb-6">Оберіть розмір</p>
            <div className="flex gap-4">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size as any)}
                  className="w-14 h-14 flex items-center justify-center border border-white/20 text-white font-black hover:bg-white hover:text-black transition-all"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start px-2 pb-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider group-hover:underline transition-all" itemProp="name">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs opacity-50 font-light mt-1 text-brand-dark dark:text-brand-light">Oversized Premium</p>
        </div>
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="UAH" />
          <p className="text-lg font-bold">₴<span itemProp="price">{product.price}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;