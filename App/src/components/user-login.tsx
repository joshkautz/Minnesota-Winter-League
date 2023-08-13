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
import { handleLogin } from '@/firebase/auth'

const LoginSchema = z.object({
	email: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
})

export const UserLogin = () => {
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
	})

	const onSubmit = (data: z.infer<typeof LoginSchema>) => {
		handleLogin(data)
		toast({
			title: 'You submitted the following values:',
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
								<Input type={'password'} {...field} />
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
