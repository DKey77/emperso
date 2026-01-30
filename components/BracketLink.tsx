
import React from 'react';
import { Link } from 'react-router-dom';

interface BracketLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'lg';
}

const BracketLink: React.FC<BracketLinkProps> = ({ to, children, onClick, size = 'sm' }) => {
  const isLarge = size === 'lg';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center justify-center transition-all duration-500 ease-out ${
        isLarge ? 'py-4 px-10' : 'py-2 px-1.5'
      }`}
    >
      {/* Left Bracket */}
      <span 
        className={`absolute left-0 transform transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) opacity-60 group-hover:opacity-100 font-light ${
          isLarge 
            ? 'text-4xl md:text-6xl group-hover:-translate-x-6' 
            : 'text-2xl group-hover:-translate-x-3.5'
        }`}
      >
        [
      </span>

      {/* Content */}
      <span 
        className={`mx-3 transform transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-105 font-black uppercase tracking-[0.2em] text-center ${
          isLarge 
            ? 'text-xl md:text-3xl' 
            : 'text-[13px]'
        }`}
      >
        {children}
      </span>

      {/* Right Bracket */}
      <span 
        className={`absolute right-0 transform transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) opacity-60 group-hover:opacity-100 font-light ${
          isLarge 
            ? 'text-4xl md:text-6xl group-hover:translate-x-6' 
            : 'text-2xl group-hover:translate-x-3.5'
        }`}
      >
        ]
      </span>
    </Link>
  );
};

export default BracketLink;
