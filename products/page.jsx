import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { categories, categoryLabels } from "@/lib/categories";

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl mb-2">{category ? categoryLabels[category] || category : "A coleção completa"}</h1>
      <p className="text-ink/60 mb-8">{products.length} produto{products.length === 1 ? "" : "s"}</p>

      <div className="flex flex-wrap gap-2 mb-10">
        <a href="/products" className={`tag-chip ${!category ? "bg-sage text-cream" : ""}`}>Todos</a>
        {categories.map((c) => (
          <a
            key={c.value}
            href={`/products?category=${encodeURIComponent(c.value)}`}
            className={`tag-chip ${category === c.value ? "bg-sage text-cream" : ""}`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-ink/60">Nenhum produto nessa categoria ainda.</p>
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
