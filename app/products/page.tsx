import Link from "next/link";
import { Product, products } from "@/data/products";
import { filterProducts } from "@/lib/filter-products";

const PAGE_SIZE = 4;

type SearchParams = {
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  page?: string | string[];
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePrice(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parsePage(value: string): number {
  if (!/^\d+$/.test(value.trim())) return 1;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : 1;
}

function buildPageUrl(
  params: Record<string, string>,
  page: number,
): string {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  return `/products?${next.toString()}`;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-icon" aria-hidden="true">
        {product.category === "tech"
          ? "💻"
          : product.category === "office"
            ? "🪑"
            : "🎒"}
      </div>
      <div className="product-content">
        <div className="product-topline">
          <span className="category">{product.category}</span>
          <span className="product-id">#{product.id}</span>
        </div>
        <h2>{product.name}</h2>
        <p className="price">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = first(params.q).trim();
  const category = first(params.category) || "all";
  const sortValue = first(params.sort);
  const sort =
    sortValue === "price-asc" || sortValue === "price-desc"
      ? sortValue
      : "name";

  const minPrice = parsePrice(first(params.minPrice));
  const maxPrice = parsePrice(first(params.maxPrice));

  const safeMin = minPrice !== undefined && maxPrice !== undefined
    ? Math.min(minPrice, maxPrice)
    : minPrice;
  const safeMax = minPrice !== undefined && maxPrice !== undefined
    ? Math.max(minPrice, maxPrice)
    : maxPrice;

  const filtered: Product[] = filterProducts(products, {
    query,
    category,
    minPrice: safeMin,
    maxPrice: safeMax,
    sort,
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = parsePage(first(params.page));
  const currentPage = Math.min(requestedPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filtered.slice(start, start + PAGE_SIZE);

  const urlParams: Record<string, string> = {};
  if (query) urlParams.q = query;
  if (category !== "all") urlParams.category = category;
  if (sort !== "name") urlParams.sort = sort;
  if (safeMin !== undefined) urlParams.minPrice = String(safeMin);
  if (safeMax !== undefined) urlParams.maxPrice = String(safeMax);

  const previousUrl = buildPageUrl(urlParams, currentPage - 1);
  const nextUrl = buildPageUrl(urlParams, currentPage + 1);
  const filterQuery = new URLSearchParams(urlParams);
  filterQuery.delete("page");

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Product Finder</p>
          <h1>ค้นหาสินค้า</h1>
          <p className="subtitle">
            กรองสินค้าและเก็บสถานะทั้งหมดไว้ใน URL Query String
          </p>
        </div>
        <Link className="home-link" href="/">
          หน้าแรก
        </Link>
      </header>

      <section className="filter-panel" aria-labelledby="filter-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">URL State</p>
            <h2 id="filter-title">ตัวกรองสินค้า</h2>
          </div>
          <span className="result-count">{filtered.length} รายการ</span>
        </div>

        <form className="filter-form" method="get">
          <label>
            ค้นหาชื่อสินค้า
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="เช่น keyboard"
            />
          </label>

          <label>
            หมวดหมู่
            <select name="category" defaultValue={category}>
              <option value="all">ทั้งหมด</option>
              <option value="office">Office</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </label>

          <label>
            ราคาต่ำสุด
            <input
              type="number"
              name="minPrice"
              min="0"
              step="0.01"
              defaultValue={safeMin ?? ""}
              placeholder="0"
            />
          </label>

          <label>
            ราคาสูงสุด
            <input
              type="number"
              name="maxPrice"
              min="0"
              step="0.01"
              defaultValue={safeMax ?? ""}
              placeholder="999"
            />
          </label>

          <label>
            เรียงตาม
            <select name="sort" defaultValue={sort}>
              <option value="name">ชื่อสินค้า</option>
              <option value="price-asc">ราคาต่ำ → สูง</option>
              <option value="price-desc">ราคาสูง → ต่ำ</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">ค้นหา</button>
            <Link className="reset-button" href="/products">
              ล้างตัวกรอง
            </Link>
          </div>
        </form>

        <p className="url-state">
          URL State: <code>/products{filterQuery.toString() ? `?${filterQuery.toString()}` : ""}</code>
        </p>
      </section>

      <section className="products-section" aria-labelledby="products-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Results</p>
            <h2 id="products-title">รายการสินค้า</h2>
          </div>
          <span className="page-status">
            หน้า {currentPage} / {totalPages}
          </span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>ไม่พบสินค้า</h2>
            <p>ลองปรับคำค้นหา หมวดหมู่ หรือช่วงราคาใหม่</p>
          </div>
        )}

        <nav className="pagination" aria-label="Product pagination">
          {currentPage > 1 ? (
            <Link href={previousUrl} className="pagination-link">
              ← ก่อนหน้า
            </Link>
          ) : (
            <span className="pagination-link disabled" aria-disabled="true">
              ← ก่อนหน้า
            </span>
          )}

          <span className="page-number">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={nextUrl} className="pagination-link">
              ถัดไป →
            </Link>
          ) : (
            <span className="pagination-link disabled" aria-disabled="true">
              ถัดไป →
            </span>
          )}
        </nav>

        <div className="test-note">
          <strong>ทดสอบ URL:</strong> <code>?page=-5</code> และ{" "}
          <code>?page=abc</code> จะกลับไปหน้า 1 ส่วน{" "}
          <code>?page=999</code> จะถูกจำกัดไว้ที่หน้าสุดท้าย
        </div>
      </section>
    </main>
  );
}
