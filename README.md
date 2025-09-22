# 📈 Invest Profile - Perfil de Investidor Mobile

> **Aplicativo React Native para análise de perfil de investidor e recomendações personalizadas**

[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## 🎯 Sobre o Projeto

O **Invest Profile** é um aplicativo mobile desenvolvido em React Native que permite aos usuários descobrirem seu perfil de investidor através de um questionário personalizado e receberem recomendações de investimentos baseadas em suas preferências, tolerância ao risco e objetivos financeiros.

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação Completo**
    - Login e registro de usuários
    - Persistência de sessão com AsyncStorage
    - Logout com limpeza de dados

- 📋 **Questionário Inteligente**
    - 8 perguntas sobre perfil de investidor
    - Análise de tolerância ao risco
    - Detecção de interesses ESG
    - Análise de necessidade de liquidez
    - Configuração de valor mensal para investimento

- 📊 **Análise de Perfil**
    - Classificação automática (Conservador, Moderado, Sofisticado)
    - Score de risco personalizado
    - Recomendações baseadas em IA
    - Interface visual com ícones e cores por perfil

- 💼 **Recomendações de Investimentos**
    - **Renda Fixa**: CDBs, LCIs, Tesouro Direto
    - **Renda Variável**: Ações recomendadas
    - Dados em tempo real via API
    - Informações detalhadas de cada investimento

## 🏗️ Arquitetura do Projeto

```
invest-profile/
├── 📱 app/                    # Telas e navegação (Expo Router)
│   ├── (auth)/               # Fluxo de autenticação
│   │   ├── login.tsx         # Tela de login
│   │   └── register.tsx      # Tela de registro
│   ├── (tabs)/               # Navegação por abas
│   │   ├── home.tsx          # Tela inicial
│   │   ├── profile.tsx       # Perfil do usuário
│   │   └── recommendations.tsx # Recomendações
│   ├── _layout.tsx           # Layout principal
│   ├── index.tsx             # Tela de boas-vindas
│   └── questionnaire.tsx     # Questionário de perfil
├── 🔧 api/                   # Integrações externas
│   └── investment-api.ts     # API de investimentos
├── 📚 lib/                   # Serviços e utilitários
│   ├── auth-service.ts       # Serviços de autenticação
│   ├── profile-service.ts    # Gerenciamento de perfil
│   ├── theme.ts              # Configurações de tema
│   └── utils.ts              # Utilitários gerais
├── 🎨 components/            # Componentes reutilizáveis
│   └── ui/                   # Componentes de interface
└── 📱 assets/                # Recursos estáticos
```

## 🔄 Integração com APIs

### 🌐 Endpoints Utilizados

O aplicativo se integra com duas APIs principais hospedadas na AWS:

#### 1. **API de Análise de Perfil**

- **Base URL**: `http://54.210.233.65:8080/api/v1`
- **Endpoint**: `POST /profile/analyze`
- **Função**: Analisa respostas do questionário e retorna classificação do perfil

```typescript
interface AnalyzeProfileRequest {
	userId: string
	answers: Record<string, string> // {q1: "a", q2: "b", ...}
	monthlyInvestmentValue: number
}

interface AnalyzeProfileResponse {
	userId: string
	totalScore: number
	profileClassification: "Conservador" | "Moderado" | "Sofisticado"
	identifiedInterests: {
		liquidityNeeded: boolean
		esgInterest: string
		macroeconomicConcerns: string[]
		riskToleranceNotes: string
	}
}
```

#### 2. **API de Recomendações**

- **Base URL**: `http://54.210.233.65:8081/api/v1`
- **Endpoint**: `POST /recommendations`
- **Função**: Retorna investimentos recomendados baseados no perfil

```typescript
interface RecommendationResponse {
	FixedIncomesList: FixedIncomeItem[] // Renda Fixa
	VariableIncomesList: VariableIncomeItem[] // Ações
}
```

### 🔄 Fluxo de Dados

1. **Questionário** → Coleta respostas e valor mensal
2. **Análise** → Envia dados para API de perfil
3. **Classificação** → Recebe perfil e características
4. **Recomendações** → Solicita investimentos baseados no perfil
5. **Persistência** → Salva dados localmente (AsyncStorage)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/your-username/invest-profile-app.git
cd invest-profile-app

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

### 📱 Executando no Dispositivo

```bash
# Android
npm run android

# iOS (Mac apenas)
npm run ios

# Web
npm run web
```

Ou escaneie o QR code com o [Expo Go](https://expo.dev/go) no seu dispositivo.

## 🛠️ Stack Tecnológica

### Core

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos

### UI/UX

- **NativeWind** - Tailwind CSS para React Native
- **React Native Reusables** - Componentes UI
- **Lucide React Native** - Ícones
- **Class Variance Authority** - Variantes de componentes

### Estado e Persistência

- **AsyncStorage** - Armazenamento local
- **Context API** - Gerenciamento de estado
- **Custom Services** - Camada de serviços

### Desenvolvimento

- **ESLint + Prettier** - Linting e formatação
- **Metro** - Bundler React Native

## 📋 Funcionalidades Detalhadas

### 🔐 Autenticação

- **Login/Registro**: Interface intuitiva com validação
- **Persistência**: Sessão mantida entre execuções
- **Segurança**: Tokens salvos localmente de forma segura

### 📝 Questionário de Perfil

- **8 Perguntas Estratégicas**:
    1. Objetivo principal de investimento
    2. Necessidade de liquidez
    3. Reação a perdas no mercado
    4. Interesse em ESG
    5. Conhecimento sobre investimentos
    6. Horizonte de investimento
    7. Situação financeira
    8. Valor mensal para investir

### 📊 Análise de Perfil

- **Classificação Automática**:
    - 🛡️ **Conservador**: Foco em segurança e preservação
    - ⚖️ **Moderado**: Equilíbrio entre risco e retorno
    - 🎯 **Sofisticado**: Alta tolerância ao risco

### 💰 Recomendações

- **Renda Fixa**: CDBs, LCIs, Tesouro com taxas atualizadas
- **Renda Variável**: Ações com preços em tempo real
- **Detalhes Completos**: Vencimento, liquidez, risco, etc.

## 🔧 Serviços Principais

### AuthService (`lib/auth-service.ts`)

```typescript
class AuthService {
	static async login(login: string, password: string)
	static async register(login: string, password: string)
	static async logout()
	static async getCurrentSession()
}
```

### ProfileService (`lib/profile-service.ts`)

```typescript
class ProfileService {
	static async saveQuestionnaireData(data: QuestionnaireData)
	static async analyzeProfile(data: QuestionnaireData)
	static async getRecommendations(userId: string)
	static async getStoredData()
}
```

## 👨‍💻 Autores

- Julia Amorim - RM99609
- Lana Leite - RM551143
- Matheus Cavasini - RM97722
***
