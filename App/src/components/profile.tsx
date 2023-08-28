import { AuthContext } from '@/firebase/auth-context'
import { Input } from '@/components/ui/input'
import { useContext } from 'react'
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
import { updatePlayerDoc } from '@/firebase/firestore'
import { toast } from './ui/use-toast'

const profileSchema = z.object({
	firstname: z.string(),
	lastname: z.string(),
	registered: z.boolean(),
	team: z.string(),
	email: z.string().email(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export const Profile = () => {
	const { user, firestoreValue } = useContext(AuthContext)

	console.log(firestoreValue)

	const defaultValues: ProfileSchema = {
		firstname: firestoreValue?.firstname ?? '',
		lastname: firestoreValue?.lastname ?? '',
		registered: firestoreValue?.registered ?? '',
		team: firestoreValue?.team ?? '',
		email: firestoreValue?.email ?? '',
	}

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues,
		// mode: 'onChange',
	})

	const onSubmit = (data: ProfileSchema) => {
		updatePlayerDoc(user, {
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

	return (
		<>
			<div
				className={
					'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				{user?.displayName ? `Hello ${user.displayName}` : 'Your Profile'}
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
									This is your publicly displayed name.
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
									This is your publicly displayed name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="registered"
						render={() => (
							<FormItem>
								<FormLabel>Registered</FormLabel>
								<FormControl>
									<Input disabled />
								</FormControl>
								<FormDescription>You can register via Stripe.</FormDescription>
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
					<FormField
						control={form.control}
						name="team"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Team</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									You can leave a team at will. But you must be invited to join
									a team, or have your request accepted.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Update profile</Button>
				</form>
			</Form>
		</>
	)
}
