# 🛡️ Sistema CRUD Seguro (Arquitetura Web Fortificada)

Este projeto implementa um sistema básico de gerenciamento de usuários (CRUD - Create, Read, Update, Delete) utilizando **Node.js, Express, EJS e MongoDB (Mongoose)**. O foco principal é a **Implementação de Defesas Arquiteturais e de Código**, conforme as diretrizes do **Trabalho 4**, para proteger a aplicação contra vulnerabilidades críticas da OWASP Top 10.

---

## 🔒 Defesas de Segurança Implementadas

A aplicação foi fortificada com middlewares e práticas de código essenciais, atendendo a todas as tarefas de segurança:

| Vulnerabilidade | Defesa Implementada | Ferramenta/Técnica | Contexto / Tarefa |
| :--- | :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Queries Parametrizadas | Mongoose ORM | TAREFA 1A |
| **Cross-Site Scripting (XSS)** | Contextual Encoding | EJS (`<%= ... %>`) | TAREFA 1B |
| **Broken Access Control** | Middleware de Autenticação (`isAuth`) | `express-session` | Requisito (CRUD Protegido) |
| **Brute Force/DDoS** | Limitação de Taxa (Rate Limiting) | `express-rate-limit` | TAREFA 2 (Rota `/login`) |
| **Missing Security Headers** | Hardening de HTTP Headers | `helmet` | TAREFA 3A |
| **Sensitive Data Exposure** | Proteção de Credenciais | `dotenv` | TAREFA 3B (Chave Sessão/URI DB) |
| **Cross-Site Request Forgery (CSRF)** | Tokens Anti-CSRF | `csurf` | TAREFA 4 (Todas as rotas POST) |
| **Insecure Design (Senhas)** | Hashing de Senha | `bcrypt` (10 rounds) | `authController.js` |

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos

Certifique-se de ter instalado:
* [Node.js](https://nodejs.org/) (versão LTS)
* [MongoDB](https://www.mongodb.com/) (servidor rodando localmente ou conexão remota).

### Instalação e Configuração

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITÓRIO>
    cd <NOME_DO_PROJETO>
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```
    *Isso inclui `express`, `mongoose`, `helmet`, `csurf`, `express-rate-limit`, `dotenv`, `bcrypt` e `ejs`.*

3.  **Configuração de Credenciais (`.env`)**
    Crie um arquivo chamado `.env` na raiz do projeto (**e NUNCA o comite!**) para as variáveis de ambiente, conforme a **Tarefa 3B**.

    **.env (Exemplo)**
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/secure_crud_db # Sua string de conexão
    SESSION_SECRET="uma_chave_secreta_longa_e_aleatoria_para_sessao" 
    ```

4.  **Execute a Aplicação:**
    ```bash
    node server.js
    ```

5.  **Acesse:**
    Abra seu navegador e acesse: `http://localhost:3000`

---

## 📂 Estrutura de Arquivos

| Arquivo/Pasta | Função Principal e Defesas |
| :--- | :--- |
| `server.js` | Configuração central. Aplica todos os middlewares de segurança: `helmet`, `rateLimit`, `session`, `csurf` e `isAuth`. |
| `controllers/authController.js` | Lógica de autenticação (Login/Registro). Implementa **Bcrypt** para senhas e utiliza Mongoose (**SQLi Prevention**). |
| `controllers/userController.js` | Lógica de CRUD (Criar, Listar, Editar, Deletar). Utiliza Mongoose para todas as interações com o DB (**SQLi Prevention**). |
| `middleware/auth.js` | Contém o middleware `isAuth`, responsável pelo **Broken Access Control** nas rotas protegidas. |
| `models/User.js` | Schema Mongoose para o usuário. Define o campo `password` para o hash da senha. |
| `views/*.ejs` | Templates de interface. Contêm a integração do **Token Anti-CSRF** nos formulários POST (**TAREFA 4**) e previnem **XSS** com `<%= ... %>`. |

---
