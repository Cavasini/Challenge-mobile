import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthResponse, AuthRequest, register as apiRegister, loginUser as apiLogin } from "../api/investment-api"
import { AppConfig, isMockMode, simulateApiDelay } from "./app-config"

// Storage keys
const AUTH_TOKEN_KEY = "@invest_profile_token"
const USER_DATA_KEY = "@invest_profile_user"

// Types
export interface UserSession {
	token: string
	login: string
	loginTime: number
	userId?: string
	name?: string
}

// 🎭 MOCK AUTH FUNCTIONS
const mockLogin = async (login: string, password: string): Promise<AuthResponse> => {
	// Simular delay da API
	await simulateApiDelay()
	
	// Verificar usuários mockados
	const mockUser = AppConfig.MOCK_CONFIG.MOCK_USERS.find(
		user => user.login === login && user.password === password
	)
	
	if (!mockUser) {
		throw new Error("Credenciais inválidas")
	}
	
	return {
		token: `mock_token_${mockUser.userId}_${Date.now()}`
	}
}

const mockRegister = async (login: string, password: string): Promise<AuthResponse> => {
	// Simular delay da API
	await simulateApiDelay()
	
	// Verificar se usuário já existe
	const existingUser = AppConfig.MOCK_CONFIG.MOCK_USERS.find(user => user.login === login)
	if (existingUser) {
		throw new Error("Usuário já existe")
	}
	
	// Simular criação de novo usuário
	const newUserId = `mock_user_${Date.now()}`
	return {
		token: `mock_token_${newUserId}_${Date.now()}`
	}
}

// Authentication service
export class AuthService {
	// Save user session to AsyncStorage
	static async saveSession(token: string, login: string, userId?: string, name?: string): Promise<void> {
		try {
			const session: UserSession = {
				token,
				login,
				loginTime: Date.now(),
				userId,
				name
			}

			await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
			await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(session))
		} catch (error) {
			console.error("Error saving session:", error)
			throw new Error("Failed to save session")
		}
	}

	// Get current session from AsyncStorage
	static async getSession(): Promise<UserSession | null> {
		try {
			const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY)
			const userData = await AsyncStorage.getItem(USER_DATA_KEY)

			if (!token || !userData) {
				return null
			}

			return JSON.parse(userData)
		} catch (error) {
			console.error("Error getting session:", error)
			return null
		}
	}

	// Check if user is authenticated
	static async isAuthenticated(): Promise<boolean> {
		const session = await this.getSession()
		return session !== null
	}

	// Get current token
	static async getToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
		} catch (error) {
			console.error("Error getting token:", error)
			return null
		}
	}

	// Clear session (logout)
	static async clearSession(): Promise<void> {
		try {
			await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
			await AsyncStorage.removeItem(USER_DATA_KEY)
		} catch (error) {
			console.error("Error clearing session:", error)
			throw new Error("Failed to clear session")
		}
	}

	// Login user
	static async login(login: string, password: string): Promise<UserSession> {
		try {
			let response: AuthResponse
			let userData: any = null

			if (isMockMode()) {
				// Usar autenticação mockada
				response = await mockLogin(login, password)
				// Obter dados extras do usuário mockado
				userData = AppConfig.MOCK_CONFIG.MOCK_USERS.find(user => user.login === login)
			} else {
				// Usar API real
				response = await apiLogin(login, password)
			}

			// Salvar sessão com dados extras se disponível
			await this.saveSession(
				response.token, 
				login, 
				userData?.userId, 
				userData?.name
			)

			return {
				token: response.token,
				login,
				loginTime: Date.now(),
				userId: userData?.userId,
				name: userData?.name
			}
		} catch (error) {
			console.error("Login error:", error)
			throw error
		}
	}

	// Register user
	static async register(login: string, password: string, role: "ADMIN" | "USER" = "USER"): Promise<UserSession> {
		try {
			let response: AuthResponse

			if (isMockMode()) {
				// Usar registro mockado
				response = await mockRegister(login, password)
			} else {
				// Usar API real
				response = await apiRegister(login, password, role)
			}

			await this.saveSession(response.token, login)

			return {
				token: response.token,
				login,
				loginTime: Date.now(),
			}
		} catch (error) {
			console.error("Register error:", error)
			throw error
		}
	}

	// Logout user
	static async logout(): Promise<void> {
		await this.clearSession()
	}

	// 🎭 MÉTODOS MOCK DIRETOS (para testes)
	static async mockLogin(login: string, password: string): Promise<UserSession> {
		const response = await mockLogin(login, password)
		const userData = AppConfig.MOCK_CONFIG.MOCK_USERS.find(user => user.login === login)
		
		await this.saveSession(
			response.token, 
			login, 
			userData?.userId, 
			userData?.name
		)

		return {
			token: response.token,
			login,
			loginTime: Date.now(),
			userId: userData?.userId,
			name: userData?.name
		}
	}

	static async mockRegister(login: string, password: string): Promise<UserSession> {
		const response = await mockRegister(login, password)
		
		await this.saveSession(response.token, login)

		return {
			token: response.token,
			login,
			loginTime: Date.now(),
		}
	}
}