import { AuthContext } from '@/firebase/auth-context'
import { Input } from '@/components/ui/input'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from './ui/use-toast'
import { stripeRegistration, updatePlayer } from '@/firebase/firestore'
import { Label } from './ui/label'
import { CheckCircledIcon, ReloadIcon } from '@radix-ui/react-icons'

const profileSchema = z.object({
	firstname: z.string(),
	lastname: z.string(),
	email: z.string().email(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export const Profile = () => {
	const { authStateUser, documentSnapshot, sendEmailVerification } =
		useContext(AuthContext)
	const [sentEmail, setSentEmail] = useState(false)
	const [stripeLoading, setStripeLoading] = useState(false)

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
	})

	useEffect(() => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				form.setValue('firstname', data.firstname)
				form.setValue('lastname', data.lastname)
				form.setValue('email', data.email)
			}
		}
	}, [documentSnapshot])

	const onSubmit = (data: ProfileSchema) => {
		updatePlayer(authStateUser, {
			firstname: data.firstname,
			lastname: data.lastname,
		})
			.then(() => {
				toast({
					title: `Updated profile with: ${data}`,
				})
			})
			.catch((err) => {
				toast({
					title: `Failed to update profile: ${err}`,
					variant: 'destructive',
				})
			})
	}

	const registrationButtonOnClickHandler = () => {
		stripeRegistration(authStateUser, setStripeLoading)
	}

	const sendEmailVerificationButtonOnClickHandler = () => {
		sendEmailVerification()
		setSentEmail(true)
	}

	const isVerified = authStateUser?.emailVerified
	const isRegistered = documentSnapshot?.data()?.registered

	return (
		<div className="container flex flex-col items-center md:min-h-[calc(100vh-60px)] gap-10">
			<div>
				<div
					className={
						'max-w-max mx-auto my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300'
					}
				>
					Profile Settings
				</div>
				<p>Configure your profile with the options below.</p>
			</div>

			{form ? (
				<div className="flex flex-row flex-wrap items-stretch justify-center w-full gap-8">
					<div className="max-w-[400px] flex-1 basis-[300px] shrink-0">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className={'w-full space-y-6'}
							>
								<FormField
									control={form.control}
									name="firstname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												This is your publicly displayed first name.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												This is your publicly displayed last name.
											</FormDescription>
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
												<Input disabled {...field} />
											</FormControl>
											<FormDescription>
												You cannot change email addresses yet.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={!form.formState.isDirty} type="submit">
									Save Changes
								</Button>
							</form>
						</Form>
					</div>

					<div className="max-w-[400px] flex-1 basis-[300px] shrink-0">
						<div className="flex flex-col gap-6">
							<fieldset className="space-y-2">
								<Label className="inline-flex">
									Email Verification
									{!isVerified && (
										<span className="relative flex w-2 h-2 ml-1">
											<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
											<span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
										</span>
									)}
								</Label>
								<div>
									{isVerified ? (
										<div className="inline-flex items-center gap-2 text-green-600 dark:text-green-500">
											Complete <CheckCircledIcon className="w-4 h-4" />
										</div>
									) : (
										<>
											<Button
												variant={'default'}
												onClick={sendEmailVerificationButtonOnClickHandler}
												disabled={sentEmail}
											>
												{sentEmail ? 'Email Sent!' : 'Re-Send Email'}
											</Button>
											<p className={'text-[0.8rem] text-muted-foreground mt-2'}>
												Check your email for a verification link.
											</p>
										</>
									)}
								</div>
							</fieldset>
							<fieldset className="space-y-2">
								<Label className="inline-flex">
									Registration
									{!isRegistered && (
										<span className="relative flex w-2 h-2 ml-1">
											<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
											<span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
										</span>
									)}
								</Label>
								<div>
									{isRegistered ? (
										<div className="inline-flex items-center gap-2 text-green-600 dark:text-green-500">
											Complete <CheckCircledIcon className="w-4 h-4" />
										</div>
									) : (
										<>
											<Button
												variant={'default'}
												onClick={registrationButtonOnClickHandler}
												disabled={stripeLoading}
											>
												{stripeLoading && (
													<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
												)}
												Continue to Stripe
											</Button>
											<p className={'text-[0.8rem] text-muted-foreground mt-2'}>
												Complete registration by paying via Stripe.
											</p>
										</>
									)}
								</div>
							</fieldset>
						</div>
					</div>
				</div>
			) : (
				<div className="absolute inset-0 flex items-center justify-center">
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			)}
		</div>
	)
}
