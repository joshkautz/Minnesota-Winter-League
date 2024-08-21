import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/firebase/auth-context'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export const UserLogin = ({
	closeMobileSheet,
}: {
	closeMobileSheet?: () => void
}) => {
	const { signInWithEmailAndPassword, signInWithEmailAndPasswordError } =
		useAuthContext()
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginSchema) => {
		const res = await signInWithEmailAndPassword(data.email, data.password)

		toast({
			title: res?.user
				? 'Login successful!'
				: `Login failed: ${signInWithEmailAndPasswordError}`,
			variant: res?.user ? 'default' : 'destructive',
			description: res?.user ? `Welcome back` : `Invalid email or password`,
		})

		if (res?.user && closeMobileSheet) {
			closeMobileSheet()
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={'w-full space-y-6'}
			>
				<FormField
					control={form.control}
					name={'email'}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder={'Email'}
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={'password'}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type={'password'}
									placeholder={'Password'}
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type={'submit'}>Login</Button>
			</form>
		</Form>
	)
}
