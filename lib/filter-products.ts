import { Product } from "@/data/products";

export type ProductFilter = {
  query: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "name" | "price-asc" | "price-desc";
};

export function filterProducts(
  products: Product[],
  filter: ProductFilter,
): Product[] {
  const query = filter.query.trim().toLowerCase();

  return products
    .filter((product) => {
      const matchesQuery =
        query.length === 0 || product.name.toLowerCase().includes(query);
      const matchesCategory =
        filter.category === "all" || product.category === filter.category;
      const matchesMinPrice =
        filter.minPrice === undefined || product.price >= filter.minPrice;
      const matchesMaxPrice =
        filter.maxPrice === undefined || product.price <= filter.maxPrice;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (filter.sort === "price-asc") return a.price - b.price;
      if (filter.sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
}
