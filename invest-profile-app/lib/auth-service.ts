import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthResponse, AuthRequest, register as apiRegister, loginUser as apiLogin } from "../api/investment-api"

// Storage keys
const AUTH_TOKEN_KEY = "@invest_profile_token"
const USER_DATA_KEY = "@invest_profile_user"

// Types
export interface UserSession {
	token: string
	login: string
	loginTime: number
}

// Authentication service
export class AuthService {
	// Save user session to AsyncStorage
	static async saveSession(token: string, login: string): Promise<void> {
		try {
			const session: UserSession = {
				token,
				login,
				loginTime: Date.now(),
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
			const response: AuthResponse = await apiLogin(login, password)

			await this.saveSession(response.token, login)

			return {
				token: response.token,
				login,
				loginTime: Date.now(),
			}
		} catch (error) {
			console.error("Login error:", error)
			throw error
		}
	}

	// Register user
	static async register(login: string, password: string, role: "ADMIN" | "USER" = "USER"): Promise<UserSession> {
		try {
			const response: AuthResponse = await apiRegister(login, password, role)

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
}
