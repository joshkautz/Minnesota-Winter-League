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
import { updateProfile } from 'firebase/auth'
import { User } from '@/firebase/auth'
import { toast } from './ui/use-toast'

const profileSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: 'Username must be at least 2 characters.',
		})
		.max(30, {
			message: 'Username must not be longer than 30 characters.',
		}),
	email: z.string().email(),
	photoURL: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export const Profile = () => {
	const { user } = useContext(AuthContext)

	const defaultValues: ProfileSchema = {
		username: user?.displayName ?? '',
		email: user?.email ?? '',
		photoURL: user?.photoURL ?? '',
	}

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues,
		// mode: 'onChange',
	})

	const onSubmit = (data: ProfileSchema) => {
		updateProfile(user as User, {
			displayName: data.username,
			photoURL: data.photoURL,
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
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name. It can be your real name or
									a pseudonym.
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
									You can manage verified email addresses only.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="photoURL"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile Image</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									Input a URL to serve as your profile image.
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
