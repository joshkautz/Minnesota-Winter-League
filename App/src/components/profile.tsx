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
import { toast } from './ui/use-toast'
import {
	createTeam,
	deleteTeam,
	stripeRegistration,
	updatePlayer,
} from '@/firebase/firestore'

const profileSchema = z.object({
	firstname: z.string(),
	lastname: z.string(),
	email: z.string().email(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export const Profile = () => {
	const {
		authStateUser,
		documentSnapshot,
		sendEmailVerification,
		sendPasswordResetEmail,
	} = useContext(AuthContext)

	const defaultValues: ProfileSchema = {
		firstname: documentSnapshot?.data()?.firstname ?? '',
		lastname: documentSnapshot?.data()?.lastname ?? '',
		email: documentSnapshot?.data()?.email ?? '',
	}

	const form = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		defaultValues,
		// mode: 'onChange',
	})

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
		stripeRegistration(authStateUser)
	}

	const sendEmailVerificationButtonOnClickHandler = () => {
		sendEmailVerification()
	}

	const sendPasswordResetEmailButtonOnClickHandler = () => {
		if (authStateUser) {
			if (authStateUser.email) {
				sendPasswordResetEmail(authStateUser.email)
			}
		}
	}

	const createTeamButtonOnClickHandler = () => {
		if (documentSnapshot) {
			createTeam(documentSnapshot.ref)
		}
	}

	const deleteTeamButtonOnClickHandler = () => {
		if (documentSnapshot) {
			const data = documentSnapshot.data()
			if (data) {
				deleteTeam(data.team)
			}
		}
	}

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-max my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300'
				}
			>
				{authStateUser?.displayName
					? `Hello ${authStateUser.displayName}`
					: 'Your Profile'}
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
					<Button type="submit">Update profile</Button>
				</form>
			</Form>
			<Button onClick={registrationButtonOnClickHandler}>Register</Button>
			<br />
			<Button onClick={sendEmailVerificationButtonOnClickHandler}>
				Re-Send Verification Email
			</Button>
			<br />
			<Button onClick={sendPasswordResetEmailButtonOnClickHandler}>
				Send Password Reset Email
			</Button>
			<br />{' '}
			<Button onClick={createTeamButtonOnClickHandler}>Create Team</Button>
			<br />
			<Button onClick={deleteTeamButtonOnClickHandler}>Delete Team</Button>
			<br />
		</div>
	)
}
