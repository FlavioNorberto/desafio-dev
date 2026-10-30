import { Prisma, Luminosidade } from "@prisma/client";
import prisma from "../database"; // Importa a conexão com o banco de dados

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
  return prisma.planta.create({ data });
};

// Modifique a função findAllPlantas para aceitar os novos filtros
export const findAllPlantas = async (
  luminosidade?: Luminosidade, 
  petFriendly?: boolean,
  nome?: string, // Bónus: pesquisa
  ordem?: string // Bónus: ordenação
) => {
  // Lógica da ordenação
  let orderBy: any = undefined;
  if (ordem === "preco") orderBy = { preco: "asc" };
  else if (ordem === "nome") orderBy = { nome: "asc" };

  return prisma.planta.findMany({
    where: {
      luminosidade,
      petFriendly,
      // Bónus: O "contains" faz a pesquisa parcial e o "mode: insensitive" ignora maiúsculas/minúsculas
      nome: nome ? { contains: nome, mode: "insensitive" } : undefined 
    },
    orderBy, // Aplica a ordenação, se existir
  });
};

// Adicione esta nova função para a rota de esgotadas
export const findPlantasEsgotadas = async () => {
  return prisma.planta.findMany({
    where: { estoque: 0 },
  });
};

export const findPlantaById = async (id: number) => {
  return prisma.planta.findUnique({
    where: { id },
  });
};

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
  return prisma.planta.update({
    where: { id },
    data,
  });
};

export const deletePlanta = async (id: number) => {
  return prisma.planta.delete({
    where: { id },
  });
};

// Busca apenas o preço e o estoque de todas as plantas para calcular o valor total na rota de estoque
export const findPlantasParaValorTotal = async () => {
  return prisma.planta.findMany({
    select: {
      preco: true,
      estoque: true,
    },
  });
};