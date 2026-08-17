export type Product = {
  id: number;
  name: string;
  category: "office" | "tech" | "lifestyle";
  price: number;
  owner?: string;
};

export const products: Product[] = [
  { id: 1, name: "Standing Desk", category: "office", price: 299.99 },
  { id: 2, name: "Ergonomic Chair", category: "office", price: 189.99 },
  { id: 3, name: "Desk Lamp", category: "office", price: 49.99 },
  { id: 4, name: "Mechanical Keyboard", category: "tech", price: 99.99 },
  { id: 5, name: "Wireless Mouse", category: "tech", price: 39.99 },
  { id: 6, name: "USB-C Hub", category: "tech", price: 59.99 },
  { id: 7, name: "Noise Cancelling Headphones", category: "tech", price: 249.99 },
  { id: 8, name: "Smart Water Bottle", category: "lifestyle", price: 79.99 },
  { id: 9, name: "Travel Backpack", category: "lifestyle", price: 129.99 },
  { id: 10, name: "Reusable Coffee Tumbler", category: "lifestyle", price: 34.99 },
  { id: 11, name: "Fitness Smartwatch", category: "lifestyle", price: 199.99 },
  { id: 12, name: "Monitor Arm", category: "office", price: 89.99 },
  { id: 13, name: "4K Monitor", category: "tech", price: 349.99 },
  { id: 14, name: "Portable Desk Fan", category: "office", price: 44.99 },
  { id: 15, name: "Everyday Sling Bag", category: "lifestyle", price: 69.99 },
];
