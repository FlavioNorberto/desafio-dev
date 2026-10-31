import { Prisma, Luminosidade } from "@prisma/client";
import prisma from "../database";

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
  return prisma.planta.create({ data });
};

export const findAllPlantas = async (
  luminosidade?: Luminosidade, 
  petFriendly?: boolean,
  nome?: string,
  ordem?: string
) => {
  let orderBy: any = undefined;
  if (ordem === "preco") orderBy = { preco: "asc" };
  else if (ordem === "nome") orderBy = { nome: "asc" };

  return prisma.planta.findMany({
    where: {
      luminosidade,
      petFriendly,
      nome: nome ? { contains: nome, mode: "insensitive" } : undefined 
    },
    orderBy,
  });
};

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

export const findPlantasParaValorTotal = async () => {
  return prisma.planta.findMany({
    select: {
      preco: true,
      estoque: true,
    },
  });
};