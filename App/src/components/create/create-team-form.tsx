import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { useAuthContext } from '@/firebase/auth-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { ref, storage } from '@/firebase/storage'

const createTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeamForm = () => {
	const { authenticatedUserSnapshot } = useAuthContext()
	const navigate = useNavigate()

	const [uploadFile, uploadFileLoading] = useUploadFile()
	// const [newTeamData, setNewTeamData] = useState<{
	// 	name: string | undefined
	// 	storageRef: StorageReference | undefined
	// 	teamId: string | undefined
	// }>()
	const [blob, setBlob] = useState<Blob>()
	// const [storageRef, setStorageRef] = useState<StorageReference>()
	// const [downloadUrl] = useDownloadURL(storageRef)

	const form = useForm<CreateTeamSchema>({
		resolver: zodResolver(createTeamSchema),
	})

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!event.target.files?.[0]) {
				return
			}
			setBlob(event.target.files[0])
		},
		[setBlob]
	)

	const handleResult = useCallback(
		({
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
		},
		[toast, navigate]
	)

	const onCreateSubmit = useCallback(async () => {
		if (authenticatedUserSnapshot) {
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
						// setNewTeamData({
						// 	name: data.name,
						// 	storageRef: result.ref,
						// 	teamId: undefined,
						// })
					}
				} else {
					// setNewTeamData({
					// 	name: data.name,
					// 	storageRef: undefined,
					// 	teamId: undefined,
					// })
				}
			} catch {
				handleResult({
					success: false,
					message: `Ensure your email is verified. Please try again later.`,
				})
			}
		}
	}, [
		authenticatedUserSnapshot,
		uploadFile,
		blob,
		ref,
		storage,
		uuidv4,
		// setNewTeamData,
		handleResult,
	])

	return (
		<div className="max-w-[400px]">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onCreateSubmit)}
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
	)
}
