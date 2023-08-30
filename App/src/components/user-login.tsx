import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useContext } from 'react'

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
import { AuthContext } from '@/firebase/auth-context'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export const UserLogin = () => {
	const { signInWithEmailAndPassword, signInWithEmailAndPasswordError } =
		useContext(AuthContext)
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
			description: (
				<pre className={'mt-2 w-[340px] rounded-md bg-slate-950 p-4'}>
					<code className={'text-white'}>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		})
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
								<Input placeholder={'Email'} {...field} />
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
								<Input type={'password'} placeholder={'Password'} {...field} />
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
