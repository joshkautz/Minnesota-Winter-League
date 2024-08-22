import { QueryDocumentSnapshot, DocumentData } from '@/firebase/firestore'
import { TeamData } from '@/lib/interfaces'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

export const TeamIcon = ({
	team,
}: {
	team: QueryDocumentSnapshot<TeamData, DocumentData> | undefined
}) => {
	if (!team) {
		return (
			<div
				className={'w-10 h-10 bg-secondary animate-pulse mx-auto rounded-full'}
			/>
		)
	}

	return (
		<Link to={`/teams/${team.id}`}>
			<img
				src={team.data().logo}
				className={cn(
					'mx-auto w-8 h-8 rounded-full object-cover bg-muted hover:scale-105 transition duration-300',
					!team.data().logo && 'bg-gradient-to-r from-primary to-sky-300'
				)}
			/>
		</Link>
	)
}
