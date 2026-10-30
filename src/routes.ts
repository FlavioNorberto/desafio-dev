import express from "express";
import * as UserController from "@controllers/UserController";
import * as PlantaController from "./controllers/PlantaController"; // Importando o nosso novo controller

const routes = express.Router();

routes.get("/", (req, res) => {
  res.status(200).json({ message: "API do treinamento de CRUD do CITi 🚀" });
});

// CRUD de usuários
routes.post("/users", UserController.createUser);
routes.get("/users", UserController.readAllUsers);
routes.get("/users/:id", UserController.readUserById);
routes.patch("/users/:id", UserController.updateUser);
routes.delete("/users/:id", UserController.deleteUser);

// ==========================================
// CRUD DE PLANTAS (Adicionado)
// ==========================================

// 1. Rotas fixas (têm de vir ANTES do :id)
routes.get("/plantas/estoque/valor-total", PlantaController.getValorTotal);
routes.get("/plantas/esgotadas", PlantaController.findEsgotadas);

// 2. Rotas gerais
routes.post("/plantas", PlantaController.create);
routes.get("/plantas", PlantaController.findAll);

// 3. Rotas com parâmetro dinâmico (:id)
routes.get("/plantas/:id", PlantaController.findById);
routes.patch("/plantas/:id", PlantaController.update);
routes.delete("/plantas/:id", PlantaController.remove);
routes.post("/plantas/:id/venda", PlantaController.vender);

export default routes;
