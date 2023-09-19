import { AuthContext } from '@/firebase/auth-context'
// import { createTeam } from '@/firebase/firestore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from './ui/use-toast'
// import { Link } from 'react-router-dom'
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
import { StorageReference } from 'firebase/storage'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createTeam } from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'

const createTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	const { documentSnapshot, documentSnapshotLoading } = useContext(AuthContext)
	const isOnTeam = documentSnapshot?.data()?.team
	const navigate = useNavigate()

	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})

	const [newTeamData, setNewTeamData] = useState<{
		name: string
		ref: StorageReference | undefined
	}>()
	const [blob, setBlob] = useState<Blob>()
	const [storageRef, setStorageRef] = useState<StorageReference>()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) {
			return
		}
		setBlob(e.target.files[0])
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [uploadFile, uploadFileLoading, uploadFileSnapshot, uploadFileError] =
		useUploadFile()
	const [downloadUrl] = useDownloadURL(storageRef)

	const handleResult = ({
		success,
		message,
		navigation,
	}: {
		success: boolean
		message: string
		navigation?: boolean
	}) => {
		toast({
			title: success ? 'Success!' : 'Unable to create team',
			description: message,
			variant: success ? 'default' : 'destructive',
		})
		if (navigation) {
			navigate('/team')
		}
	}

	useEffect(() => {
		console.log(newTeamData)
		if (newTeamData) {
			if (newTeamData.ref) {
				setStorageRef(newTeamData.ref)
			} else {
				if (documentSnapshot) {
					createTeam(documentSnapshot.ref, newTeamData.name, '')
						.then(() => {
							handleResult({
								success: true,
								message: `Created team: ${newTeamData.name}`,
								navigation: true,
							})
						})
						.catch((err) => {
							handleResult({ success: false, message: `Error: ${err}` })
						})
				} else {
					handleResult({
						success: false,
						message: 'Something went wrong, please try logging in again.',
					})
				}
			}
		}
	}, [newTeamData])

	useEffect(() => {
		console.log(downloadUrl)
		if (downloadUrl) {
			// Create Team
			if (documentSnapshot) {
				if (newTeamData) {
					createTeam(documentSnapshot.ref, newTeamData.name, downloadUrl)
						.then(() => {
							handleResult({
								success: true,
								message: `Created team: ${newTeamData.name}`,
								navigation: true,
							})
						})
						.catch((err) => {
							handleResult({ success: false, message: `Error: ${err}` })
						})
				} else {
					console.log('New team data not available.')
					handleResult({
						success: false,
						message: 'Something went wrong, please try again.',
					})
				}
			} else {
				console.log('User not loaded.')
				handleResult({
					success: false,
					message: 'Something went wrong, please try logging in again.',
				})
			}
		}
	}, [downloadUrl])

	const onSubmit = async (data: CreateTeamSchema) => {
		if (documentSnapshot) {
			try {
				if (blob) {
					const result = await uploadFile(ref(getStorage(), uuidv4()), blob, {
						contentType: 'image/jpeg',
					})
					console.log('res', result)

					if (result) {
						setNewTeamData({ name: data.name, ref: result.ref })
					}
				} else {
					console.log('rejected')
					setNewTeamData({ name: data.name, ref: undefined })
				}
			} catch (error) {
				console.log(error)
				handleResult({ success: false, message: `Error: ${error}` })
			}
		}
	}

	useEffect(() => {
		if (uploadFileError) {
			handleResult({
				success: false,
				message: `Error: ${uploadFileError}`,
			})
		}
	}, [uploadFileError])

	return (
		<div className="container flex flex-col items-center justify-center md:h-[calc(100vh-60px)] gap-10">
			{isOnTeam || documentSnapshotLoading ? (
				<div>You must first leave your team in order to create a new one.</div>
			) : (
				<>
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
													onChange={handleFileChange}
													// className="ring"
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
				</>
			)}
		</div>
	)
}