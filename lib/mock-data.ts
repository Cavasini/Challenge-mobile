import type { AnalyzeProfileResponse, RecommendationResponse, FixedIncomeItem, VariableIncomeItem } from "../api/investment-api"

// 📊 DADOS MOCKADOS PARA PERFIS DE INVESTIMENTO

export const MOCK_PROFILES = {
	conservador: {
		profileClassification: "Conservador",
		totalScore: 12,
		identifiedInterests: {
			liquidityNeeded: true,
			esgInterest: "medium",
			macroeconomicConcerns: ["inflação", "instabilidade política"],
			riskToleranceNotes: "Prefere segurança e estabilidade. Reage com cautela a volatilidade do mercado."
		}
	},
	moderado: {
		profileClassification: "Moderado", 
		totalScore: 22,
		identifiedInterests: {
			liquidityNeeded: false,
			esgInterest: "high",
			macroeconomicConcerns: ["cenário internacional"],
			riskToleranceNotes: "Busca equilibrio entre risco e retorno. Tolerância moderada a oscilações."
		}
	},
	sofisticado: {
		profileClassification: "Sofisticado",
		totalScore: 32,
		identifiedInterests: {
			liquidityNeeded: false,
			esgInterest: "low",
			macroeconomicConcerns: ["política monetária", "commodities"],
			riskToleranceNotes: "Alta tolerância ao risco. Vê volatilidade como oportunidade de ganhos."
		}
	}
} as const

// 💰 RECOMENDAÇÕES DE RENDA FIXA MOCKADAS
export const MOCK_FIXED_INCOME: FixedIncomeItem[] = [
	{
		name: "CDB Banco Safra",
		type: "Certificado de Depósito Bancário",
		indexerRate: 12.85,
		indexer: "CDI",
		isTaxExempt: false,
		dailyLiquidity: true,
		maturityDate: "2026-12-15",
		minimumInvestmentAmount: 1000,
		issuer: "Banco Safra S.A.",
		issuerRiskScore: 8,
		source: "Banco Safra"
	},
	{
		name: "LCI Habitação Itaú",
		type: "Letra de Crédito Imobiliário",
		indexerRate: 11.5,
		indexer: "CDI",
		isTaxExempt: true,
		dailyLiquidity: false,
		maturityDate: "2027-06-20",
		minimumInvestmentAmount: 5000,
		issuer: "Itaú Unibanco S.A.",
		issuerRiskScore: 9,
		source: "Itaú"
	},
	{
		name: "Tesouro Selic 2029",
		type: "Tesouro Direto",
		indexerRate: 13.25,
		indexer: "SELIC",
		isTaxExempt: false,
		dailyLiquidity: true,
		maturityDate: "2029-03-01",
		minimumInvestmentAmount: 100,
		issuer: "Tesouro Nacional",
		issuerRiskScore: 10,
		source: "Tesouro Direto"
	},
	{
		name: "CDB Banco Inter",
		type: "Certificado de Depósito Bancário",
		indexerRate: 13.1,
		indexer: "CDI",
		isTaxExempt: false,
		dailyLiquidity: true,
		maturityDate: "2025-12-31",
		minimumInvestmentAmount: 500,
		issuer: "Banco Inter S.A.",
		issuerRiskScore: 7,
		source: "Banco Inter"
	}
]

// 📈 RECOMENDAÇÕES DE RENDA VARIÁVEL MOCKADAS
export const MOCK_VARIABLE_INCOME: VariableIncomeItem[] = [
	{
		ticket: "VALE3",
		longName: "Vale S.A.",
		currency: "BRL",
		logoUrl: "",
		regularMarketPrice: 65.42,
		regularMarketChange: 1.23,
		regularMarketChancePercent: 1.92,
		score: 85
	},
	{
		ticket: "PETR4",
		longName: "Petróleo Brasileiro S.A.",
		currency: "BRL", 
		logoUrl: "",
		regularMarketPrice: 38.75,
		regularMarketChange: -0.45,
		regularMarketChancePercent: -1.15,
		score: 78
	},
	{
		ticket: "ITUB4",
		longName: "Itaú Unibanco Holding S.A.",
		currency: "BRL",
		logoUrl: "",
		regularMarketPrice: 32.18,
		regularMarketChange: 0.78,
		regularMarketChancePercent: 2.48,
		score: 82
	},
	{
		ticket: "BBDC4",
		longName: "Banco Bradesco S.A.",
		currency: "BRL",
		logoUrl: "",
		regularMarketPrice: 14.85,
		regularMarketChange: 0.12,
		regularMarketChancePercent: 0.81,
		score: 79
	},
	{
		ticket: "ABEV3",
		longName: "Ambev S.A.",
		currency: "BRL",
		logoUrl: "",
		regularMarketPrice: 12.34,
		regularMarketChange: -0.08,
		regularMarketChancePercent: -0.64,
		score: 76
	},
	{
		ticket: "WEGE3",
		longName: "WEG S.A.",
		currency: "BRL",
		logoUrl: "",
		regularMarketPrice: 45.67,
		regularMarketChange: 1.45,
		regularMarketChancePercent: 3.28,
		score: 88
	}
]

// 🎯 FUNÇÕES PARA GERAR RECOMENDAÇÕES BASEADAS NO PERFIL
export const generateMockRecommendations = (profile: string): RecommendationResponse => {
	const baseRecommendations = {
		FixedIncomesList: [...MOCK_FIXED_INCOME],
		VariableIncomesList: [...MOCK_VARIABLE_INCOME]
	}

	switch (profile.toLowerCase()) {
		case "conservador":
			// Conservador: Mais renda fixa, menos ações
			return {
				FixedIncomesList: baseRecommendations.FixedIncomesList.slice(0, 3),
				VariableIncomesList: baseRecommendations.VariableIncomesList.slice(0, 2)
			}
		
		case "moderado":
			// Moderado: Equilíbrio entre renda fixa e variável
			return {
				FixedIncomesList: baseRecommendations.FixedIncomesList.slice(0, 3),
				VariableIncomesList: baseRecommendations.VariableIncomesList.slice(0, 4)
			}
		
		case "sofisticado":
			// Sofisticado: Mais ações, menos renda fixa
			return {
				FixedIncomesList: baseRecommendations.FixedIncomesList.slice(0, 2),
				VariableIncomesList: baseRecommendations.VariableIncomesList
			}
		
		default:
			return baseRecommendations
	}
}

// 🧮 FUNÇÃO PARA CALCULAR PERFIL BASEADO NAS RESPOSTAS
export const calculateMockProfile = (
	answers: Record<string, string>, 
	monthlyValue: number
): AnalyzeProfileResponse => {
	// Pontuação baseada nas respostas (simulando algoritmo real)
	let totalScore = 0
	const identifiedInterests = {
		liquidityNeeded: false,
		esgInterest: "low",
		macroeconomicConcerns: [] as string[],
		riskToleranceNotes: ""
	}

	// Análise das respostas
	Object.entries(answers).forEach(([question, answer]) => {
		// Simulação de pontuação (a-e = 1-5 pontos)
		const points = answer.charCodeAt(0) - 96 // a=1, b=2, c=3, d=4, e=5
		totalScore += points

		// Detectar características especiais
		if (answer === "a" && question === "q2") {
			identifiedInterests.liquidityNeeded = true
		}
		if (answer === "d") {
			identifiedInterests.esgInterest = "high"
		}
		if (answer === "e") {
			identifiedInterests.macroeconomicConcerns.push("cenários macroeconômicos")
		}
	})

	// Determinar classificação baseada no score
	let profileClassification: string
	let riskNotes: string

	if (totalScore <= 15) {
		profileClassification = "Conservador"
		riskNotes = "Prefere segurança e baixa volatilidade. Foco na preservação do capital."
	} else if (totalScore <= 25) {
		profileClassification = "Moderado"
		riskNotes = "Busca equilibrio entre risco e retorno. Tolerância moderada a oscilações."
	} else {
		profileClassification = "Sofisticado"
		riskNotes = "Alta tolerância ao risco. Busca maximizar retornos com estratégias avançadas."
	}

	// Ajustar baseado no valor mensal
	if (monthlyValue >= 10000) {
		identifiedInterests.esgInterest = "high"
		identifiedInterests.macroeconomicConcerns.push("diversificação internacional")
	}

	identifiedInterests.riskToleranceNotes = riskNotes

	return {
		userId: `mock_${Date.now()}`,
		totalScore,
		profileClassification,
		identifiedInterests
	}
}