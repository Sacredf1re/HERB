const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Catálogo de produtos placeholder foi removido — adicione produtos reais
// pelo painel em /admin/products. Este seed cuida só da conta admin,
// dos cupons de exemplo, e dos campos de pagamento em cripto.
async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@wildroot.test" },
    update: {},
    create: {
      name: "Admin Wildroot",
      email: "admin@wildroot.test",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

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

  console.log("Banco de dados preparado.");
  console.log("Login do admin: admin@wildroot.test / Admin123!  <-- troque essa senha depois do primeiro acesso");
  console.log("Nenhum produto placeholder foi criado — adicione produtos reais em /admin/products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
