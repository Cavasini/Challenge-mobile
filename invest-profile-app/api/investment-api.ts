// API Configuration
const API_BASE_URL_PROFILE = "http://98.81.224.104:8080/api/v1"
const API_BASE_URL_RECOMMENDER = "http://98.81.224.104:8081/api/v1"
const API_BASE_URL_AUTH = "http://98.81.224.104:8082/api/v1"

// Types and Interfaces
export interface AuthRequest {
	login: string
	password: string
	role?: "ADMIN" | "USER"
}

export interface AuthResponse {
	token: string
}

export interface AnalyzeProfileRequest {
	userId: string
	answers: Record<string, string>
	monthlyInvestmentValue: number
}

export interface AnalyzeProfileResponse {
	userId: string
	totalScore: number
	profileClassification: string
	identifiedInterests: {
		liquidityNeeded: boolean
		esgInterest: string
		macroeconomicConcerns: string[]
		riskToleranceNotes: string
	}
}

export interface FixedIncomeItem {
	name: string
	type: string
	indexerRate: number
	indexer: string
	isTaxExempt: boolean
	dailyLiquidity: boolean
	maturityDate: string
	minimumInvestmentAmount: number
	issuer: string
	issuerRiskScore: number
	source: string
}

export interface VariableIncomeItem {
	ticket: string
	longName: string | null
	currency: string
	logoUrl: string
	regularMarketPrice: number
	regularMarketChange: number
	regularMarketChancePercent: number
	score: number
}

export interface RecommendationResponse {
	FixedIncomesList: FixedIncomeItem[]
	VariableIncomesList: VariableIncomeItem[]
}

// Utility function for API requests
async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
	try {
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		})

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} - ${response.statusText}`)
		}

		return await response.json()
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Request failed: ${error.message}`)
		}
		throw new Error("Request failed: Unknown error")
	}
}

// Authentication API Functions
export async function register(
	login: string,
	password: string,
	role: "ADMIN" | "USER" = "USER"
): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(`${API_BASE_URL_AUTH}/auth/register`, {
		method: "POST",
		body: JSON.stringify({ login, password, role }),
	})
}

export async function loginUser(login: string, password: string): Promise<AuthResponse> {
	return apiRequest<AuthResponse>(`${API_BASE_URL_AUTH}/auth/login`, {
		method: "POST",
		body: JSON.stringify({ login, password }),
	})
}

// Profile Analysis API Functions
export async function analyzeProfile(data: AnalyzeProfileRequest): Promise<AnalyzeProfileResponse> {
	return apiRequest<AnalyzeProfileResponse>(`${API_BASE_URL_PROFILE}/profile/analyze`, {
		method: "POST",
		body: JSON.stringify(data),
	})
}

// Recommendations API Functions
export async function getRecommendations(profileData: AnalyzeProfileResponse): Promise<RecommendationResponse> {
	// Add timeout for long-running recommendations
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds

	try {
		const result = await apiRequest<RecommendationResponse>(`${API_BASE_URL_RECOMMENDER}/recommender`, {
			method: "POST",
			body: JSON.stringify(profileData),
			signal: controller.signal,
		})

		clearTimeout(timeoutId)
		return result
	} catch (error) {
		clearTimeout(timeoutId)

		if (error instanceof Error && error.name === "AbortError") {
			throw new Error("Request timeout: The recommendation service took too long to respond")
		}

		throw error
	}
}

// Helper function to generate user ID
export function generateUserId(): string {
	return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
