import { AuthContext } from '@/firebase/auth-context'
// import { createTeam } from '@/firebase/firestore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react'
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
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from 'firebase/storage'

const createTeamSchema = z.object({
	logo: z.any(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	const storage = getStorage()
	const { documentSnapshot } = useContext(AuthContext)
	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})
	const [file, setFile] = useState(null)

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0]
		setFile(selectedFile)
	}

	// this is where i neeed halpppp
	const onSubmit = async (data) => {
		console.log('data', data)
		if (!documentSnapshot?.ref || !file) {
			return
		}

		const storageRef = ref(storage, 'teamLogos/' + data.name)
		const uploadTask = uploadBytesResumable(storageRef, file)

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				console.log('Upload is ' + progress + '% done')
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused')
						break
					case 'running':
						console.log('Upload is running')
						break
				}
			},
			(error) => {
				console.error('Error uploading image:', error)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('File available at', downloadURL)
				})
			}
		)
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
											onChange={handleFileChange}
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
