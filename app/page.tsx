import Link from "next/link";

export default function Home() {
  return (
    <main className="home-shell">
      <p className="eyebrow">Week 05</p>
      <h1>Product Finder</h1>
      <p>ระบบแสดงรายการสินค้า กรองข้อมูล และจัดการ URL State</p>
      <Link className="primary-link" href="/products">
        เปิด Product Finder →
      </Link>
    </main>
  );
}
