import * as React from "react"
import { TextInput, type TextInputProps } from "react-native"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	TextInputProps & {
		className?: string
	}
>(({ className, ...props }, ref) => {
	return (
		<TextInput
			ref={ref}
			className={cn(
				"web:flex h-12 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 native:py-3 native:text-base lg:text-sm text-white web:file:border-0 web:file:bg-transparent web:file:text-sm web:file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 web:focus-visible:ring-offset-background",
				className
			)}
			placeholderTextColor={"hsl(240 5% 64.9%)"}
			{...props}
		/>
	)
})

Input.displayName = "Input"

export { Input }
