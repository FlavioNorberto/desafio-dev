import { Request, Response } from "express";
import * as UserRepository from "@repositories/UserRepository";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nome, conta, documento } = req.body;

    if (!nome || !conta || !documento) {
      return res.status(400).json({
        message: "Preencha nome, conta e documento.",
      });
    }

    const user = await UserRepository.createUser({
      nome: nome,
      conta: conta,
      documento: documento,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar usuário." });
  }
};

export const readAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserRepository.findAllUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

export const readUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await UserRepository.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuário." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, conta, documento } = req.body;

    const user = await UserRepository.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const updatedUser = await UserRepository.updateUser(id, {
      nome: nome,
      conta: conta,
      documento: documento,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await UserRepository.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await UserRepository.deleteUser(id);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar usuário." });
  }
};
