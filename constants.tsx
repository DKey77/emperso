
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'EMPERSO CORE HOODIE',
    category: 'Hoodies',
    price: 2400,
    wholesalePrice: 1600,
    dropshippingPrice: 1900,
    description: 'Heavyweight oversized hoodie made from premium French Terry cotton. Designed for the streets, refined for the soul.',
    images: ['https://picsum.photos/800/1000?random=1', 'https://picsum.photos/800/1000?random=2'],
    availableSizes: ['S', 'M', 'L'],
    isFeatured: true
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'URBAN NOMAD TEE',
    category: 'T-Shirts',
    price: 1200,
    wholesalePrice: 800,
    dropshippingPrice: 950,
    description: 'Perfect drop-shoulder fit. High-density embroidery on chest.',
    images: ['https://picsum.photos/800/1000?random=3', 'https://picsum.photos/800/1000?random=4'],
    availableSizes: ['S', 'M', 'L'],
    isFeatured: true
  }
];

export const CATEGORIES = ['Все', 'Худі', 'Футболки'];

export const CONTACT_INFO = {
  email: 'emperso.official@gmail.com',
  phone: '+380 68 380 60 93',
  telegram: 'https://t.me/EMPERSO_manager',
  instagram: 'https://www.instagram.com/emperso.official/',
  tiktok: 'https://www.tiktok.com/@emperso',
  schedule: 'Пн–Пт: 10:00–19:00; Сб: 10:00–17:00; Нд: вихідний'
};
