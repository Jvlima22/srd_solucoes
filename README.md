# 🚛 SRD Soluções - App de Logística

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Aplicativo móvel para gestão logística completa, desenvolvido com React Native e Expo

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **SRD Soluções** é um aplicativo móvel desenvolvido para otimizar e automatizar processos logísticos. A aplicação oferece uma solução completa para gestão de:

- **Manifestos** - Controle e acompanhamento de documentos de transporte
- **Entregas** - Rastreamento e gestão de entregas em tempo real
- **Coletas** - Organização e controle de coletas
- **Despachos** - Gerenciamento de despachos
- **Retiradas** - Controle de retiradas
- **Transferências** - Acompanhamento de transferências

### 🚀 Principais Benefícios

- **Rastreamento Inteligente**: Acompanhe entregas, coletas e transferências em tempo real
- **Gestão Simplificada**: Organize e controle documentos de transporte facilmente
- **Consulta Rápida**: Encontre informações sobre manifestos, despachos e retiradas em segundos
- **Tecnologia Avançada**: Automação e eficiência no gerenciamento de dados

## ✨ Funcionalidades

### 🔐 Autenticação

- Login seguro com validação de unidades
- Sistema de autenticação persistente
- Logout com confirmação

### 📋 Gestão de Manifestos

- Listagem de manifestos
- Busca por número de manifesto
- Inicialização de transporte
- Controle de status (EM TRÂNSITO, PENDENTE)

### 🚚 Gestão de Entregas

- Listagem de entregas por manifesto
- Detalhes completos de cada entrega
- Lançamento de ocorrências
- Upload de arquivos
- Exclusão de ocorrências

### 📦 Gestão de Coletas

- Controle de coletas
- Registro de ocorrências
- Detalhamento de informações
- Gestão de documentos

### 📤 Gestão de Despachos

- Controle de despachos
- Lançamento de ocorrências
- Detalhes de minutas
- Gestão de fretes

### 📥 Gestão de Retiradas

- Controle de retiradas
- Registro de ocorrências
- Detalhamento de romaneios
- Gestão de documentos

### 🔄 Gestão de Transferências

- Controle de transferências
- Lançamento de ocorrências
- Detalhes de fretes
- Gestão de documentos

## 🛠 Tecnologias

### Frontend

- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma de desenvolvimento
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação tipada
- **[NativeWind](https://nativewind.dev/)** - Tailwind CSS para React Native
- **[React Navigation](https://reactnavigation.org/)** - Navegação entre telas

### UI/UX

- **[Lucide React Native](https://lucide.dev/)** - Ícones
- **[@gorhom/bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet/)** - Bottom sheets
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Animações
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Gestos

### Estado e Dados

- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)** - Armazenamento local
- **[React Context](https://react.dev/reference/react/createContext)** - Gerenciamento de estado

### Desenvolvimento

- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Babel](https://babeljs.io/)** - Transpilador

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[npm](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**
- **[Expo CLI](https://docs.expo.dev/get-started/installation/)**
- **[Git](https://git-scm.com/)**

### Para desenvolvimento mobile:

- **[Android Studio](https://developer.android.com/studio)** (para Android)
- **[Xcode](https://developer.apple.com/xcode/)** (para iOS - apenas macOS)

## 🚀 Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/Jvlima22/srd_solucoes.git
   cd srd-solucoes
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o projeto**
   ```bash
   npm start
   # ou
   yarn start
   ```

## ⚙️ Configuração

### Configuração da API

O projeto está configurado para usar diferentes URLs de API baseado no ambiente:

- **Desenvolvimento**: `http://192.168.15.25:3000`
- **Produção**: `https://srd-solucoes.vercel.app`

Para alternar entre ambientes, edite o arquivo `src/config/api.ts`:

```typescript
// Para usar a API de produção (Vercel)
return API_CONFIG.PRODUCTION;

// Para usar a API de desenvolvimento (local)
// return API_CONFIG.DEVELOPMENT;
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se necessário):

```env
# API Configuration
API_BASE_URL=https://srd-solucoes.vercel.app
```

## 📱 Uso

### Executando o Projeto

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na web
npm run web
```

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
npm run lint       # Executa o linter
```

## 📁 Estrutura do Projeto

```
src/
├── @types/                    # Definições de tipos TypeScript
├── assets/                    # Imagens e recursos estáticos
├── components/                # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── ContainerX.tsx
│   ├── InputField.tsx
│   └── ...
├── config/                    # Configurações da aplicação
│   └── api.ts                 # Configuração da API
├── contexts/                  # Contextos React
│   └── AuthContext.tsx
├── hooks/                     # Hooks customizados
│   └── useAuth.tsx
├── lib/                       # Utilitários e helpers
│   └── utils.ts
├── routes/                    # Configuração de rotas
│   ├── App.routes.tsx
│   ├── Auth.routes.tsx
│   └── index.tsx
├── screens/                   # Telas da aplicação
│   ├── App/                   # Telas autenticadas
│   │   ├── collectionScreen.tsx
│   │   ├── deliveryScreen.tsx
│   │   ├── dispatchScreen.tsx
│   │   ├── manifestScreen.tsx
│   │   ├── transferScreen.tsx
│   │   └── withDrawalScreen.tsx
│   ├── Auth/                  # Telas de autenticação
│   │   ├── signInScreen.tsx
│   │   └── startupScreen.tsx
│   └── splashScreen.tsx
├── service/                   # Serviços e API
│   ├── api.ts
│   └── services.ts
├── styles/                    # Estilos globais
│   ├── colors.ts
│   ├── global.css
│   └── spacings.ts
└── __MOCK__/                  # Dados mock para desenvolvimento
```

## 🔌 API

### Endpoints Principais

- `POST /login` - Autenticação
- `GET /unidades` - Lista de unidades
- `GET /manifestos` - Lista de manifestos
- `GET /info-entrega/{manifestoId}` - Informações de entrega
- `GET /info-coleta/{manifestoId}` - Informações de coleta
- `GET /info-despacho/{manifestoId}` - Informações de despacho
- `GET /info-retirada/{manifestoId}` - Informações de retirada
- `GET /info-transferencia/{manifestoId}` - Informações de transferência

### Configuração da API

A API está hospedada na Vercel e pode ser acessada em:

```
https://srd-solucoes.vercel.app
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todo o código
- Siga as convenções do ESLint e Prettier
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [targetlogsolutions@outlook.com](mailto:targetlogsolutions@outlook.com) ou abra uma issue no GitHub.

## 🙏 Agradecimentos

- [Expo](https://expo.dev/) pela plataforma de desenvolvimento
- [React Native](https://reactnative.dev/) pela framework
- [Vercel](https://vercel.com/) pelo hosting da API
- [Tailwind CSS](https://tailwindcss.com/) pelos estilos

---

**Desenvolvido com ❤️ pela equipe [TGL Solutions](https://tglsolutions.com.br)**
