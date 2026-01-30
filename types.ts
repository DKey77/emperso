export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  wholesalePrice: number;
  dropshippingPrice: number;
  description: string;
  images: string[];
  availableSizes: ('S' | 'M' | 'L')[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: 'S' | 'M' | 'L';
  selectedPrice?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    comment?: string;
  };
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  // Supabase metadata property
  created_at?: string;
}

export interface SiteSettings {
  heroImage: string;
  homeAboutTitle: string;
  homeAboutText: string;
  aboutPageImage: string;
  aboutPageTitle: string;
  aboutPageText: string;
  telegramChatId: string;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  theme: 'light' | 'dark';
  settings: SiteSettings;
}