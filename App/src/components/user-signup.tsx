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
import { AuthContext } from '@/firebase/auth-context'
import { useContext } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createPlayer } from '@/firebase/firestore'

const signupSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string(),
})

type SignupSchema = z.infer<typeof signupSchema>

export const UserSignup = ({
	closeMobileSheet,
}: {
	closeMobileSheet?: () => void
}) => {
	const {
		authStateLoading,
		createUserWithEmailAndPassword,
		createUserWithEmailAndPasswordError,
		sendEmailVerification,
	} = useContext(AuthContext)
	const form = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	})

	const onSubmit = async (data: SignupSchema) => {
		const res = await createUserWithEmailAndPassword(data.email, data.password)
		if (res) {
			await sendEmailVerification()
			await createPlayer(
				res.user.uid,
				data.firstname,
				data.lastname,
				data.email
			)
		}

		toast({
			title: res?.user
				? 'Account creation succeeded!'
				: `Account creation failed: ${createUserWithEmailAndPasswordError}`,
			variant: res?.user ? 'default' : 'destructive',
			description: (
				<pre className={'mt-2 w-[340px] rounded-md bg-slate-950 p-4'}>
					<code className={'text-white'}>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		})

		if (closeMobileSheet) {
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
					name={'firstname'}
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input
									placeholder={'First name'}
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
					name={'lastname'}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input
									placeholder={'Last name'}
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
					name="password"
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
				{authStateLoading ? (
					<Button disabled>
						<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
					</Button>
				) : (
					<Button type={'submit'}>Sign up</Button>
				)}
			</form>
		</Form>
	)
}
