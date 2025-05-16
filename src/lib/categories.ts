export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon identifier
}

export const categories: Category[] = [
  { id: 't-shirts', name: 'T-Shirts', description: 'Explore our wide range of comfortable and stylish t-shirts for every occasion.', icon: '👕' },
  { id: 'hoodies', name: 'Hoodies', description: 'Stay warm and cozy with our collection of premium hoodies in various designs.', icon: '🧥' },
  { id: 'caps', name: 'Caps', description: 'Top off your look with our fashionable and functional caps and hats.', icon: '🧢' },
  { id: 'accessories', name: 'Accessories', description: 'Find the perfect accessories to complement your style, from bags to belts.', icon: '👜' },
  { id: 'footwear', name: 'Footwear', description: 'Step out in style with our collection of trendy and comfortable shoes.', icon: '👟' },
  { id: 'outerwear', name: 'Outerwear', description: 'Brave the elements with our selection of jackets, coats, and vests.', icon: '🧥' }, // Reusing hoodie icon for simplicity
];
