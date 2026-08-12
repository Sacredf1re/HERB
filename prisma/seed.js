const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const img = (seed, n = 2) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/900/900`);

// Original catalog, translated — kept under the original (English-taxonomy) categories.
const originalProducts = [
  {
    slug: "calm-root-chamomile-tea",
    name: "Chá de Camomila Raiz Calma",
    tagline: "Uma noite lenta, em infusão.",
    description:
      "Flores de camomila inteiras combinadas com erva-cidreira e um toque de lavanda. Folhas soltas, sem cafeína.",
    ingredients: "Flor de camomila, erva-cidreira, lavanda, casca de laranja seca",
    price: 9000,
    category: "Herbal Tea",
    images: img("chamomile")
  },
  {
    slug: "nettle-and-oat-infusion",
    name: "Infusão de Urtiga e Palha de Aveia",
    tagline: "Rica em minerais, verde de jardim.",
    description:
      "Uma infusão nutritiva construída a partir de folha de urtiga e palha de aveia. Terrosa e herbácea — ótima gelada ou quente.",
    ingredients: "Folha de urtiga, palha de aveia, hortelã-pimenta",
    price: 8000,
    category: "Herbal Tea",
    images: img("nettle")
  },
  {
    slug: "elderberry-immune-tincture",
    name: "Tintura de Sabugueiro para Imunidade",
    tagline: "Um conta-gotas cheio de preparo para a estação.",
    description:
      "Sabugueiro extraído lentamente, raiz de equinácea e gengibre em base de álcool de cana. Um pequeno ritual diário para os meses frios.",
    ingredients: "Sabugueiro, raiz de equinácea, raiz de gengibre, álcool de cana, glicerina vegetal",
    price: 13000,
    category: "Tincture",
    images: img("elderberry")
  },
  {
    slug: "valerian-sleep-tincture",
    name: "Gotas de Valeriana para o Sono",
    tagline: "Para a mente que não quer sossegar.",
    description:
      "Raiz de valeriana e maracujá, extraídas lentamente para um relaxamento suave. Tome 30 minutos antes de dormir.",
    ingredients: "Raiz de valeriana, maracujá, lúpulo, álcool de cana",
    price: 14000,
    category: "Tincture",
    images: img("valerian")
  },
  {
    slug: "calendula-repair-salve",
    name: "Bálsamo Reparador de Calêndula",
    tagline: "Para cotovelos, mãos e tudo que está ressecado.",
    description:
      "Um bálsamo espesso e clássico de óleo de oliva infusionado com calêndula, cera de abelha e manteiga de karité.",
    ingredients: "Óleo de oliva com calêndula, cera de abelha, manteiga de karité, vitamina E",
    price: 11000,
    category: "Salve & Balm",
    images: img("calendula2")
  },
  {
    slug: "yarrow-first-aid-balm",
    name: "Bálsamo de Primeiros Socorros de Mil-Folhas",
    tagline: "O que vive na sua bolsa.",
    description:
      "Mil-folhas, tanchagem e confrei em uma lata portátil. Para arranhões, picadas e peles ásperas do dia a dia.",
    ingredients: "Mil-folhas, folha de tanchagem, raiz de confrei, cera de abelha, óleo de coco",
    price: 7000,
    category: "Salve & Balm",
    images: img("yarrow2")
  },
  {
    slug: "lavender-fields-oil",
    name: "Óleo Essencial de Lavanda dos Campos",
    tagline: "Engarrafado a partir de uma tarde de julho.",
    description:
      "Lavanda francesa destilada a vapor, pura e sem misturas. Boa para difusor, spray de travesseiro ou banho quente.",
    ingredients: "100% óleo de Lavandula angustifolia",
    price: 10000,
    category: "Essential Oil",
    images: img("lavender")
  },
  {
    slug: "cedar-and-clove-oil",
    name: "Óleo de Cedro e Cravo",
    tagline: "Quente, amadeirado, um pouco teimoso.",
    description:
      "Uma mistura terrosa de cedro, cravo-da-índia e laranja doce. Mais noite de outono do que manhã de primavera.",
    ingredients: "Óleo de cedro, óleo de cravo-da-índia, óleo de laranja doce",
    price: 10500,
    category: "Essential Oil",
    images: img("cedar")
  },
  {
    slug: "rosemary-mint-body-oil",
    name: "Óleo Corporal de Alecrim e Hortelã",
    tagline: "Para depois do banho, antes do dia começar.",
    description:
      "Um óleo corporal seco de rápida absorção com alecrim, hortelã-pimenta e jojoba. Vibrante e revigorante.",
    ingredients: "Óleo de jojoba, óleo de amêndoas doces, extrato de alecrim, óleo de hortelã-pimenta",
    price: 12000,
    category: "Body Oil",
    images: img("rosemary")
  }
];

// Newer catalog, under the trend-aligned categories.
const trendProducts = [
  {
    slug: "balsamo-reparador-de-calendula",
    name: "Bálsamo Reparador de Calêndula Intensivo",
    tagline: "Para cotovelos, mãos e tudo que está ressecado.",
    description:
      "Uma versão mais concentrada do nosso bálsamo de calêndula, pensado para skincare de rosto e mãos no dia a dia.",
    ingredients: "Óleo de oliva com calêndula, cera de abelha, manteiga de karité, vitamina E",
    price: 11000,
    category: "Skincare",
    images: img("calendula")
  },
  {
    slug: "balsamo-de-mil-folhas-para-pele",
    name: "Bálsamo Calmante de Mil-Folhas",
    tagline: "Para peles reativas e sensíveis.",
    description:
      "Mil-folhas, tanchagem e confrei formulados especificamente para acalmar vermelhidão e irritação da pele.",
    ingredients: "Mil-folhas, folha de tanchagem, raiz de confrei, cera de abelha, óleo de coco",
    price: 7000,
    category: "Skincare",
    images: img("yarrow")
  },
  {
    slug: "cha-de-camomila-noite-calma",
    name: "Ritual de Chá para Dormir — Camomila",
    tagline: "Uma noite lenta, em infusão.",
    description:
      "A mesma camomila que você ama, pensada como parte de um ritual noturno — combine com nossas Gotas de Valeriana.",
    ingredients: "Flor de camomila, erva-cidreira, lavanda, casca de laranja seca",
    price: 9000,
    category: "Sleep",
    images: img("chamomile-sleep")
  },
  {
    slug: "gotas-de-valeriana-para-dormir",
    name: "Gotas de Valeriana — Ritual do Sono",
    tagline: "Para a mente que não quer sossegar.",
    description:
      "Valeriana e maracujá em gotas, parte da nossa linha de rituais de sono. Tome 30 minutos antes de deitar.",
    ingredients: "Raiz de valeriana, maracujá, lúpulo, álcool de cana",
    price: 14000,
    category: "Sleep",
    images: img("valerian-sleep")
  },
  {
    slug: "oleo-de-alecrim-para-couro-cabeludo",
    name: "Óleo de Alecrim para Couro Cabeludo",
    tagline: "Um ritual de cinco minutos antes do banho.",
    description:
      "Óleo de alecrim puro, destilado a vapor, pensado para massagem no couro cabeludo. Sem enchimento, sem perfume artificial.",
    ingredients: "Óleo essencial de alecrim (Rosmarinus officinalis)",
    price: 10000,
    category: "Hair",
    images: img("rosemaryhair")
  },
  {
    slug: "oleo-de-ricino-fortalecedor",
    name: "Óleo de Rícino Fortalecedor",
    tagline: "Espesso, denso, à moda antiga.",
    description:
      "Óleo de rícino prensado a frio, puro. Um clássico para pontas e comprimento — um pouco rende muito.",
    ingredients: "Óleo de rícino 100% prensado a frio",
    price: 9500,
    category: "Hair",
    images: img("castor")
  },
  {
    slug: "infusao-de-urtiga-e-aveia",
    name: "Infusão Nutritiva de Urtiga e Aveia",
    tagline: "Rica em minerais, verde de jardim.",
    description:
      "Uma infusão nutritiva diária, parte da nossa linha de nutrição — feita para ser bebida com frequência, não só ocasionalmente.",
    ingredients: "Folha de urtiga, palha de aveia, hortelã",
    price: 8000,
    category: "Nutrition",
    images: img("nettle-nutrition")
  },
  {
    slug: "tintura-de-sabugueiro",
    name: "Tintura de Sabugueiro — Suporte Diário",
    tagline: "Um conta-gotas cheio de preparo para a estação.",
    description:
      "Sabugueiro, equinácea e gengibre, pensados como parte de uma rotina nutricional diária, não só para os meses frios.",
    ingredients: "Sabugueiro, raiz de equinácea, raiz de gengibre, álcool de cana, glicerina vegetal",
    price: 13000,
    category: "Nutrition",
    images: img("elderberry-nutrition")
  }
];

const products = [...originalProducts, ...trendProducts];

const reviews = [
  { rating: 5, comment: "O chá de camomila virou parte fixa da minha noite.", authorName: "Priya S." },
  { rating: 4, comment: "Sabor terroso, muito bom. Queria uma lata maior.", authorName: "Marco D." },
  { rating: 5, comment: "O bálsamo curou minhas mãos rachadas em poucos dias.", authorName: "Anke V." }
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wildroot.test" },
    update: {},
    create: {
      name: "Admin Wildroot",
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
    where: { code: "BEMVINDO10" },
    update: {},
    create: { code: "BEMVINDO10", type: "PERCENT", value: 10, minSubtotal: 0 }
  });

  await prisma.coupon.upsert({
    where: { code: "RAIZ5" },
    update: {},
    create: { code: "RAIZ5", type: "FIXED", value: 500, minSubtotal: 3000 }
  });

  console.log("Banco de dados populado.");
  console.log("Login do admin: admin@wildroot.test / Admin123!  <-- troque essa senha depois do primeiro acesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
