# 📋 API de Gerenciamento de Tarefas

## 📝 Descrição
API RESTful desenvolvida com NestJS para gerenciamento de tarefas com autenticação JWT. O sistema permite criar, listar, atualizar e deletar tarefas, além de contar com um sistema completo de autenticação de usuários.

## 🚀 Funcionalidades

### Autenticação
- [x] Geração de token JWT
- [x] Proteção de rotas com guard de autenticação

### Tarefas
- [x] Criar nova tarefa
- [x] Listar todas as tarefas
- [x] Buscar tarefa por ID
- [x] Atualizar tarefa existente
- [x] Remover tarefa
- [x] Filtrar tarefas por título e status

## 🛠️ Tecnologias Utilizadas
- [NestJS](https://nestjs.com/) - Framework Node.js para construção de aplicações escaláveis
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [JWT](https://jwt.io/) - JSON Web Token para autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Biblioteca para hash de senhas
- [uuid](https://www.npmjs.com/package/uuid) - Geração de IDs únicos
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) - Gerenciamento de configurações

## 📦 Pré-requisitos
- Node.js (18.12.0)
- npm ou yarn

## ⚙️ Instalação e Configuração

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd nome-do-projeto
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRATION_TIME=3600
```

4. Inicie o servidor:
```bash
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`

## 🔗 Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
  ```json
  {
    "username": "seu_usuario",
    "password": "sua_senha"
  }
  ```

### Usuários
- `POST /users` - Criar novo usuário
  ```json
  {
    "username": "novo_usuario",
    "password": "senha123"
  }
  ```

### Tarefas
- `GET /task` - Listar todas as tarefas
- `GET /task/:id` - Buscar tarefa por ID
- `POST /task` - Criar nova tarefa
  ```json
  {
    "title": "Nova Tarefa",
    "description": "Descrição da tarefa",
    "status": "pendente",
    "expirationDate": "2024-12-31T23:59:59"
  }
  ```
- `PUT /task` - Atualizar tarefa
- `DELETE /task/:id` - Remover tarefa

## 🔒 Autenticação

Para acessar as rotas protegidas, é necessário incluir o token JWT no header da requisição:
```
Authorization: Bearer seu_token_jwt
```

## 🧪 Testes
Para executar os testes:
```bash
# Testes unitários
npm test

ou

npm test nomedaclasse.spec.ts
```

