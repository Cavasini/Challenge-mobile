// Configuração centralizada do modo Mock vs API Real
export const AppConfig = {
	// 🔥 ALTERE AQUI PARA ALTERNAR ENTRE MOCK E API REAL
	USE_MOCK_DATA: true, // true = mock | false = APIs reais
	
	// Configurações de Mock
	MOCK_CONFIG: {
		// Simular delay das APIs (em ms)
		API_DELAY: 1500,
		
		// Usuários predefinidos para login mockado
		MOCK_USERS: [
			{
				login: "admin",
				password: "123456",
				name: "Administrador",
				userId: "user_001"
			},
			{
				login: "teste@teste.com",
				password: "teste123",
				name: "Usuário Teste",
				userId: "user_002"
			},
			{
				login: "demo",
				password: "demo",
				name: "Demo User",
				userId: "user_003"
			}
		],
		
		// Configurações de análise de perfil mockada
		PROFILE_ANALYSIS: {
			// Scores para classificação automática
			CONSERVATIVE_MAX_SCORE: 15,
			MODERATE_MAX_SCORE: 25,
			SOPHISTICATED_MIN_SCORE: 26,
			
			// Respostas que indicam características especiais
			ESG_INDICATORS: ["d"], // Resposta que indica interesse ESG
			LIQUIDITY_INDICATORS: ["a"], // Resposta que indica necessidade de liquidez
			MACRO_INDICATORS: ["e"] // Resposta que indica preocupações macroeconômicas
		}
	},
	
	// URLs das APIs reais (usadas quando USE_MOCK_DATA = false)
	API_CONFIG: {
		PROFILE_BASE_URL: "http://54.210.233.65:8080/api/v1",
		RECOMMENDER_BASE_URL: "http://54.210.233.65:8081/api/v1"
	}
}

// Helper para verificar se está em modo mock
export const isMockMode = () => AppConfig.USE_MOCK_DATA

// Helper para obter delay simulado
export const getMockDelay = () => AppConfig.MOCK_CONFIG.API_DELAY

// Helper para simular delay de API
export const simulateApiDelay = () => 
	new Promise(resolve => setTimeout(resolve, getMockDelay()))