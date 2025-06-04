
import type { ThriftItem, ThriftItemCategory } from '@/lib/types';

export const sampleThriftItems: ThriftItem[] = [
  // Clothes
  { id: 'th001', name: 'Vintage Denim Jacket', description: 'Classic blue denim jacket, size M. Well-loved but in great condition, perfect for a retro look.', price: 2500, category: 'Clothes', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'denim jacket' },
  { id: 'th002', name: 'Striped Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt, size L. Red and white stripes, ideal for casual wear.', price: 800, category: 'Clothes', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'striped t-shirt' },
  { id: 'th003', name: 'Bohemian Print Scarf', description: 'Lightweight and airy scarf featuring a vibrant bohemian print. Measures 180cm x 70cm.', price: 600, category: 'Clothes', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'bohemian scarf' },
  { id: 'th004', name: 'Khaki Cargo Pants', description: 'Durable khaki cargo pants with multiple pockets, size 32 waist. Slightly faded for a rugged style.', price: 1800, category: 'Clothes', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'cargo pants' },

  // Electronics
  { id: 'th005', name: 'Refurbished Bluetooth Speaker', description: 'Compact Bluetooth speaker with good sound quality and 6-hour battery life. Includes charging cable.', price: 1500, category: 'Electronics', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'bluetooth speaker' },
  { id: 'th006', name: 'Used Android Tablet', description: '7-inch Android tablet, 16GB storage, good for reading, browsing, and light gaming. Screen has minor scratches.', price: 3500, category: 'Electronics', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'android tablet' },
  { id: 'th007', name: 'Vintage Film Camera', description: 'Classic 35mm film camera (brand XYZ), tested and in working condition. Lens included. A collector\'s item.', price: 4000, category: 'Electronics', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'film camera' },
  { id: 'th018', name: 'Retro Gaming Console + Games', description: 'Old-school gaming console with two controllers and a bundle of 5 classic games. Fully functional.', price: 3200, category: 'Electronics', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'gaming console' },


  // Books
  { id: 'th008', name: 'The Great Gatsby - F. Scott Fitzgerald', description: 'Paperback edition, good condition with some wear on the spine. A timeless classic.', price: 300, category: 'Books', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'gatsby book' },
  { id: 'th009', name: 'Sapiens: A Brief History of Humankind', description: 'Hardcover edition by Yuval Noah Harari, like new. Read once.', price: 700, category: 'Books', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'sapiens book' },
  { id: 'th010', name: 'Collection of Nepali Folk Tales', description: 'Beautifully illustrated book of traditional Nepali folk tales, perfect for all ages.', price: 450, category: 'Books', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'nepali folk tales' },
  { id: 'th019', name: 'Cookbook: "Himalayan Flavors"', description: 'A collection of authentic recipes from the Himalayan region. Paperback, good condition.', price: 550, category: 'Books', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'cookbook himalayan' },


  // Toys
  { id: 'th011', name: 'Wooden Building Blocks Set', description: 'Set of 50 colorful wooden building blocks for kids aged 3+. Comes in a storage box.', price: 1200, category: 'Toys', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'building blocks' },
  { id: 'th012', name: 'Plush Teddy Bear', description: 'Soft and cuddly brown teddy bear, approximately 12 inches tall. Excellent condition.', price: 900, category: 'Toys', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'teddy bear' },
  { id: 'th013', name: 'Remote Control Car', description: 'Fast RC car, red color, battery operated (batteries not included). Controller included. Works well.', price: 2200, category: 'Toys', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'remote car' },

  // Furniture
  { id: 'th014', name: 'Small Wooden Bookshelf', description: 'Compact 3-tier wooden bookshelf, dark brown finish. Good condition, minor scuffs.', price: 2800, category: 'Furniture', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'wooden bookshelf' },
  { id: 'th015', name: 'Vintage Style Table Lamp', description: 'Decorative table lamp with a fabric shade and ornate base. Adds a classic touch.', price: 1600, category: 'Furniture', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'table lamp' },
  { id: 'th016', name: 'Wicker Storage Basket', description: 'Large hand-woven wicker basket with handles, great for storage or as a planter.', price: 1000, category: 'Furniture', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'wicker basket' },
  { id: 'th017', name: 'Folding Study Chair', description: 'Simple and sturdy metal and plastic folding chair, blue color. Space-saving design.', price: 750, category: 'Furniture', imageUrl: 'https://placehold.co/400x400.png', imageHint: 'folding chair' }
];

export const thriftCategories: ThriftItemCategory[] = ['Clothes', 'Electronics', 'Books', 'Toys', 'Furniture'];
export const allThriftCategoryValue = 'All'; // To represent showing all categories
