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
import { handleSignUp } from '@/firebase/auth'
import { AuthContext } from '@/firebase/auth-context'
import { useContext } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'

const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
})

type SignupSchema = z.infer<typeof signupSchema>

export const UserSignup = () => {
	const { loading } = useContext(AuthContext)
	const form = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	})

	const onSubmit = async (data: SignupSchema) => {
		const res = await handleSignUp({
			email: data.email,
			password: data.password,
		})

		toast({
			title: res.message,
			variant: res.success ? 'default' : 'destructive',
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
				{/* <FormField
					control={form.control}
					name="usau"
					render={({ field }) => (
						<FormItem>
							<FormLabel>USAU id</FormLabel>
							<FormControl>
								<Input placeholder="USAU id" {...field} />
							</FormControl>
							<FormDescription>Maybe?</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<FormField
					control={form.control}
					name="password"
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
				{loading ? (
					<Button disabled>
						<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
					</Button>
				) : (
					<Button type={'submit'}>Signup</Button>
				)}
			</form>
		</Form>
	)
}
