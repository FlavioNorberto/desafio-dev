import { Request, Response } from "express";
import { Luminosidade } from "@prisma/client";
import * as PlantaRepository from "../repositories/PlantaRepository";

// --- 1. CRIAR UMA PLANTA ---
export const create = async (req: Request, res: Response) => {
  try {
    // Desestruturar o req.body para não enviar lixo para a base de dados
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    // Validações estritas usando typeof e === undefined
    if (nome === undefined || typeof nome !== "string" || nome.trim() === "") return res.status(400).json({ error: "Nome é obrigatório e deve ser texto." });
    if (especie === undefined || typeof especie !== "string" || especie.trim() === "") return res.status(400).json({ error: "Espécie é obrigatória e deve ser texto." });
    if (preco === undefined || !Number.isInteger(preco) || preco <= 0) return res.status(400).json({ error: "Preço é obrigatório e maior que zero." });
    if (estoque === undefined || !Number.isInteger(estoque) || estoque < 0) return res.status(400).json({ error: "Estoque é obrigatório e não pode ser negativo." });
    if (luminosidade === undefined || !Object.values(Luminosidade).includes(luminosidade)) return res.status(400).json({ error: "Luminosidade inválida." });
    if (petFriendly === undefined || typeof petFriendly !== "boolean") return res.status(400).json({ error: "PetFriendly é obrigatório e booleano." });
    if (regaACadaDias === undefined || !Number.isInteger(regaACadaDias) || regaACadaDias < 1) return res.status(400).json({ error: "regaACadaDias é obrigatório (mínimo 1)." });

    const planta = await PlantaRepository.createPlanta({ nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias });
    return res.status(201).json(planta); // Importante: usar sempre return antes do res.status
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 2. LISTAR PLANTAS (COM FILTROS) ---
export const findAll = async (req: Request, res: Response) => {
  try {
    const { luminosidade, petFriendly, nome, ordem } = req.query; // Capturamos os bónus aqui
    
    let filtroLuminosidade: Luminosidade | undefined;
    if (luminosidade !== undefined) {
      if (typeof luminosidade !== "string" || !Object.values(Luminosidade).includes(luminosidade as Luminosidade)) {
        return res.status(400).json({ error: "Filtro de luminosidade inválido." });
      }
      filtroLuminosidade = luminosidade as Luminosidade;
    }

    let filtroPetFriendly: boolean | undefined;
    if (petFriendly !== undefined) {
      if (petFriendly === "true") filtroPetFriendly = true;
      else if (petFriendly === "false") filtroPetFriendly = false;
      else return res.status(400).json({ error: "Filtro petFriendly inválido." });
    }

    // Passamos os parâmetros extra para o repositório
    const plantas = await PlantaRepository.findAllPlantas(
      filtroLuminosidade, 
      filtroPetFriendly,
      nome as string | undefined,
      ordem as string | undefined
    );
    
    return res.status(200).json(plantas);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 3. BUSCAR PLANTA POR ID ---
export const findById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido." });

    const planta = await PlantaRepository.findPlantaById(id);
    if (!planta) return res.status(404).json({ error: "Planta não encontrada." }); // 404 se não existir

    return res.status(200).json(planta);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 4. ATUALIZAR PLANTA (PATCH) ---
export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido." });

    const plantaAtual = await PlantaRepository.findPlantaById(id);
    if (!plantaAtual) return res.status(404).json({ error: "Planta não encontrada." });

    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    // Na edição, só validamos se o campo tiver sido enviado
    if (nome !== undefined && (typeof nome !== "string" || nome.trim() === "")) return res.status(400).json({ error: "Nome inválido." });
    if (especie !== undefined && (typeof especie !== "string" || especie.trim() === "")) return res.status(400).json({ error: "Espécie inválida." });
    if (preco !== undefined && (!Number.isInteger(preco) || preco <= 0)) return res.status(400).json({ error: "Preço inválido." });
    if (estoque !== undefined && (!Number.isInteger(estoque) || estoque < 0)) return res.status(400).json({ error: "Estoque inválido." });
    if (luminosidade !== undefined && !Object.values(Luminosidade).includes(luminosidade)) return res.status(400).json({ error: "Luminosidade inválida." });
    if (petFriendly !== undefined && typeof petFriendly !== "boolean") return res.status(400).json({ error: "PetFriendly inválido." });
    if (regaACadaDias !== undefined && (!Number.isInteger(regaACadaDias) || regaACadaDias < 1)) return res.status(400).json({ error: "regaACadaDias inválido." });

    // Monta o objeto apenas com os dados que foram enviados
    const data: any = {};
    if (nome !== undefined) data.nome = nome;
    if (especie !== undefined) data.especie = especie;
    if (preco !== undefined) data.preco = preco;
    if (estoque !== undefined) data.estoque = estoque;
    if (luminosidade !== undefined) data.luminosidade = luminosidade;
    if (petFriendly !== undefined) data.petFriendly = petFriendly;
    if (regaACadaDias !== undefined) data.regaACadaDias = regaACadaDias;

    const plantaAtualizada = await PlantaRepository.updatePlanta(id, data);
    return res.status(200).json(plantaAtualizada);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 5. ELIMINAR PLANTA ---
export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido." });

    const planta = await PlantaRepository.findPlantaById(id);
    if (!planta) return res.status(404).json({ error: "Planta não encontrada." });

    await PlantaRepository.deletePlanta(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 6. REGISTAR VENDA ---
export const vender = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido." });

    const { quantidade } = req.body;
    if (quantidade === undefined || !Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({ error: "Quantidade inválida. Deve ser um inteiro maior que zero." });
    }

    const planta = await PlantaRepository.findPlantaById(id);
    if (!planta) return res.status(404).json({ error: "Planta não encontrada." });

    // Verifica se há stock suficiente antes de tentar abater
    if (planta.estoque < quantidade) {
      return res.status(400).json({ error: `Estoque insuficiente. Temos só ${planta.estoque} vasos.` });
    }

    const plantaAtualizada = await PlantaRepository.updatePlanta(id, {
      estoque: { decrement: quantidade } // Prisma faz o decréscimo matemático automático
    });

    return res.status(200).json(plantaAtualizada);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 7. VALOR TOTAL DO STOCK ---
export const getValorTotal = async (req: Request, res: Response) => {
  try {
    const plantas = await PlantaRepository.findPlantasParaValorTotal();
    
    let valorTotalEmCentavos = 0;
    let totalDeVasos = 0;

    for (const p of plantas) {
      valorTotalEmCentavos += (p.preco * p.estoque);
      totalDeVasos += p.estoque;
    }

    return res.status(200).json({
      valorTotalEmCentavos,
      totalDeVasos
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// --- 8. BÓNUS: PLANTAS ESGOTADAS ---
export const findEsgotadas = async (req: Request, res: Response) => {
  try {
    const plantas = await PlantaRepository.findPlantasEsgotadas();
    return res.status(200).json(plantas);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};