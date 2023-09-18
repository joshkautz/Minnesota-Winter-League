import { AuthContext } from '@/firebase/auth-context'
import { createTeam } from '@/firebase/firestore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from './ui/use-toast'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useDownloadURL, useUploadFile } from 'react-firebase-hooks/storage'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { getStorage, ref } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { StorageReference, FirebaseStorage } from 'firebase/storage'
import { ReloadIcon } from '@radix-ui/react-icons'

const createTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	const { documentSnapshot } = useContext(AuthContext)

	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})

	const [blob, setBlob] = useState<Blob>()
	const [uuid, setUuid] = useState<string>(uuidv4())
	const [storage, setStorage] = useState<FirebaseStorage>(getStorage())
	const [storageRef, setStorageRef] = useState<StorageReference>(
		ref(storage, uuid)
	)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) {
			return
		}
		// form.setValue('logo', e.target.files[0].name)
		setBlob(e.target.files[0])
	}

	const [uploadFile, uploadFileLoading, uploadFileSnapshot, uploadFileError] =
		useUploadFile()
	const [downloadUrl, downloadUrlLoading, downloadUrlError] =
		useDownloadURL(storageRef)

	useEffect(() => {
		if (!uploadFileLoading) {
			console.log(uploadFileSnapshot)
		}
	}, [uploadFileLoading])

	// this is where i neeed halpppp
	const onSubmit = async (data: CreateTeamSchema) => {
		if (documentSnapshot) {
			try {
				if (!blob) return

				const result = await uploadFile(storageRef, blob, {
					contentType: 'image/jpeg',
				})

				if (result?.ref) {
					setStorageRef(result?.ref)
				}

				// Create Team
				// await createTeam(documentSnapshot.ref, data.name, data.logo)

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
										<span>Upload Image</span>
										<Input
											id="image-upload"
											type={'file'}
											accept="image/*"
											placeholder={'Upload Image'}
											{...field}
											onChange={handleFileChange}
                      ref={fileInputRef}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type={'submit'} disabled={uploadFileLoading}>
							{uploadFileLoading && (
								<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
							)}
							Create
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
