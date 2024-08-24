import { useAuthContext } from '@/firebase/auth-context'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useDownloadURL, useUploadFile } from 'react-firebase-hooks/storage'
import { Label } from '@/components/ui/label'
import { ReloadIcon } from '@radix-ui/react-icons'
import { createTeam, rolloverTeam } from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { StorageReference } from '@/firebase/storage'
import { GradientHeader } from '@/components/gradient-header'
import { useSeasonsContext } from '@/firebase/seasons-context'
import { Timestamp } from '@firebase/firestore'

import { Switch } from '@/components/ui/switch'
import { NotificationCard } from '@/components/notification-card'
import { CreateTeamForm } from './create-team-form'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RolloverTeamForm } from './rollover-team-form'

const formatTimestamp = (timestamp: Timestamp | undefined) => {
	if (!timestamp) return
	const date = new Date(timestamp.seconds * 1000)
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

export const CreateTeam = () => {
	const navigate = useNavigate()
	const { authenticatedUserSnapshot, authenticatedUserSnapshotLoading } =
		useAuthContext()
	const {
		currentSeasonQueryDocumentSnapshot,
		currentSeasonQueryDocumentSnapshotLoading,
		seasonsQuerySnapshot,
		seasonsQuerySnapshotLoading,
	} = useSeasonsContext()

	const [newTeamData, setNewTeamData] = useState<{
		name: string | undefined
		storageRef: StorageReference | undefined
		teamId: string | undefined
	}>()
	const [storageRef, setStorageRef] = useState<StorageReference>()
	const [uploadFile] = useUploadFile()
	const [downloadUrl] = useDownloadURL(storageRef)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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

	const handleResult = useCallback(
		({
			success,
			title,
			description,
			navigation,
		}: {
			success: boolean
			title: string
			description: string
			navigation: boolean
		}) => {
			toast({
				title: title,
				description: description,
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
				createTeam(
					authenticatedUserSnapshot?.ref,
					newTeamData.name,
					undefined,
					currentSeasonQueryDocumentSnapshot?.ref,
					undefined
				)
					.then(() => {
						handleResult({
							success: true,
							title: 'Team Created',
							description: `Welcome to the league, ${newTeamData.name}!`,
							navigation: true,
						})
					})
					.catch((error) => {
						setIsSubmitting(false)
						handleResult({
							success: false,
							title: 'Error',
							description: error.message,
							navigation: false,
						})
					})
			}
		}
	}, [newTeamData])

	useEffect(() => {
		if (downloadUrl) {
			if (rolloverMode) {
				rolloverTeam(
					authenticatedUserSnapshot?.ref,
					newTeamData?.name,
					downloadUrl,
					currentSeasonQueryDocumentSnapshot?.ref,
					newTeamData?.storageRef?.fullPath,
					newTeamData?.teamId
				)
					.then(() => {
						handleResult({
							success: true,
							title: 'Team Created',
							description: `Welcome to the league, ${newTeamData?.name}!`,
							navigation: true,
						})
					})
					.catch((error) => {
						setIsSubmitting(false)
						handleResult({
							success: false,
							title: 'Error',
							description: error.message,
							navigation: false,
						})
					})
			} else {
				createTeam(
					authenticatedUserSnapshot?.ref,
					newTeamData?.name,
					downloadUrl,
					currentSeasonQueryDocumentSnapshot?.ref,
					newTeamData?.storageRef?.fullPath
				)
					.then(() => {
						handleResult({
							success: true,
							title: 'Team Created',
							description: `Welcome to the league, ${newTeamData?.name}!`,
							navigation: true,
						})
					})
					.catch((error) => {
						setIsSubmitting(false)
						handleResult({
							success: false,
							title: 'Error',
							description: error.message,
							navigation: false,
						})
					})
			}
		}
	}, [downloadUrl])

	const isRegistrationOpen = useMemo(
		() =>
			currentSeasonQueryDocumentSnapshot &&
			Timestamp.now() >
				currentSeasonQueryDocumentSnapshot?.data().registrationStart &&
			Timestamp.now() <
				currentSeasonQueryDocumentSnapshot?.data().registrationEnd,
		[currentSeasonQueryDocumentSnapshot]
	)

	const [rolloverMode, setRolloverMode] = useState(false)

	const isLoading = useMemo(
		() =>
			!authenticatedUserSnapshot ||
			authenticatedUserSnapshotLoading ||
			!currentSeasonQueryDocumentSnapshot ||
			currentSeasonQueryDocumentSnapshotLoading ||
			!seasonsQuerySnapshot ||
			seasonsQuerySnapshotLoading,
		[
			authenticatedUserSnapshot,
			authenticatedUserSnapshotLoading,
			currentSeasonQueryDocumentSnapshot,
			currentSeasonQueryDocumentSnapshotLoading,
			seasonsQuerySnapshot,
			seasonsQuerySnapshotLoading,
		]
	)

	return (
		<div className="container flex flex-col items-center md:min-h-[calc(100vh-60px)] gap-10">
			{isLoading || isSubmitting ? (
				<div className={'absolute inset-0 flex items-center justify-center'}>
					<ReloadIcon className={'mr-2 h-10 w-10 animate-spin'} />
				</div>
			) : isAuthenticatedUserRostered ? (
				<Card className={cn('max-w-[800px] w-full mx-auto')}>
					<CardContent>{`You must first leave your team in order to create a new one.`}</CardContent>
				</Card>
			) : !isRegistrationOpen ? (
				<Card className={cn('max-w-[800px] w-full mx-auto')}>
					<CardContent>{`Registration does not begin until ${formatTimestamp(currentSeasonQueryDocumentSnapshot?.data()?.registrationStart)}`}</CardContent>
				</Card>
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
									onCheckedChange={() =>
										setRolloverMode((prevRolloverMode) => !prevRolloverMode)
									}
								/>
								<Label htmlFor="rollover">Rollover past team</Label>
							</div>
						}
					>
						{rolloverMode ? (
							<RolloverTeamForm
								isSubmitting={isSubmitting}
								setIsSubmitting={setIsSubmitting}
								uploadFile={uploadFile}
								setNewTeamData={setNewTeamData}
								handleResult={handleResult}
							/>
						) : (
							<CreateTeamForm
								isSubmitting={isSubmitting}
								setIsSubmitting={setIsSubmitting}
								uploadFile={uploadFile}
								setNewTeamData={setNewTeamData}
								handleResult={handleResult}
							/>
						)}
					</NotificationCard>
				</>
			)}
		</div>
	)
}
