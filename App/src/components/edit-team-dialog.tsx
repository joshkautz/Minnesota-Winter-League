import { ReactNode, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'
import { EditTeam } from './edit-team'

export const EditTeamDialog = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false)

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
					<EditTeam />
				</div>
			</DialogContent>
		</Dialog>
	)
}
