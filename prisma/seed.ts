import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Semeando o banco de dados...');

  await prisma.planta.deleteMany();

  await prisma.planta.createMany({
    data: [
      { nome: "Costela-de-adão", especie: "Monstera deliciosa", preco: 8990, estoque: 12, luminosidade: "MEIA_SOMBRA", petFriendly: true, regaACadaDias: 3 },
      { nome: "Cacto Rabo-de-Macaco", especie: "Cleistocactus winteri", preco: 3500, estoque: 0, luminosidade: "SOL_PLENO", petFriendly: false, regaACadaDias: 15 },
      { nome: "Antúrio Vermelho", especie: "Anthurium andraeanum", preco: 4500, estoque: 8, luminosidade: "MEIA_SOMBRA", petFriendly: false, regaACadaDias: 4 },
      { nome: "Samambaia Americana", especie: "Nephrolepis exaltata", preco: 5500, estoque: 5, luminosidade: "SOMBRA", petFriendly: true, regaACadaDias: 2 },
      { nome: "Zamioculca", especie: "Zamioculcas zamiifolia", preco: 12000, estoque: 3, luminosidade: "SOMBRA", petFriendly: false, regaACadaDias: 7 }
    ]
  });

  console.log('✅ Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });