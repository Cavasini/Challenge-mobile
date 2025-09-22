import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	analyzeProfile,
	getRecommendations,
	type AnalyzeProfileResponse,
	type RecommendationResponse,
} from "../api/investment-api";
import { isMockMode, simulateApiDelay } from "./app-config";
import { calculateMockProfile, generateMockRecommendations } from "./mock-data";

// Keys para AsyncStorage
const QUESTIONNAIRE_DATA_KEY = "@questionnaire_data";
const PROFILE_ANALYSIS_KEY = "@profile_analysis";
const RECOMMENDATIONS_KEY = "@recommendations";
const USER_FLOW_STATE_KEY = "@user_flow_state"; // Para controlar progresso do usuário

// Interface para dados do questionário (seguindo padrão do Next.js)
export interface QuestionnaireData {
	userId: string;
	answers: Record<string, string>;
	monthlyInvestmentValue: number;
	completedAt: number; // timestamp
}

// Interface para análise do perfil (adaptada da API)
export interface ProfileAnalysis extends AnalyzeProfileResponse {
	analyzedAt: number; // timestamp
}

// Interface para recomendações (adaptada da API)
export interface RecommendationData extends RecommendationResponse {
	loadedAt: number; // timestamp
}

// Interface para controle de estado do fluxo do usuário
export interface UserFlowState {
	hasCompletedQuestionnaire: boolean;
	hasAnalyzedProfile: boolean;
	hasLoadedRecommendations: boolean;
	lastUpdated: number;
}

export class ProfileService {
	// 🎛️ CONTROLE DE FLUXO DO USUÁRIO
	
	// Obter estado atual do fluxo
	static async getUserFlowState(): Promise<UserFlowState> {
		try {
			const data = await AsyncStorage.getItem(USER_FLOW_STATE_KEY);
			return data ? JSON.parse(data) : {
				hasCompletedQuestionnaire: false,
				hasAnalyzedProfile: false,
				hasLoadedRecommendations: false,
				lastUpdated: Date.now()
			};
		} catch (error) {
			console.error("Error getting user flow state:", error);
			return {
				hasCompletedQuestionnaire: false,
				hasAnalyzedProfile: false,
				hasLoadedRecommendations: false,
				lastUpdated: Date.now()
			};
		}
	}

	// Atualizar estado do fluxo
	static async updateUserFlowState(updates: Partial<Omit<UserFlowState, "lastUpdated">>): Promise<void> {
		try {
			const currentState = await this.getUserFlowState();
			const newState: UserFlowState = {
				...currentState,
				...updates,
				lastUpdated: Date.now()
			};
			await AsyncStorage.setItem(USER_FLOW_STATE_KEY, JSON.stringify(newState));
		} catch (error) {
			console.error("Error updating user flow state:", error);
		}
	}

	// Resetar todo o progresso do usuário
	static async resetUserProgress(): Promise<void> {
		try {
			await AsyncStorage.removeItem(QUESTIONNAIRE_DATA_KEY);
			await AsyncStorage.removeItem(PROFILE_ANALYSIS_KEY);
			await AsyncStorage.removeItem(RECOMMENDATIONS_KEY);
			await AsyncStorage.removeItem(USER_FLOW_STATE_KEY);
		} catch (error) {
			console.error("Error resetting user progress:", error);
		}
	}

	// 📋 QUESTIONÁRIO

	// Salvar dados do questionário
	static async saveQuestionnaireData(data: Omit<QuestionnaireData, "completedAt">): Promise<void> {
		try {
			const questionnaireData: QuestionnaireData = {
				...data,
				completedAt: Date.now(),
			};

			await AsyncStorage.setItem(QUESTIONNAIRE_DATA_KEY, JSON.stringify(questionnaireData));
			
			// Atualizar estado do fluxo
			await this.updateUserFlowState({ hasCompletedQuestionnaire: true });
			
		} catch (error) {
			console.error("Error saving questionnaire data:", error);
			throw new Error("Failed to save questionnaire data");
		}
	}

	// Obter dados do questionário
	static async getQuestionnaireData(): Promise<QuestionnaireData | null> {
		try {
			const data = await AsyncStorage.getItem(QUESTIONNAIRE_DATA_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting questionnaire data:", error);
			return null;
		}
	}

	// Verificar se questionário foi completado
	static async isQuestionnaireCompleted(): Promise<boolean> {
		const flowState = await this.getUserFlowState();
		return flowState.hasCompletedQuestionnaire;
	}

	// 📊 ANÁLISE DE PERFIL

	// Analisar perfil (chamar API e salvar resultado)
	static async analyzeUserProfile(): Promise<ProfileAnalysis> {
		try {
			const questionnaireData = await this.getQuestionnaireData();

			if (!questionnaireData) {
				throw new Error("Questionário não encontrado. Complete o questionário primeiro.");
			}

			let analysisResult: AnalyzeProfileResponse;

			if (isMockMode()) {
				// Usar análise mockada
				console.log("🎭 Usando análise de perfil MOCKADA");
				await simulateApiDelay();
				analysisResult = calculateMockProfile(
					questionnaireData.answers,
					questionnaireData.monthlyInvestmentValue
				);
			} else {
				// Usar API real
				console.log("🌐 Usando API real para análise de perfil");
				const analyzeRequest = {
					userId: questionnaireData.userId,
					answers: questionnaireData.answers,
					monthlyInvestmentValue: questionnaireData.monthlyInvestmentValue,
				};
				analysisResult = await analyzeProfile(analyzeRequest);
			}

			const profileAnalysis: ProfileAnalysis = {
				...analysisResult,
				analyzedAt: Date.now(),
			};

			// Salvar resultado
			await AsyncStorage.setItem(PROFILE_ANALYSIS_KEY, JSON.stringify(profileAnalysis));
			
			// Atualizar estado do fluxo
			await this.updateUserFlowState({ hasAnalyzedProfile: true });

			return profileAnalysis;
		} catch (error) {
			console.error("Error analyzing profile:", error);
			throw error;
		}
	}

	// Obter análise do perfil
	static async getProfileAnalysis(): Promise<ProfileAnalysis | null> {
		try {
			const data = await AsyncStorage.getItem(PROFILE_ANALYSIS_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting profile analysis:", error);
			return null;
		}
	}

	// Verificar se perfil foi analisado
	static async isProfileAnalyzed(): Promise<boolean> {
		const flowState = await this.getUserFlowState();
		return flowState.hasAnalyzedProfile;
	}

	// 💼 RECOMENDAÇÕES

	// Carregar recomendações
	static async loadRecommendations(): Promise<RecommendationData> {
		try {
			const profileAnalysis = await this.getProfileAnalysis();

			if (!profileAnalysis) {
				throw new Error("Perfil não analisado. Analise o perfil primeiro.");
			}

			let recommendationsResult: RecommendationResponse;

			if (isMockMode()) {
				// Usar recomendações mockadas baseadas no perfil
				console.log("🎭 Usando recomendações MOCKADAS");
				await simulateApiDelay();
				recommendationsResult = generateMockRecommendations(profileAnalysis.profileClassification);
			} else {
				// Usar API real
				console.log("🌐 Usando API real para recomendações");
				recommendationsResult = await getRecommendations(profileAnalysis);
			}

			const recommendationData: RecommendationData = {
				...recommendationsResult,
				loadedAt: Date.now(),
			};

			// Salvar resultado
			await AsyncStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(recommendationData));
			
			// Atualizar estado do fluxo
			await this.updateUserFlowState({ hasLoadedRecommendations: true });

			return recommendationData;
		} catch (error) {
			console.error("Error loading recommendations:", error);
			throw error;
		}
	}

	// Obter recomendações salvas
	static async getRecommendations(): Promise<RecommendationData | null> {
		try {
			const data = await AsyncStorage.getItem(RECOMMENDATIONS_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting recommendations:", error);
			return null;
		}
	}

	// Verificar se recomendações foram carregadas
	static async areRecommendationsLoaded(): Promise<boolean> {
		const flowState = await this.getUserFlowState();
		return flowState.hasLoadedRecommendations;
	}

	// 🔧 UTILITÁRIOS

	// Obter todos os dados armazenados (para debug/overview)
	static async getAllStoredData() {
		return {
			flowState: await this.getUserFlowState(),
			questionnaire: await this.getQuestionnaireData(),
			profile: await this.getProfileAnalysis(),
			recommendations: await this.getRecommendations(),
		};
	}

	// Verificar se usuário pode acessar tela de perfil
	static async canAccessProfile(): Promise<boolean> {
		return await this.isQuestionnaireCompleted();
	}

	// Verificar se usuário pode acessar tela de recomendações
	static async canAccessRecommendations(): Promise<boolean> {
		const flowState = await this.getUserFlowState();
		return flowState.hasCompletedQuestionnaire && flowState.hasAnalyzedProfile;
	}

	// Obter próximo passo no fluxo
	static async getNextStep(): Promise<"questionnaire" | "profile_analysis" | "recommendations" | "completed"> {
		const flowState = await this.getUserFlowState();
		
		if (!flowState.hasCompletedQuestionnaire) {
			return "questionnaire";
		}
		
		if (!flowState.hasAnalyzedProfile) {
			return "profile_analysis";
		}
		
		if (!flowState.hasLoadedRecommendations) {
			return "recommendations";
		}
		
		return "completed";
	}

	// 🔧 MÉTODOS PARA COMPATIBILIDADE COM TELAS EXISTENTES

	// Método para verificar status do perfil (compatibilidade com profile.tsx)
	static async getProfileStatus(): Promise<{ hasAnalysis: boolean; hasQuestionnaire: boolean }> {
		const flowState = await this.getUserFlowState();
		return {
			hasAnalysis: flowState.hasAnalyzedProfile,
			hasQuestionnaire: flowState.hasCompletedQuestionnaire
		};
	}

	// Método para limpar todos os dados (compatibilidade com logout)
	static async clearAllData(): Promise<void> {
		return await this.resetUserProgress();
	}

	// Método para verificar se tem recomendações (compatibilidade com recommendations.tsx)
	static async hasRecommendations(): Promise<boolean> {
		return await this.areRecommendationsLoaded();
	}
}