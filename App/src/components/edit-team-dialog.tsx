import { ReactNode, useContext, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'
import { CreateEditTeamForm } from './create-team'
import { AuthContext } from '@/firebase/auth-context'
import { TeamsContext } from '@/firebase/teams-context'

export const EditTeamDialog = ({ children }: { children: ReactNode }) => {
	const { documentSnapshot } = useContext(AuthContext)
	const { teamsQuerySnapshot } = useContext(TeamsContext)
	const [open, setOpen] = useState(false)

	const teamSnapshot = teamsQuerySnapshot?.docs.find(
		(team) => team.id === documentSnapshot?.data()?.team?.id
	)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				onClick={() => {
					if (!open) {
						setOpen(true)
					}
				}}
				asChild
			>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit team</DialogTitle>
					<DialogDescription>Update your team's name or logo</DialogDescription>
				</DialogHeader>
				<div className="max-w-[400px]">
					<CreateEditTeamForm
						create={false}
						documentSnapshot={documentSnapshot}
						teamRef={teamSnapshot?.ref}
						teamName={teamSnapshot?.data().name}
						teamLogo={teamSnapshot?.data().logo}
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}
