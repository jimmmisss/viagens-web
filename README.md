# Viagens Frontend

Frontend para o sistema de gerenciamento de solicitações de viagens, desenvolvido com Vue.js 3, TypeScript e Vite.

## Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo com Composition API
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Build tool e dev server
- **Vue Router**: Roteamento para aplicações Vue.js
- **Pinia**: Gerenciamento de estado
- **Axios**: Cliente HTTP para requisições à API

## Funcionalidades

- Autenticação de usuários via JWT
- Registro de novos usuários
- Criação de solicitações de viagem
- Listagem e filtragem de viagens
- Visualização detalhada de viagens
- Aprovação de viagens (por gerentes)
- Cancelamento de viagens

## Estrutura do Projeto

```
viagens-frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── assets/          # Recursos (imagens, fontes, etc.)
│   ├── components/      # Componentes reutilizáveis
│   │   ├── auth/        # Componentes de autenticação
│   │   └── trips/       # Componentes de viagens
│   ├── router/          # Configuração de rotas
│   ├── services/        # Serviços para comunicação com a API
│   ├── stores/          # Stores Pinia para gerenciamento de estado
│   ├── types/           # Interfaces e tipos TypeScript
│   ├── views/           # Componentes de página
│   ├── App.vue          # Componente raiz
│   └── main.ts          # Ponto de entrada da aplicação
├── index.html           # Template HTML
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração TypeScript
└── vite.config.ts       # Configuração Vite
```

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- API de Viagens rodando em http://localhost:8080

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/viagens-frontend.git
cd viagens-frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:5173`

## Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos serão gerados no diretório `dist/`.

## Integração com o Backend

Este frontend foi desenvolvido para se comunicar com a API de Viagens. Certifique-se de que a API esteja rodando em `http://localhost:8080` ou ajuste a URL base no arquivo `src/services/api.ts`.

## Autenticação

A autenticação é feita via JWT (JSON Web Token). O token é armazenado no localStorage do navegador e enviado no cabeçalho Authorization de todas as requisições à API.

## Regras de Negócio

- Usuários devem se registrar com nome, email e senha
- Uma viagem possui destino, data de início e data de fim
- A data de fim deve ser posterior à data de início
- Uma viagem pode ter os status: solicitado, aprovado ou cancelado
- Apenas gerentes (não o solicitante) podem aprovar viagens
- Viagens aprovadas só podem ser canceladas pelo solicitante
- Viagens não podem ser canceladas se a data de início for em menos de 7 dias
