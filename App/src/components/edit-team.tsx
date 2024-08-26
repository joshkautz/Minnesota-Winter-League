import { useAuthContext } from '@/firebase/auth-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { editTeam } from '@/firebase/firestore'
import { StorageReference, ref, storage } from '@/firebase/storage'
import { useTeamsContext } from '@/firebase/teams-context'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { Skeleton } from './ui/skeleton'

const editTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type EditTeamSchema = z.infer<typeof editTeamSchema>

export const EditTeam = ({ closeDialog }: { closeDialog: () => void }) => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const { currentSeasonTeamsQuerySnapshot } = useTeamsContext()
	const { currentSeasonQueryDocumentSnapshot } = useSeasonsContext()

	const [isLoading, setIsLoading] = useState(false)
	const [blob, setBlob] = useState<Blob>()
	const [storageRef, setStorageRef] = useState<StorageReference>()
	const [uploadFile, uploadFileLoading] = useUploadFile()
	const [downloadUrl] = useDownloadURL(storageRef)
	const [editedTeamData, setEditedTeamData] = useState<{
		name: string
		storageRef: StorageReference | undefined
	}>()

	const team = useMemo(
		() =>
			currentSeasonTeamsQuerySnapshot?.docs.find(
				(team) =>
					team.id ===
					authenticatedUserSnapshot
						?.data()
						?.seasons.find(
							(item) =>
								item.season.id === currentSeasonQueryDocumentSnapshot?.id
						)?.team.id
			),
		[
			authenticatedUserSnapshot,
			currentSeasonTeamsQuerySnapshot,
			currentSeasonQueryDocumentSnapshot,
		]
	)

	const form = useForm<EditTeamSchema>({
		resolver: zodResolver(editTeamSchema),
		defaultValues: { name: '', logo: '' },
	})

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files?.[0]) {
				return
			}
			setBlob(e.target.files[0])
		},
		[setBlob]
	)

	useEffect(() => {
		if (uploadFileLoading) {
			setIsLoading(true)
		} else {
			setIsLoading(false)
		}
	}, [uploadFileLoading])

	useEffect(() => {
		if (team?.data().name) {
			form.setValue('name', team?.data().name)
		}
		if (team?.data().storagePath) {
			setStorageRef(ref(storage, team?.data().storagePath))
		}
	}, [team, form, storage, setStorageRef, ref])

	useEffect(() => {
		if (editedTeamData) {
			if (editedTeamData.storageRef) {
				setStorageRef(editedTeamData.storageRef)
			} else {
				// We don't upload a new logo.
				console.log(`We don't upload a new logo.`)
				editTeam(team?.ref, editedTeamData.name, undefined, undefined)
					.then(() => {
						setIsLoading(false)
						toast({
							variant: 'default',
							title: 'Team Edited',
							description: `Changes have been saved, ${editedTeamData.name}!`,
						})
						closeDialog()
					})
					.catch((error) => {
						setIsLoading(false)
						toast({
							variant: 'destructive',
							title: 'Error',
							description: error.message,
						})
					})
			}
		}
	}, [editedTeamData])

	useEffect(() => {
		if (downloadUrl) {
			if (editedTeamData) {
				// We upload a new logo.
				console.log(`We upload a new logo.`)
				editTeam(
					team?.ref,
					editedTeamData.name,
					downloadUrl,
					editedTeamData.storageRef?.fullPath
				)
					.then(() => {
						setIsLoading(false)
						toast({
							variant: 'default',
							title: `Updated ${editedTeamData.name}`,
							description: 'Changes saved successfully.',
						})
						closeDialog()
					})
					.catch((error) => {
						setIsLoading(false)
						toast({
							variant: 'destructive',
							title: 'Error',
							description: error.message,
						})
					})
			}
		}
	}, [downloadUrl])

	const onSubmit = async (data: EditTeamSchema) => {
		if (authenticatedUserSnapshot) {
			try {
				setIsLoading(true)
				if (blob) {
					if (storageRef) {
						// Team already has a logo, and we upload a new logo.
						console.log(`Team already has a logo, and we upload a new logo.`)
						uploadFile(storageRef, blob, {
							contentType: 'image/jpeg',
						}).then(() => {
							setEditedTeamData({ name: data.name, storageRef: storageRef })
						})
					} else {
						// Team doesn't already have a logo, and we upload a new logo.
						console.log(
							`Team doesn't already have a logo, and we upload a new logo.`
						)
						uploadFile(ref(storage, `teams/${uuidv4()}`), blob, {
							contentType: 'image/jpeg',
						}).then((result) => {
							setEditedTeamData({ name: data.name, storageRef: result?.ref })
						})
					}
				} else {
					// We don't upload a new logo.
					console.log(`We don't upload a new logo.`)
					setEditedTeamData({ name: data.name, storageRef: undefined })
				}
			} catch (error) {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'Error',
						description: error.message,
					})
				}
			}
		}
	}

	return (
		<div className="max-w-[400px]">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={'w-full space-y-6 items-center justify-center'}
				>
					<FormField
						control={form.control}
						name={'name'}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Team name</FormLabel>
								<FormControl>
									<Input
										placeholder={team?.data().name ?? 'Team name'}
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
					{team?.data().logo ? (
						<div className="flex items-center justify-center w-40 h-40 mx-auto rounded-md overflow-clip">
							<img src={blob ? URL.createObjectURL(blob) : team?.data().logo} />
						</div>
					) : (
						<Skeleton className="h-[100px] md:h-[250px] md:w-[1/4]" />
					)}
					<Button type={'submit'} disabled={isLoading}>
						{isLoading ? (
							<ReloadIcon className={'animate-spin'} />
						) : (
							`Save changes`
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}
