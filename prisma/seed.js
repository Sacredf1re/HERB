const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const img = (seed, n = 2) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/900/900`);

const products = [
  {
    slug: "calm-root-chamomile-tea",
    name: "Calm Root Chamomile Tea",
    tagline: "A slow evening, steeped.",
    description:
      "Whole chamomile flowers blended with lemon balm and a whisper of lavender. Loose leaf, caffeine-free, meant for the last hour of the day.",
    ingredients: "Chamomile flower, lemon balm, lavender, dried orange peel",
    price: 1800,
    category: "Herbal Tea",
    images: img("chamomile")
  },
  {
    slug: "nettle-and-oat-infusion",
    name: "Nettle & Oat Straw Infusion",
    tagline: "Mineral-rich, garden-green.",
    description:
      "A nourishing daily infusion built from nettle leaf and oat straw. Earthy and grassy — best steeped long, iced or hot.",
    ingredients: "Nettle leaf, oat straw, spearmint",
    price: 1600,
    category: "Herbal Tea",
    images: img("nettle")
  },
  {
    slug: "elderberry-immune-tincture",
    name: "Elderberry Immune Tincture",
    tagline: "A dropper full of season-proofing.",
    description:
      "Slow-extracted elderberry, echinacea root, and ginger in a cane-alcohol base. A small daily ritual for the colder months.",
    ingredients: "Elderberry, echinacea root, ginger root, cane alcohol, vegetable glycerin",
    price: 2600,
    category: "Tincture",
    images: img("elderberry")
  },
  {
    slug: "valerian-sleep-tincture",
    name: "Valerian Root Sleep Drops",
    tagline: "For the mind that won't sit still.",
    description:
      "Valerian root and passionflower, extracted slow and blended for a gentle wind-down. Take 30 minutes before bed.",
    ingredients: "Valerian root, passionflower, hops, cane alcohol",
    price: 2800,
    category: "Tincture",
    images: img("valerian")
  },
  {
    slug: "calendula-repair-salve",
    name: "Calendula Repair Salve",
    tagline: "For elbows, knuckles, and everything cracked.",
    description:
      "A thick, old-fashioned salve of calendula-infused olive oil, beeswax, and shea. Handmade in small batches.",
    ingredients: "Olive oil infused with calendula, beeswax, shea butter, vitamin E",
    price: 2200,
    category: "Salve & Balm",
    images: img("calendula")
  },
  {
    slug: "yarrow-first-aid-balm",
    name: "Yarrow First Aid Balm",
    tagline: "The one that lives in your bag.",
    description:
      "Yarrow, plantain, and comfrey infused into a portable tin. For scrapes, bug bites, and rough patches on the trail.",
    ingredients: "Yarrow, plantain leaf, comfrey root, beeswax, coconut oil",
    price: 1400,
    category: "Salve & Balm",
    images: img("yarrow")
  },
  {
    slug: "lavender-fields-oil",
    name: "Lavender Fields Essential Oil",
    tagline: "Bottled from a July afternoon.",
    description:
      "Steam-distilled French lavender, unblended and unfussy. Good for a diffuser, a pillow spray, or a warm bath.",
    ingredients: "100% Lavandula angustifolia oil",
    price: 2000,
    category: "Essential Oil",
    images: img("lavender")
  },
  {
    slug: "cedar-and-clove-oil",
    name: "Cedar & Clove Blend Oil",
    tagline: "Warm, woody, a little bit stubborn.",
    description:
      "A grounding blend of cedarwood, clove bud, and sweet orange. Leans more autumn evening than spring morning.",
    ingredients: "Cedarwood oil, clove bud oil, sweet orange oil",
    price: 2100,
    category: "Essential Oil",
    images: img("cedar")
  },
  {
    slug: "rosemary-mint-body-oil",
    name: "Rosemary Mint Body Oil",
    tagline: "For after the shower, before the day starts.",
    description:
      "A fast-absorbing dry body oil with rosemary, peppermint, and jojoba. Bright and a little bracing.",
    ingredients: "Jojoba oil, sweet almond oil, rosemary extract, peppermint oil",
    price: 2400,
    category: "Body Oil",
    images: img("rosemary")
  }
];

const reviews = [
  { rating: 5, comment: "The chamomile tea is now a non-negotiable part of my evening.", authorName: "Priya S." },
  { rating: 4, comment: "Good, earthy flavor. Wish the tin were a bit bigger.", authorName: "Marco D." },
  { rating: 5, comment: "The salve healed my garden-scraped hands in a couple of days.", authorName: "Anke V." }
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wildroot.test" },
    update: {},
    create: {
      name: "Wildroot Admin",
      email: "admin@wildroot.test",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });

    // seed one placeholder review per product, editable later from /admin/reviews
    const sample = reviews[Math.floor(Math.random() * reviews.length)];
    const existing = await prisma.review.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: admin.id,
          authorName: sample.authorName,
          rating: sample.rating,
          comment: sample.comment
        }
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minSubtotal: 0 }
  });

  await prisma.coupon.upsert({
    where: { code: "ROOT5" },
    update: {},
    create: { code: "ROOT5", type: "FIXED", value: 500, minSubtotal: 3000 }
  });

  console.log("Seeded database.");
  console.log("Admin login: admin@wildroot.test / Admin123!  <-- change this after first login");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
