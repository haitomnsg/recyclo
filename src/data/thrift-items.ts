
import type { ThriftItem, ThriftItemCategory } from '@/lib/types';
import { Shirt, Laptop, BookOpen, ToyBrick, Sofa, Package, Diamond } from 'lucide-react';

export const sampleThriftItems: ThriftItem[] = [
  // Clothes
  { id: 'th001', name: 'Vintage Denim Jacket', description: 'Classic blue denim jacket, size M. Well-loved but in great condition, perfect for a retro look.', price: 2500, category: 'Clothes', imageUrl: '/images/vintageDenim.png', imageHint: 'denim jacket' },
  { id: 'th002', name: 'Striped Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt, size L. Red and white stripes, ideal for casual wear.', price: 800, category: 'Clothes', imageUrl: '/images/striptedCottonTshirt.png', imageHint: 'striped t-shirt' },
  { id: 'th003', name: 'Bohemian Print Scarf', description: 'Lightweight and airy scarf featuring a vibrant bohemian print. Measures 180cm x 70cm.', price: 600, category: 'Clothes', imageUrl: '/images/bohemianScarf.png', imageHint: 'bohemian scarf' },
  { id: 'th004', name: 'Khaki Cargo Pants', description: 'Durable khaki cargo pants with multiple pockets, size 32 waist. Slightly faded for a rugged style.', price: 1800, category: 'Clothes', imageUrl: '/images/khakiPant.png', imageHint: 'cargo pants' },

  // Electronics
  { id: 'th005', name: 'Refurbished Bluetooth Speaker', description: 'Compact Bluetooth speaker with good sound quality and 6-hour battery life. Includes charging cable.', price: 1500, category: 'Electronics', imageUrl: '/images/bluetoothSpeaker.png', imageHint: 'bluetooth speaker' },
  { id: 'th006', name: 'Used Android Tablet', description: '7-inch Android tablet, 16GB storage, good for reading, browsing, and light gaming. Screen has minor scratches.', price: 3500, category: 'Electronics', imageUrl: '/images/tablet.png', imageHint: 'android tablet' },

  // Books
  { id: 'th008', name: 'The Great Gatsby - F. Scott Fitzgerald', description: 'Paperback edition, good condition with some wear on the spine. A timeless classic.', price: 300, category: 'Books', imageUrl: '/images/bookOne.png', imageHint: 'gatsby book' },
  { id: 'th009', name: 'Sapiens: A Brief History of Humankind', description: 'Hardcover edition by Yuval Noah Harari, like new. Read once.', price: 700, category: 'Books', imageUrl: '/images/bookTwo.png', imageHint: 'sapiens book' },

  // Toys
  { id: 'th011', name: 'Wooden Building Blocks Set', description: 'Set of 50 colorful wooden building blocks for kids aged 3+. Comes in a storage box.', price: 1200, category: 'Toys', imageUrl: '/images/woddenBlock.png', imageHint: 'building blocks' },
  { id: 'th012', name: 'Plush Teddy Bear', description: 'Soft and cuddly brown teddy bear, approximately 12 inches tall. Excellent condition.', price: 900, category: 'Toys', imageUrl: '/images/teddy.png', imageHint: 'teddy bear' },

  // Furniture
  { id: 'th014', name: 'Small Wooden Bookshelf', description: 'Compact 3-tier wooden bookshelf, dark brown finish. Good condition, minor scuffs.', price: 2800, category: 'Furniture', imageUrl: '/images/woddenSelf.png', imageHint: 'wooden bookshelf' },
  { id: 'th015', name: 'Vintage Style Table Lamp', description: 'Decorative table lamp with a fabric shade and ornate base. Adds a classic touch.', price: 1600, category: 'Furniture', imageUrl: '/images/lamp.png', imageHint: 'table lamp' },
];

export const thriftCategories: ThriftItemCategory[] = ['Clothes', 'Electronics', 'Books', 'Toys', 'Furniture', 'Other'];
export const allThriftCategoryValue = 'All'; // To represent showing all categories

export const thriftCategoryIcons: Record<ThriftItemCategory | typeof allThriftCategoryValue, React.ElementType> = {
  Clothes: Shirt,
  Electronics: Laptop,
  Books: BookOpen,
  Toys: ToyBrick,
  Furniture: Sofa,
  Other: Package,
  All: Diamond,
};
