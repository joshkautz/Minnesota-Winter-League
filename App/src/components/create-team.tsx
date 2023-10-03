import { AuthContext } from '@/firebase/auth-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from './ui/use-toast'
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
import { v4 as uuidv4 } from 'uuid'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createTeam } from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { StorageReference, ref, storage } from '@/firebase/storage'
import { GradientHeader } from './gradient-header'

const createTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const isOnTeam = documentSnapshot?.data()?.team
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)

	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})

	const [newTeamData, setNewTeamData] = useState<{
		name: string
		storageRef: StorageReference | undefined
	}>()
	const [blob, setBlob] = useState<Blob>()
	const [storageRef, setStorageRef] = useState<StorageReference>()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) {
			return
		}
		setBlob(e.target.files[0])
	}

	const [uploadFile, uploadFileLoading, , uploadFileError] = useUploadFile()
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
			navigate('/manage')
		}
	}

	useEffect(() => {
		if (newTeamData) {
			if (newTeamData.storageRef) {
				setStorageRef(newTeamData.storageRef)
			} else {
				if (documentSnapshot) {
					createTeam(documentSnapshot.ref, newTeamData.name)
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
						.finally(() => {
							setLoading(false)
						})
				} else {
					handleResult({
						success: false,
						message: 'Ensure your email is verified. Please try again later.',
					})
				}
			}
		}
	}, [newTeamData])

	useEffect(() => {
		if (downloadUrl) {
			if (documentSnapshot) {
				if (newTeamData) {
					createTeam(
						documentSnapshot.ref,
						newTeamData.name,
						downloadUrl,
						newTeamData.storageRef?.fullPath
					)
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
						.finally(() => {
							setLoading(false)
						})
				} else {
					handleResult({
						success: false,
						message: 'Ensure your email is verified. Please try again later.',
					})
				}
			} else {
				handleResult({
					success: false,
					message: 'Ensure your email is verified. Please try again later.',
				})
			}
		}
	}, [downloadUrl])

	const onSubmit = async (data: CreateTeamSchema) => {
		if (documentSnapshot) {
			try {
				setLoading(true)
				if (blob) {
					const result = await uploadFile(
						ref(storage, `teams/${uuidv4()}`),
						blob,
						{
							contentType: 'image/jpeg',
						}
					)
					if (result) {
						setNewTeamData({ name: data.name, storageRef: result.ref })
					}
				} else {
					setNewTeamData({ name: data.name, storageRef: undefined })
				}
			} catch (error) {
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
		<div className="container flex flex-col items-center md:min-h-[calc(100vh-60px)] gap-10">
			{documentSnapshot?.data()?.team === null ? (
				<>
					<GradientHeader>Create a Team</GradientHeader>
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
											<FormLabel>Team logo</FormLabel>
											<FormControl>
												<Input
													id="image-upload"
													type={'file'}
													accept="image/*"
													placeholder={'Upload Image'}
													{...field}
													onChange={handleFileChange}
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
			) : isOnTeam && !loading ? (
				<div>You must first leave your team in order to create a new one.</div>
			) : (
				<div className={'absolute inset-0 flex items-center justify-center'}>
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			)}
		</div>
	)
}
