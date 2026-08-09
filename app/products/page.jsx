import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(category) {
  const products = await prisma.product.findMany({
    where: { active: true, ...(category ? { category } : {}) },
    orderBy: { name: "asc" },
    include: { reviews: { select: { rating: true } } }
  });
  return products.map((p) => ({
    ...p,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : null
  }));
}

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category;
  const products = await getProducts(category);
  const categories = ["Herbal Tea", "Tincture", "Salve & Balm", "Essential Oil", "Body Oil"];

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl mb-2">{category ? category : "The full collection"}</h1>
      <p className="text-ink/60 mb-8">{products.length} product{products.length === 1 ? "" : "s"}</p>

      <div className="flex flex-wrap gap-2 mb-10">
        <a href="/products" className={`tag-chip ${!category ? "bg-sage text-cream" : ""}`}>All</a>
        {categories.map((c) => (
          <a
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className={`tag-chip ${category === c ? "bg-sage text-cream" : ""}`}
          >
            {c}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-ink/60">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} avgRating={p.avgRating} />
          ))}
        </div>
      )}
    </div>
  );
}
