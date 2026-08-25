import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { storefrontCategories, categoryLabels } from "@/lib/categories";

export const dynamic = "force-dynamic";

const sortOptions = [
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliado" }
];

async function getProducts(category) {
  const products = await prisma.product.findMany({
    where: { active: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    include: { reviews: { select: { rating: true } } }
  });
  return products.map((p) => ({
    ...p,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length
  }));
}

function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount);
    default:
      return list;
  }
}

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category;
  const sort = searchParams?.sort || "newest";
  const products = sortProducts(await getProducts(category), sort);

  function sortUrl(value) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (value !== "newest") params.set("sort", value);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl mb-2">{category ? categoryLabels[category] || category : "A coleção completa"}</h1>
      <p className="text-ink/60 mb-8">{products.length} produto{products.length === 1 ? "" : "s"}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {storefrontCategories.map((c) => (
          <a
            key={c.value}
            href={`/products?category=${encodeURIComponent(c.value)}${sort !== "newest" ? `&sort=${sort}` : ""}`}
            className={`tag-chip ${category === c.value ? "bg-sage text-cream" : ""}`}
          >
            {c.label}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-10 text-sm">
        <span className="text-ink/50 mr-1">Ordenar:</span>
        {sortOptions.map((s) => (
          <a
            key={s.value}
            href={sortUrl(s.value)}
            className={`tag-chip ${sort === s.value ? "bg-clay text-cream" : ""}`}
          >
            {s.label}
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
