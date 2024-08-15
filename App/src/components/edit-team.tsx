import { useAuthContext } from '@/firebase/auth-context'
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
import { StorageReference, ref, storage } from '@/firebase/storage'
import { TeamsContext } from '@/firebase/teams-context'

const editTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type EditTeamSchema = z.infer<typeof editTeamSchema>

export const EditTeam = ({ closeDialog }: { closeDialog: () => void }) => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { teamsQuerySnapshot } = useContext(TeamsContext)

	const team = useMemo(() => {
		return teamsQuerySnapshot?.docs.find(
			(team) => team.id === authenticatedUserSnapshot?.data()?.team?.id
		)
	}, [authenticatedUserSnapshot, teamsQuerySnapshot])

	const [loading, setLoading] = useState(false)

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
			// If team is updated to have an image for the first time.
			if (updatedTeamData.storageRef) {
				setStorageRef(updatedTeamData.storageRef)
			}
			// If team is not setting an image for the first time.
			else {
				if (team) {
					updateTeam(team?.ref, updatedTeamData.name)
						.then(() => {
							toast({
								variant: 'default',
								title: `Updated ${updatedTeamData.name}`,
								description: 'Changes saved successfully.',
							})
							closeDialog()
						})
						.catch((error) => {
							toast({
								variant: 'destructive',
								title: 'Unable to upload file',
								description: `Error: ${error}`,
							})
						})
						.finally(() => {
							setLoading(false)
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
						// If team is updated to have an image for the first time.
						updateTeam(
							team?.ref,
							updatedTeamData.name,
							downloadUrl,
							updatedTeamData.storageRef?.fullPath
						)
							.then(() => {
								toast({
									variant: 'default',
									title: `Updated ${updatedTeamData.name}`,
									description: 'Changes saved successfully.',
								})
								closeDialog()
							})
							.catch((error) => {
								toast({
									variant: 'destructive',
									title: 'Unable to save changes',
									description: `Error: ${error}`,
								})
							})
							.finally(() => {
								setLoading(false)
							})
					}
				}
			}
		}
	}, [downloadUrl])

	const onSubmit = async (data: EditTeamSchema) => {
		if (authenticatedUserSnapshot) {
			try {
				setLoading(true)
				// If team is updated to have an image.
				if (blob) {
					// If team is updated to have an image, but not for the first time.
					if (storageRef) {
						await uploadFile(storageRef, blob, {
							contentType: 'image/jpeg',
						})
						setUpdatedTeamData({ name: data.name, storageRef: storageRef })
						toast({
							variant: 'default',
							title: `Updated team ${data.name}`,
							description: 'Changes saved successfully',
						})
						closeDialog()
					}
					// If team is updated to have an image for the first time.
					else {
						const result = await uploadFile(
							ref(storage, `teams/${uuidv4()}`),
							blob,
							{
								contentType: 'image/jpeg',
							}
						)
						if (result) {
							setUpdatedTeamData({ name: data.name, storageRef: result.ref })
							toast({
								variant: 'default',
								title: `Updated team ${data.name}`,
								description: 'Changes saved successfully',
							})
							closeDialog()
						}
					}
				}
				// If team is updated without a change to the image.
				else {
					setUpdatedTeamData({ name: data.name, storageRef: undefined })
					toast({
						variant: 'default',
						title: `Updated team ${data.name}`,
						description: 'Changes saved successfully',
					})
					closeDialog()
				}
			} catch (error) {
				toast({
					variant: 'destructive',
					title: 'Unable to save changes',
					description: `Error: ${error}`,
				})
			}
		}
	}

	useEffect(() => {
		if (uploadFileError) {
			toast({
				variant: 'destructive',
				title: 'Unable to upload file',
				description: `Error: ${uploadFileError}`,
			})
		}
	}, [uploadFileError])

	const teamLogo = team?.data().logo
	const teamName = team?.data().name

	const previewImage = blob ? URL.createObjectURL(blob) : undefined

	return (
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
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{teamLogo && (
						<div className="flex items-center justify-center w-40 h-40 mx-auto rounded-md overflow-clip">
							<img src={previewImage ?? teamLogo} />
						</div>
					)}
					<Button type={'submit'} disabled={uploadFileLoading || loading}>
						{(uploadFileLoading || loading) && (
							<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
						)}
						Save changes
					</Button>
				</form>
			</Form>
		</div>
	)
}
