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
import { stripeRegistration, updatePlayerDoc } from '@/firebase/firestore'
import { toast } from './ui/use-toast'
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from './ui/table'

const profileSchema = z.object({
	firstname: z.string(),
	lastname: z.string(),
	registered: z.boolean(),
	team: z.string(),
	email: z.string().email(),
})

type ProfileSchema = z.infer<typeof profileSchema>

export const Profile = () => {
	const { user, firestoreValue, offers } = useContext(AuthContext)

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

	const registrationButtonOnClickHandler = () => {
		stripeRegistration(user)
	}

	return (
		<div className={'container'}>
			<div
				className={
					'max-w-max my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
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
			<div className="flex flex-wrap max-w-full ring">
				{/* {JSON.stringify(offers)} */}
			</div>

			<Table>
				<TableCaption>Offers</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Creator</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Player</TableHead>
						<TableHead>Team</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{offers.length > 0 ? (
						offers.map(
							({ offer: { creator, status }, player, team }, index) => {
								// const playerData = userDocRef(player.id)
								return (
									<TableRow key={index}>
										<TableCell>{creator}</TableCell>
										<TableCell>{status}</TableCell>
										<TableCell>{player?.email}</TableCell>
										<TableCell>{team?.name}</TableCell>
									</TableRow>
								)
							}
						)
					) : (
						<TableCell>No Data</TableCell>
					)}
				</TableBody>
			</Table>
			<Button onClick={registrationButtonOnClickHandler}>Register</Button>
		</div>
	)
}
