
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  featured?: boolean;
  details?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type View = 'HOME' | 'SHOP' | 'PRODUCT_DETAIL' | 'CART' | 'CHECKOUT' | 'ABOUT' | 'CONTACT';
