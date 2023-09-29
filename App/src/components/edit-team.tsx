import { AuthContext } from '@/firebase/auth-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useMemo, useState } from 'react'
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
import { updateTeam } from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { StorageReference, ref, storage } from '@/firebase/storage'
import { GradientHeader } from './gradient-header'
import { TeamsContext } from '@/firebase/teams-context'

const editTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type EditTeamSchema = z.infer<typeof editTeamSchema>

export const EditTeam = () => {
	const { documentSnapshot } = useContext(AuthContext)
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const navigate = useNavigate()

	const team = useMemo(() => {
		return teamsQuerySnapshot?.docs.find(
			(team) => team.id === documentSnapshot?.data()?.team?.id
		)
	}, [documentSnapshot])

	const form = useForm<EditTeamSchema>({
		resolver: zodResolver(editTeamSchema),
		defaultValues: { name: '', logo: '' },
	})

	const [updatedTeamData, setUpdatedTeamData] = useState<{
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
			title: success ? 'Success!' : 'Unable to update team',
			description: message,
			variant: success ? 'default' : 'destructive',
		})
		if (navigation) {
			navigate('/manage')
		}
	}

	useEffect(() => {
		if (team?.data().name) {
			form.setValue('name', team?.data().name)
		}
		if (team?.data().storagePath) {
			setStorageRef(ref(storage, team?.data().storagePath))
		}
	}, [team])

	useEffect(() => {
		if (updatedTeamData) {
			if (updatedTeamData.storageRef) {
				setStorageRef(updatedTeamData.storageRef)
			} else {
				if (team) {
					updateTeam(team?.ref, updatedTeamData.name)
						.then(() => {
							handleResult({
								success: true,
								message: `Updated team: ${updatedTeamData.name}`,
								navigation: true,
							})
						})
						.catch((err) => {
							handleResult({ success: false, message: `Error: ${err}` })
						})
				}
			}
		}
	}, [updatedTeamData])

	useEffect(() => {
		if (downloadUrl) {
			if (team) {
				if (updatedTeamData) {
					if (updatedTeamData.storageRef) {
						updateTeam(
							team?.ref,
							updatedTeamData.name,
							downloadUrl,
							updatedTeamData.storageRef?.fullPath
						)
							.then(() => {
								handleResult({
									success: true,
									message: `Created team: ${updatedTeamData.name}`,
									navigation: true,
								})
							})
							.catch((err) => {
								handleResult({ success: false, message: `Error: ${err}` })
							})
					}
				}
			}
		}
	}, [downloadUrl])

	const onSubmit = async (data: EditTeamSchema) => {
		if (documentSnapshot) {
			try {
				if (blob) {
					if (storageRef) {
						await uploadFile(storageRef, blob, {
							contentType: 'image/jpeg',
						})
						setUpdatedTeamData({ name: data.name, storageRef: storageRef })
					} else {
						const result = await uploadFile(
							ref(storage, `teams/${uuidv4()}`),
							blob,
							{
								contentType: 'image/jpeg',
							}
						)
						if (result) {
							setUpdatedTeamData({ name: data.name, storageRef: result.ref })
						}
					}
				} else {
					setUpdatedTeamData({ name: data.name, storageRef: undefined })
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
			<GradientHeader>Edit Team</GradientHeader>
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
							Update
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
