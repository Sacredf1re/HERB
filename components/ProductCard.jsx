import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/money";
import { categoryLabels } from "@/lib/categories";

export default function ProductCard({ product, avgRating }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.[0] || "https://picsum.photos/seed/placeholder/900/900"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <span className="tag-chip mb-2">{categoryLabels[product.category] || product.category}</span>
          <h3 className="font-display text-lg text-sage-dark leading-snug mt-1">{product.name}</h3>
          {product.tagline && <p className="text-sm text-ink/60 mt-1">{product.tagline}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="font-body text-ink">{formatPrice(product.price)}</span>
            {avgRating ? <span className="text-xs text-clay">★ {avgRating.toFixed(1)}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
