import { prisma } from "@/lib/prisma";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-3xl mb-8">Reviews</h1>
      <AdminReviewsClient initialReviews={reviews} />
    </div>
  );
}
