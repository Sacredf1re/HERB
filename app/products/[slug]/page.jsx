import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import StarRating from "@/components/StarRating";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewSection from "@/components/ReviewSection";
import SprigDivider from "@/components/SprigDivider";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { createdAt: "desc" } } }
  });
  return product;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product || !product.active) notFound();

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="grid grid-cols-2 gap-3">
          {(product.images.length ? product.images : ["https://picsum.photos/seed/placeholder/900/900"]).map(
            (src, i) => (
              <div key={i} className={`relative aspect-square rounded-xl overflow-hidden ${i === 0 ? "col-span-2" : ""}`}>
                <Image src={src} alt={`${product.name} photo ${i + 1}`} fill className="object-cover" />
              </div>
            )
          )}
        </div>

        <div>
          <span className="tag-chip">{product.category}</span>
          <h1 className="text-4xl mt-3">{product.name}</h1>
          {product.tagline && <p className="text-ink/60 italic mt-1">{product.tagline}</p>}

          <div className="flex items-center gap-2 mt-3">
            <StarRating value={avgRating} />
            <span className="text-sm text-ink/50">
              {product.reviews.length} review{product.reviews.length === 1 ? "" : "s"}
            </span>
          </div>

          <p className="text-2xl font-body text-sage-dark mt-5">{formatPrice(product.price)}</p>

          <p className="text-ink/70 mt-5 leading-relaxed">{product.description}</p>

          {product.ingredients && (
            <div className="mt-5">
              <p className="eyebrow mb-2">Ingredients</p>
              <p className="text-sm text-ink/60">{product.ingredients}</p>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <SprigDivider />

      <div className="max-w-2xl">
        <h2 className="text-3xl mb-6">Reviews</h2>
        <ReviewSection productId={product.id} initialReviews={product.reviews} />
      </div>
    </div>
  );
}
