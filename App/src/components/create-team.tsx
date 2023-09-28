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
import {
	DocumentData,
	DocumentSnapshot,
	createTeam,
} from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { StorageReference, ref, storage } from '@/firebase/storage'
import { GradientHeader } from './gradient-header'
import { PlayerData } from '@/lib/interfaces'

export const createEditTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

export type CreateEditTeamSchema = z.infer<typeof createEditTeamSchema>

export const CreateEditTeamForm = ({
	teamLogo,
	teamName,
	documentSnapshot,
	create,
}: {
	teamLogo?: string
	teamName?: string
	documentSnapshot: DocumentSnapshot<PlayerData, DocumentData> | undefined
	create?: boolean
}) => {
	if (!documentSnapshot) {
		return <ReloadIcon className={'h-10 w-10 animate-spin'} />
	}

	const form = useForm<CreateEditTeamSchema>({
		resolver: zodResolver(createEditTeamSchema),
	})
	const [newTeamData, setNewTeamData] = useState<{
		name: string
		ref: StorageReference | undefined
	}>()
	const [blob, setBlob] = useState<Blob>()
	const [storageRef, setStorageRef] = useState<StorageReference>()
	const navigate = useNavigate()

	const onSubmit = async (data: CreateEditTeamSchema) => {
		if (documentSnapshot) {
			try {
				if (blob) {
					const result = await uploadFile(
						ref(storage, `teams/${uuidv4()}`),
						blob,
						{
							contentType: 'image/jpeg',
						}
					)
					if (result) {
						setNewTeamData({ name: data.name, ref: result.ref })
					}
				} else {
					setNewTeamData({ name: data.name, ref: undefined })
				}
			} catch (error) {
				handleResult({ success: false, message: `Error: ${error}` })
			}
		}
	}

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
			if (newTeamData.ref) {
				setStorageRef(newTeamData.ref)
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
		if (downloadUrl) {
			if (documentSnapshot) {
				if (newTeamData) {
					createTeam(
						documentSnapshot.ref,
						newTeamData.name,
						downloadUrl,
						newTeamData.ref?.fullPath
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
				} else {
					handleResult({
						success: false,
						message: 'Something went wrong, please try again.',
					})
				}
			} else {
				handleResult({
					success: false,
					message: 'Something went wrong, please try logging in again.',
				})
			}
		}
	}, [downloadUrl])

	useEffect(() => {
		if (uploadFileError) {
			handleResult({
				success: false,
				message: `Error: ${uploadFileError}`,
			})
		}
	}, [uploadFileError])

	const previewImage = blob ? URL.createObjectURL(blob) : undefined

	return (
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
									placeholder={teamName ?? 'Team name'}
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
									// className="ring"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{teamLogo && (
					<div className="w-40 h-40 mx-auto">
						<img src={previewImage ?? teamLogo} />
					</div>
				)}
				<Button type={'submit'} disabled={uploadFileLoading}>
					{uploadFileLoading && (
						<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
					)}
					{create ? 'Create' : 'Save Changes'}
				</Button>
			</form>
		</Form>
	)
}

export const CreateTeam = () => {
	const { documentSnapshot, documentSnapshotLoading } = useContext(AuthContext)
	const isOnTeam = documentSnapshot?.data()?.team

	return (
		<div className="container flex flex-col items-center md:min-h-[calc(100vh-60px)] gap-10">
			{isOnTeam || documentSnapshotLoading ? (
				<div>You must first leave your team in order to create a new one.</div>
			) : (
				<>
					<GradientHeader>Create a Team</GradientHeader>
					<div className="max-w-[400px]">
						<CreateEditTeamForm
							create={true}
							documentSnapshot={documentSnapshot}
						/>
					</div>
				</>
			)}
		</div>
	)
}
