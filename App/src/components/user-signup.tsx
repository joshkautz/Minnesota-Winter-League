'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

const FormSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	first: z.string().min(2, {
		message: 'Must be at least 2 characters.',
	}),
	last: z.string().min(2, {
		message: 'Must be at least 2 characters.',
	}),
	email: z.string().email({ message: 'Must use a valid email address.' }),
	usau: z
		.number()
		.min(100000, { message: 'Must enter a valid USAU id.' })
		.max(999999, { message: 'Must enter a valid USAU id.' }),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
})

export const UserSignup = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="first"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First</FormLabel>
							<FormControl>
								<Input placeholder="First name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="last"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last</FormLabel>
							<FormControl>
								<Input placeholder="Last name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
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
				/>
				<FormField
					control={form.control}
					name="password"
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
				<Button type="submit">Signup</Button>
			</form>
		</Form>
	)
}
