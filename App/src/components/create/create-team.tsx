import { useAuthContext } from '@/firebase/auth-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useDownloadURL, useUploadFile } from 'react-firebase-hooks/storage'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { v4 as uuidv4 } from 'uuid'
import { ReloadIcon } from '@radix-ui/react-icons'
import {
	createTeam,
	rolloverTeam,
	DocumentData,
	QueryDocumentSnapshot,
} from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { StorageReference, ref, storage } from '@/firebase/storage'
import { GradientHeader } from '@/components/gradient-header'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { Timestamp } from '@firebase/firestore'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useTeamsContext } from '@/firebase/teams-context'
import { Switch } from '@/components/ui/switch'
import { NotificationCard } from '@/components/notification-card'
import { TeamData } from '@/lib/interfaces'

const createTeamSchema = z.object({
	logo: z.string().optional(),
	name: z.string().min(2),
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

export const CreateTeam = () => {
	const navigate = useNavigate()
	const { authenticatedUserSnapshot, authStateUser } = useAuthContext()
	const { currentSeasonQueryDocumentSnapshot, seasonsQuerySnapshot } =
		useSeasonsContext()
	const {
		teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot,
		teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading,
	} = useTeamsContext()

	const [loading, setLoading] = useState(false)
	const [newTeamData, setNewTeamData] = useState<{
		name: string | undefined
		storageRef: StorageReference | undefined
		teamId: string | undefined
	}>()
	const [blob, setBlob] = useState<Blob>()
	const [storageRef, setStorageRef] = useState<StorageReference>()
	const [uploadFile, uploadFileLoading, uploadFileError] = useUploadFile()
	const [downloadUrl] = useDownloadURL(storageRef)

	const isAuthenticatedUserRostered = useMemo(
		() =>
			authenticatedUserSnapshot
				?.data()
				?.seasons.some(
					(item) =>
						item.season.id === currentSeasonQueryDocumentSnapshot?.id &&
						item.team
				),
		[authenticatedUserSnapshot, currentSeasonQueryDocumentSnapshot]
	)

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

	useEffect(() => {
		if (newTeamData) {
			if (newTeamData.storageRef) {
				setStorageRef(newTeamData.storageRef)
			} else {
				if (authenticatedUserSnapshot) {
					console.log(authStateUser?.emailVerified)
					createTeam(
						authenticatedUserSnapshot.ref,
						newTeamData.name,
						undefined,
						currentSeasonQueryDocumentSnapshot?.ref,
						undefined
					)
						.then(() => {
							handleResult({
								success: true,
								message: `Created team: ${newTeamData.name}`,
								navigation: true,
							})
						})
						.catch((error) => {
							console.log(error.message)
							handleResult({
								success: false,
								message: `Ensure your email is verified. Please try again later.`,
							})
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
	}, [
		newTeamData,
		authenticatedUserSnapshot,
		setStorageRef,
		createTeam,
		handleResult,
		setLoading,
	])

	useEffect(() => {
		if (downloadUrl) {
			if (authenticatedUserSnapshot) {
				if (newTeamData) {
					if (rolloverMode) {
						rolloverTeam(
							authenticatedUserSnapshot.ref,
							newTeamData.name,
							downloadUrl,
							currentSeasonQueryDocumentSnapshot?.ref,
							newTeamData.storageRef?.fullPath,
							newTeamData.teamId
						)
							.then(() => {
								handleResult({
									success: true,
									message: `Created team: ${newTeamData.name}`,
									navigation: true,
								})
							})
							.catch(() => {
								handleResult({
									success: false,
									message: `Ensure your email is verified. Please try again later.`,
								})
							})
							.finally(() => {
								setLoading(false)
							})
					} else {
						createTeam(
							authenticatedUserSnapshot.ref,
							newTeamData.name,
							downloadUrl,
							currentSeasonQueryDocumentSnapshot?.ref,
							newTeamData.storageRef?.fullPath
						)
							.then(() => {
								handleResult({
									success: true,
									message: `Created team: ${newTeamData.name}`,
									navigation: true,
								})
							})
							.catch(() => {
								handleResult({
									success: false,
									message: `Ensure your email is verified. Please try again later.`,
								})
							})
							.finally(() => {
								setLoading(false)
							})
					}
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
	}, [
		downloadUrl,
		handleResult,
		setLoading,
		authenticatedUserSnapshot,
		newTeamData,
	])

	const onCreateSubmit = useCallback(
		async (data: CreateTeamSchema) => {
			if (authenticatedUserSnapshot) {
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
							setNewTeamData({
								name: data.name,
								storageRef: result.ref,
								teamId: undefined,
							})
						}
					} else {
						setNewTeamData({
							name: data.name,
							storageRef: undefined,
							teamId: undefined,
						})
					}
				} catch {
					handleResult({
						success: false,
						message: `Ensure your email is verified. Please try again later.`,
					})
				}
			}
		},
		[
			authenticatedUserSnapshot,
			setLoading,
			uploadFile,
			blob,
			ref,
			storage,
			uuidv4,
			setNewTeamData,
			handleResult,
		]
	)

	const onRolloverSubmit = useCallback(async () => {
		try {
			setLoading(true)
			setNewTeamData({
				name: selectedTeamQueryDocumentSnapshot?.data().name,
				storageRef: ref(
					storage,
					selectedTeamQueryDocumentSnapshot?.data().logo
				),
				teamId: selectedTeamQueryDocumentSnapshot?.data().teamId,
			})
		} catch {
			handleResult({
				success: false,
				message: `Ensure your email is verified. Please try again later.`,
			})
		}
	}, [
		setLoading,
		uploadFile,
		ref,
		storage,
		uuidv4,
		setNewTeamData,
		handleResult,
	])

	useEffect(() => {
		if (uploadFileError) {
			handleResult({
				success: false,
				message: `Ensure your email is verified. Please try again later.`,
			})
		}
	}, [uploadFileError, handleResult])

	const isRegistrationOpen = useMemo(
		() =>
			currentSeasonQueryDocumentSnapshot &&
			Timestamp.now() >
				currentSeasonQueryDocumentSnapshot?.data().registrationStart &&
			Timestamp.now() <
				currentSeasonQueryDocumentSnapshot?.data().registrationEnd,
		[currentSeasonQueryDocumentSnapshot]
	)

	const [stringValue, setStringValue] = useState<string | undefined>()

	const [
		selectedTeamQueryDocumentSnapshot,
		setSelectedTeamQueryDocumentSnapshot,
	] = useState<QueryDocumentSnapshot<TeamData, DocumentData> | undefined>(
		undefined
	)

	const handleSeasonChange = useCallback(
		(team: string) => {
			setStringValue(team)
			const teamQueryDocumentSnapshot =
				teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot?.docs.find(
					(teamQueryDocumentSnapshot) =>
						teamQueryDocumentSnapshot.data().name === team
				)
			if (teamQueryDocumentSnapshot) {
				setSelectedTeamQueryDocumentSnapshot(teamQueryDocumentSnapshot)
			}
		},
		[setStringValue]
	)

	useEffect(() => {
		const defaultSelection =
			teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot?.docs.sort(
				(a, b) => {
					const seasonsQuerySnapshots = seasonsQuerySnapshot?.docs
					if (seasonsQuerySnapshots) {
						const seasonA = seasonsQuerySnapshots.find(
							(seasonQueryDocumentSnapshot) =>
								seasonQueryDocumentSnapshot.id === a.data().season.id
						)
						const seasonB = seasonsQuerySnapshots.find(
							(seasonQueryDocumentSnapshot) =>
								seasonQueryDocumentSnapshot.id === b.data().season.id
						)
						if (seasonA && seasonB) {
							return (
								seasonA.data()?.dateStart.seconds -
								seasonB.data()?.dateStart.seconds
							)
						}
						return 0
					}
					return 0
				}
			)?.[0]
		setStringValue(defaultSelection?.data().name)
	}, [teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot, setStringValue])

	const [rolloverMode, setRolloverMode] = useState(false)

	return (
		<div className="container flex flex-col items-center md:min-h-[calc(100vh-60px)] gap-10">
			{!currentSeasonQueryDocumentSnapshot || loading ? (
				<div className={'absolute inset-0 flex items-center justify-center'}>
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : isAuthenticatedUserRostered ? (
				<div>You must first leave your team in order to create a new one.</div>
			) : !isRegistrationOpen ? (
				<div>Registration is not open.</div>
			) : (
				<>
					<GradientHeader>Create a Team</GradientHeader>

					<NotificationCard
						className="w-full min-w-0"
						title="Team Creation Form"
						description="Create a team to compete in the upcoming season. You can create a team from scratch or rollover a team from a previous season."
						moreActions={
							<div className="flex items-center space-x-2">
								<Switch
									id="rollover"
									checked={rolloverMode}
									onCheckedChange={() => setRolloverMode(!rolloverMode)}
								/>
								<Label htmlFor="rollover">Rollover past team</Label>
							</div>
						}
					>
						{rolloverMode ? (
							<div className="inline-flex items-start justify-start w-full space-x-2">
								{teamsForWhichAuthenticatedUserIsCaptainQuerySnapshotLoading ? (
									<Skeleton className="w-24 h-8" />
								) : !teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot ? (
									<p>No previous teams eligible for rollover</p>
								) : (
									<div className="flex flex-col space-y-6">
										<div className="space-y-2">
											<Label>Teams eligible for rollover</Label>
											<Select
												value={stringValue}
												onValueChange={handleSeasonChange}
											>
												<SelectTrigger>
													<SelectValue placeholder={'Select a previous team'} />
												</SelectTrigger>
												<SelectContent>
													{teamsForWhichAuthenticatedUserIsCaptainQuerySnapshot?.docs
														.sort((a, b) => {
															const docs = seasonsQuerySnapshot?.docs
															if (docs) {
																const seasonA = docs.find(
																	(season) => season.id === a.data().season.id
																)
																const seasonB = docs.find(
																	(season) => season.id === b.data().season.id
																)
																if (seasonA && seasonB) {
																	return (
																		seasonA.data()?.dateStart.seconds -
																		seasonB.data()?.dateStart.seconds
																	)
																}
																return 0
															}
															return 0
														})
														.map((team) => (
															<SelectItem
																key={team.id}
																value={team.data().name}
															>
																{team.data().name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
										</div>
										<Button type={'submit'} onClick={onRolloverSubmit}>
											Rollover
										</Button>
									</div>
								)}
							</div>
						) : (
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
						)}
					</NotificationCard>
				</>
			)}
		</div>
	)
}
