
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Eternal Glow Serum',
    category: 'Treatment',
    price: 1850,
    description: 'A concentrated elixir of Vitamin C and botanical extracts designed to restore natural luminosity.',
    image: '/assets/eternal.jpg',
    featured: true,
    details: ['Pure Vitamin C', 'Hyaluronic Acid', 'Paraben-free', 'Made in South Africa']
  },
  {
    id: '2',
    name: 'Midnight Recovery Oil',
    category: 'Night Care',
    price: 2400,
    description: 'A transformative overnight blend of Baobab and Rosehip oils to rejuvenate tired skin cells.',
    image: '/assets/night.jpg',
    featured: true,
    details: ['Organic Baobab Oil', 'Retinol-alternative', 'Deep hydration']
  },
  {
    id: '3',
    name: 'Velvet Clay Mask',
    category: 'Cleanser',
    price: 950,
    description: 'Detoxifying Karoo clay blended with soothing Aloe Vera for a refined, poreless finish.',
    image: '/assets/velvet.jpg',
    details: ['Bentonite Clay', 'Aloe Vera base', 'Twice-weekly use']
  },
  {
    id: '4',
    name: 'Solar Shield Day Cream',
    category: 'Hydration',
    price: 1100,
    description: 'Lightweight SPF 50 hydration that protects against UV rays and urban pollutants.',
    image: '/assets/day.png',
    featured: true,
    details: ['SPF 50 Protection', 'Blue light filter', 'Non-greasy formula']
  },
  {
    id: '5',
    name: 'Quartz Eye Infusion',
    category: 'Targeted',
    price: 1550,
    description: 'Advanced peptide formula targeting fine lines and puffiness around the delicate eye area.',
    image: '/assets/eye.webp',
    details: ['Peptide complex', 'Cold-pressed botanical oils', 'Fragrance-free']
  },
  {
    id: '6',
    name: 'Botanical Cleansing Balm',
    category: 'Cleanser',
    price: 850,
    description: 'An indulgent oil-to-milk cleanser that removes all traces of makeup while nourishing the skin.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    details: ['Moringa Extract', 'Vitamin E', 'Double-cleanse safe']
  }
];

export const NAVIGATION = [
  { label: 'Home', view: 'HOME' },
  { label: 'Shop', view: 'SHOP' },
  { label: 'About', view: 'ABOUT' },
  { label: 'Contact', view: 'CONTACT' }
];
