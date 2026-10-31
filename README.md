# 🌿 API Folhagem & Cia - Desafio Back-end CITi

> API RESTful desenvolvida como resolução do desafio de Back-end do processo seletivo do CITi. O sistema substitui o controle manual de planilhas por um sistema de gerenciamento de estoque automatizado e seguro.

## 🛠 Tecnologias Utilizadas

* **Linguagem:** TypeScript / Node.js
* **Framework Web:** Express
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Infraestrutura:** Docker & Docker Compose
* **Gerenciador de Pacotes:** Yarn

## ⚙️ Como rodar o projeto localmente

Siga o passo a passo abaixo para executar a aplicação na sua máquina:

**1. Clone o repositório e instale as dependências**
```bash
git clone <link-do-seu-repositorio>
cd desafio-dev
yarn install
```

**2. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto com base no arquivo de exemplo:
```bash
cp .env.example .env
```

**3. Suba o banco de dados e a aplicação com Docker**
```bash
docker compose up -d --build
```

**4. Crie as tabelas no banco de dados e popule com dados iniciais (Seed)**
```bash
yarn migration
yarn prisma db seed
```

A API estará rodando e pronta para receber requisições em `http://localhost:3001`.

---

## 📦 Modelo de Dados (Entidade `Planta`)

O banco de dados foi modelado para armazenar as seguintes informações:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `Int` | Identificador único (Autoincrement) |
| `nome` | `String` | Nome popular da planta |
| `especie` | `String` | Nome científico (Ex: *Monstera deliciosa*) |
| `preco` | `Int` | Valor da planta em centavos |
| `estoque` | `Int` | Quantidade disponível em estoque |
| `luminosidade`| `Enum` | `SOMBRA`, `MEIA_SOMBRA` ou `SOL_PLENO` |
| `petFriendly` | `Boolean` | Se a planta é segura para animais |
| `regaACadaDias`| `Int` | Frequência de rega em dias |
| `createdAt` | `DateTime`| Data de registro gerada automaticamente |
| `updatedAt` | `DateTime`| Data de atualização gerada automaticamente |

---

## 🚀 Rotas da API e Status HTTP

Todas as funcionalidades e regras de negócio exigidas foram implementadas, incluindo retornos de erro tratados e status HTTP corretos.

### Rotas Gerais
| Método | Endpoint | Descrição | Status de Sucesso | Erros Tratados (400/404) |
|:---:|---|---|:---:|---|
| `POST` | `/plantas` | Cadastra uma nova planta. | `201 Created` | JSON malformado, dados faltando, tipos inválidos. |
| `GET` | `/plantas/:id` | Retorna os detalhes de uma planta. | `200 OK` | ID não numérico, planta não encontrada. |
| `PATCH`| `/plantas/:id` | Atualiza dados de uma planta existente. | `200 OK` | Dados inválidos, planta não encontrada. |
| `DELETE`| `/plantas/:id` | Remove uma planta do sistema. | `204 No Content` | Planta não encontrada. |
| `POST` | `/plantas/:id/venda` | Deduz estoque baseado na quantidade vendida. | `200 OK` | Estoque insuficiente, planta não encontrada. |
| `GET` | `/plantas/estoque/valor-total`| Retorna o valor total em reais de todo o estoque. | `200 OK` | - |

### 🌟 Funcionalidades Bônus Implementadas

O endpoint de listagem principal (`GET /plantas`) foi aprimorado para suportar múltiplos filtros dinâmicos e de ordenação simultâneos:

* **Busca textual (Case-insensitive):** `GET /plantas?nome=costela`
* **Ordenação:** `GET /plantas?ordem=preco` ou `?ordem=nome`
* **Filtros Exatos:** `GET /plantas?luminosidade=SOMBRA` ou `?petFriendly=true`

Além disso, foi criada uma rota bônus específica para auditar o estoque zerado:
* **Plantas Esgotadas:** `GET /plantas/esgotadas`

---
*Projeto desenvolvido por Flávio Norberto para o processo seletivo do CITi.*