import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { router } from "expo-router"
import * as React from "react"
import { View, Alert, ActivityIndicator } from "react-native"
import { AuthService } from "@/lib/auth-service"
import { ArrowLeft } from "lucide-react-native"

export default function LoginScreen() {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = React.useState(false)

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			Alert.alert("Erro", "Por favor, preencha todos os campos")
			return
		}

		setLoading(true)
		try {
			await AuthService.login(email.trim(), password)

			// Redirecionar para a tela principal
			router.replace("/(tabs)/home")
		} catch (error) {
			console.error("Login error:", error)
			Alert.alert(
				"Erro no Login",
				error instanceof Error ? error.message : "Falha ao fazer login. Verifique suas credenciais."
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
					<Text className="text-3xl font-bold text-white text-center mb-2">Bem-vindo de volta</Text>
					<Text className="text-gray-400 text-center">Entre com suas credenciais para continuar</Text>
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
							placeholder="Sua senha"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							className="bg-gray-800/50 border-gray-600 text-white"
						/>
					</View>
				</View>

				<Button
					onPress={handleLogin}
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
						<Text className="text-white font-medium">Entrar</Text>
					)}
				</Button>

				<View className="flex-row justify-center items-center">
					<Text className="text-gray-400">Não tem uma conta? </Text>
					<Button
						variant="link"
						onPress={() => router.push("/(auth)/register")}
						className="p-0"
					>
						<Text className="text-blue-400">Criar conta</Text>
					</Button>
				</View>
			</View>
		</View>
	)
}
