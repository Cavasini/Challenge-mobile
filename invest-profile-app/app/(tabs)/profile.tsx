import { View, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native"
import React, { useState, useEffect } from "react"
import { router } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Droplets, ArrowRight, User, TrendingUp, LogOut, PieChart, Target } from "lucide-react-native"
import { AuthService } from "@/lib/auth-service"
import { ProfileService, type ProfileAnalysis, type QuestionnaireData } from "@/lib/profile-service"

// Helper functions (seguindo padrão do Next.js)
const getProfileIcon = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return {
				icon: Shield,
				color: "#10B981",
				bgColor: "bg-emerald-500/10",
				borderColor: "border-emerald-500/20",
			}
		case "moderado":
			return {
				icon: PieChart,
				color: "#F59E0B",
				bgColor: "bg-amber-500/10",
				borderColor: "border-amber-500/20",
			}
		case "sofisticado":
			return {
				icon: Target,
				color: "#EF4444",
				bgColor: "bg-red-500/10",
				borderColor: "border-red-500/20",
			}
		default:
			return {
				icon: PieChart,
				color: "#6B7280",
				bgColor: "bg-gray-500/10",
				borderColor: "border-gray-500/20",
			}
	}
}

const getRiskLevel = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return 1
		case "moderado":
			return 2
		case "sofisticado":
			return 3
		default:
			return 2
	}
}

const getProfileDescription = (classification: string) => {
	switch (classification.toLowerCase()) {
		case "conservador":
			return "Você prioriza a segurança do seu capital e prefere investimentos com menor volatilidade. Seu foco está na preservação do patrimônio com rentabilidade consistente."
		case "moderado":
			return "Você busca equilibrar segurança e crescimento, aceitando oscilações moderadas em busca de melhores retornos no médio a longo prazo."
		case "sofisticado":
			return "Você possui alta tolerância ao risco e conhecimento avançado do mercado. Busca maximizar retornos através de estratégias complexas e está confortável com alta volatilidade."
		default:
			return "Perfil de investimento baseado em suas respostas ao questionário."
	}
}

export default function Profile() {
	const [hasProfile, setHasProfile] = useState(false)
	const [loading, setLoading] = useState(true)
	const [profileData, setProfileData] = useState<ProfileAnalysis | null>(null)
	const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)

	useEffect(() => {
		checkProfileStatus()
	}, [])

	const checkProfileStatus = async () => {
		try {
			const status = await ProfileService.getProfileStatus()
			setHasProfile(status.hasAnalysis)

			if (status.hasAnalysis) {
				const profile = await ProfileService.getProfileAnalysis()
				const questionnaire = await ProfileService.getQuestionnaireData()

				setProfileData(profile)
				setQuestionnaireData(questionnaire)
			}
		} catch (error) {
			console.error("Error checking profile status:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = () => {
		Alert.alert("Sair da conta", "Tem certeza que deseja sair da sua conta?", [
			{
				text: "Cancelar",
				style: "cancel",
			},
			{
				text: "Sair",
				style: "destructive",
				onPress: async () => {
					try {
						await AuthService.logout()
						await ProfileService.clearAllData() // Limpar dados do perfil também
						router.replace("/")
					} catch (error) {
						Alert.alert("Erro", "Não foi possível sair da conta. Tente novamente.")
					}
				},
			},
		])
	}

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-background">
				<ActivityIndicator
					size="large"
					color="#3B82F6"
				/>
				<Text className="text-gray-400 mt-4">Carregando perfil...</Text>
			</View>
		)
	}

	return (
		<ScrollView className="flex-1 bg-background pt-20">
			<View className="px-4">
				{/* Header */}
				<Text className="text-gray-400 text-base mb-6">
					{hasProfile
						? "Seu perfil personalizado de investimento"
						: "Descubra seu perfil de investidor e tenha acesso à análise personalizada"}
				</Text>

				{!hasProfile ? (
					<>
						{/* Main Card - Perfil */}
						<Card className="bg-gray-900/50 border-gray-800">
							<CardHeader className="items-center">
								<View className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
									<User
										size={32}
										color="#10B981"
									/>
								</View>
								<CardTitle className="text-xl text-white text-center mb-3">
									Perfil de Investidor
								</CardTitle>
								<CardDescription className="text-gray-300 text-center leading-relaxed px-2">
									Complete o questionário para descobrir seu perfil de investidor e acessar análises
									personalizadas sobre sua tolerância ao risco e objetivos.
								</CardDescription>
							</CardHeader>

							<CardContent>
								<Button
									size="lg"
									className="w-full mb-4"
									onPress={() => router.push("/questionnaire")}
								>
									<Text className="text-white font-medium mr-2">Fazer Questionário</Text>
									<ArrowRight
										size={20}
										color="#FFFFFF"
									/>
								</Button>
							</CardContent>
						</Card>
					</>
				) : (
					<>
						{/* Profile Card */}
						{profileData && (
							<Card className="mb-6 bg-gray-900/50 border-gray-800">
								<CardHeader className="items-start flex-row">
									{/* Icon */}
									<View className={`p-3 rounded-2xl ${getProfileIcon(profileData.profileClassification).bgColor} border ${getProfileIcon(profileData.profileClassification).borderColor}`}>
										{React.createElement(
											getProfileIcon(profileData.profileClassification).icon,
											{
												size: 28,
												color: getProfileIcon(profileData.profileClassification).color,
											}
										)}
									</View>
									<View className="flex-1 gap-2 ml-3">
										{/* Title and Description */}
										<CardTitle className="text-xl text-white text-left">
											{profileData.profileClassification}
										</CardTitle>
										<CardDescription className="text-gray-300 text-left">
											{getProfileDescription(profileData.profileClassification)}
										</CardDescription>
									</View>
								</CardHeader>
							</Card>
						)}

						{/* Risk Level */}
						{profileData && (
							<View className="mb-6">
								<View className="flex-row justify-between items-center mb-3">
									<Text className="text-sm font-medium text-gray-300">Nível de Risco</Text>
									<Text className="text-sm text-gray-400">{getRiskLevel(profileData.profileClassification)}/3</Text>
								</View>
								<Progress
									value={(getRiskLevel(profileData.profileClassification) / 3) * 100}
									className="h-2"
								/>
							</View>
						)}

						{/* High Liquidity Badge */}
						{profileData?.identifiedInterests?.liquidityNeeded && (
							<View className="items-start mb-6">
								<Badge className="bg-blue-500/10 border-blue-500/20 flex-row items-center px-4 py-2">
									<Droplets
										size={16}
										color="#60A5FA"
									/>
									<Text className="text-blue-400 ml-2">Alta Necessidade de Liquidez</Text>
								</Badge>
							</View>
						)}

						{/* Risk Notes */}
						{profileData && (
							<View className="mb-6">
								<Text className="font-medium mb-2 text-gray-200 text-left">
									Observações sobre Tolerância ao Risco
								</Text>
								<Text className="text-gray-400 text-left leading-relaxed">
									{profileData.identifiedInterests?.riskToleranceNotes || "Nenhuma observação específica sobre tolerância ao risco."}
								</Text>
							</View>
						)}

						{/* Investment Value */}
						{questionnaireData && (
							<Card className="mb-6 bg-gray-900/50 border-gray-800">
								<CardHeader>
									<CardTitle className="text-white">Valor Mensal para Investimento</CardTitle>
								</CardHeader>
								<CardContent>
									<Text className="text-2xl font-bold text-blue-400">
										{new Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(questionnaireData.monthlyInvestmentValue)}
									</Text>
								</CardContent>
							</Card>
						)}

						{/* Action Buttons */}
						<View className="gap-3">
							<Button
								size="lg"
								onPress={() => setHasProfile(false)}
							>
								<Text className="text-white font-medium mr-2">Refazer Questionário</Text>
								<ArrowRight
									size={16}
									color="#FFFFFF"
								/>
							</Button>
						</View>
					</>
				)}
				<Pressable
					className="flex-row mt-6 active:opacity-70"
					onPress={handleLogout}
				>
					<LogOut
						size={20}
						color="#DC2626"
					/>
					<Text className="text-red-600 font-medium ml-2">Sair da conta</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}