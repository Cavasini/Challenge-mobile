import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { router } from "expo-router"
import * as React from "react"
import { View, Alert, ActivityIndicator } from "react-native"
import { AuthService } from "@/lib/auth-service"
import { ArrowLeft } from "lucide-react-native"

export default function RegisterScreen() {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [confirmPassword, setConfirmPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const handleRegister = async () => {
		// Validations
		if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
			Alert.alert("Erro", "Por favor, preencha todos os campos")
			return
		}

		if (!validateEmail(email.trim())) {
			Alert.alert("Erro", "Por favor, insira um email válido")
			return
		}

		if (password.length < 6) {
			Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
			return
		}

		if (password !== confirmPassword) {
			Alert.alert("Erro", "As senhas não coincidem")
			return
		}

		setLoading(true)
		try {
			await AuthService.register(email.trim(), password)

			Alert.alert("Sucesso", "Conta criada com sucesso!", [
				{
					text: "OK",
					onPress: () => router.replace("/(tabs)/home"),
				},
			])
		} catch (error) {
			console.error("Register error:", error)
			Alert.alert(
				"Erro no Cadastro",
				error instanceof Error ? error.message : "Falha ao criar conta. Tente novamente."
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className="flex-1 bg-background p-4">
			{/* Header */}
			<View className="items-start mb-8 pt-12">
				<Button
					variant="link"
					onPress={() => router.back()}
					className="p-0"
				>
					<ArrowLeft
						size={24}
						color="#FFFFFF"
					/>
					<Text className="text-white ml-2">Voltar</Text>
				</Button>
			</View>

			{/* Content */}
			<View className="flex-1 justify-center">
				<View className="mb-8">
					<Text className="text-3xl font-bold text-white text-center mb-2">Criar sua conta</Text>
					<Text className="text-gray-400 text-center">Preencha os dados para começar</Text>
				</View>

				<View className="gap-4 mb-6">
					<View>
						<Text className="text-white mb-2 font-medium">Email</Text>
						<Input
							placeholder="seu@email.com"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							className="bg-gray-800/50 border-gray-600 text-white"
						/>
					</View>

					<View>
						<Text className="text-white mb-2 font-medium">Senha</Text>
						<Input
							placeholder="Mínimo 6 caracteres"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							className="bg-gray-800/50 border-gray-600 text-white"
						/>
					</View>

					<View>
						<Text className="text-white mb-2 font-medium">Confirmar Senha</Text>
						<Input
							placeholder="Digite a senha novamente"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
							className="bg-gray-800/50 border-gray-600 text-white"
						/>
					</View>
				</View>

				<Button
					onPress={handleRegister}
					disabled={loading}
					className="w-full bg-blue-600 mb-4"
					size="lg"
				>
					{loading ? (
						<ActivityIndicator
							size="small"
							color="#FFFFFF"
						/>
					) : (
						<Text className="text-white font-medium">Criar Conta</Text>
					)}
				</Button>

				<View className="flex-row justify-center items-center">
					<Text className="text-gray-400">Já tem uma conta? </Text>
					<Button
						variant="link"
						onPress={() => router.push("/(auth)/login")}
						className="p-0"
					>
						<Text className="text-blue-400">Fazer login</Text>
					</Button>
				</View>
			</View>
		</View>
	)
}
