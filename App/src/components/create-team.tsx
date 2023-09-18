import { AuthContext } from '@/firebase/auth-context'
// import { createTeam } from '@/firebase/firestore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
// import { toast } from './ui/use-toast'
// import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const createTeamSchema = z.object({
	logo: z.any(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	// const storage = getStorage()
	const { documentSnapshot } = useContext(AuthContext)
	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})

	// this is where i neeed halpppp
	const onSubmit = async (data: CreateTeamSchema) => {
		console.log('data', data)
		if (!documentSnapshot?.ref) {
			return
		}

		try {
			// const storageRef = ref(storage, 'team-logos/' + data.name)
			// const uploadTask = uploadBytes(storageRef, data.logo)
			// const unsubscribe = on(
			// 	uploadTask,
			// 	'state_changed',
			// 	(snapshot) => {
			// 		// Handle progress updates here if needed.
			// 		const progress =
			// 			(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			// 		console.log(`Upload is ${progress}% done`)
			// 	},
			// 	(error) => {
			// 		// Handle upload errors.
			// 		console.error('Error uploading image:', error)
			// 		// Handle the error here, for example, by displaying an error message to the user.
			// 	},
			// 	async () => {
			// 		// Upload completed successfully, now get the download URL.
			// 		try {
			// 			const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
			// 			console.log('Image URL:', downloadURL)
			// 			// Continue with creating the team or other actions as needed.
			// 			// For example, update your Firestore document with the downloadURL.
			// 		} catch (urlError) {
			// 			// Handle any errors that may occur when getting the download URL.
			// 			console.error('Error getting download URL:', urlError)
			// 			// Handle the error, such as displaying an error message to the user.
			// 		}
			// 		// Unsubscribe the event listener when done (optional).
			// 		unsubscribe()
			// 	}
			// )
			// const res = await createTeam(documentSnapshot.ref, data)
			// console.log(res)
			// if (res.id) {
			// 	toast({
			// 		title: `Successfully created team ${data.name}!`,
			// 		variant: 'default',
			// 		description: (
			// 			<span>
			// 				Build up your roster by{' '}
			// 				<Link to="/invites">inviting other players to join!</Link>
			// 			</span>
			// 		),
			// 	})
			// } else {
			// 	toast({
			// 		title: `Unable to create team ${data.name}!`,
			// 		variant: 'destructive',
			// 		description: 'Something went wrong, please try again.',
			// 	})
			// }
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="container flex flex-col items-center justify-center md:h-[calc(100vh-60px)] gap-10">
			<div>
				<div
					className={
						'max-w-max my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300'
					}
				>
					Create your own Team
				</div>
				<p>it all starts here!</p>
			</div>
			<div className="max-w-[400px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className={'w-full space-y-6'}
					>
						<FormField
							control={form.control}
							name={'name'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Team name</FormLabel>
									<FormControl>
										<Input
											placeholder={'Team name'}
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
							name={'logo'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Logo</FormLabel>
									<FormControl>
										<Input
											id="image-upload"
											type={'file'}
											accept="image/*"
											placeholder={'Upload Image'}
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type={'submit'}>Create</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
