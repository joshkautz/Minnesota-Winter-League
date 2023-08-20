import { toTitleCase } from '@/lib/utils'
import { useParams } from 'react-router-dom'

export const TeamProfile = () => {
	const { name } = useParams()

	return (
		<div
			className={
				'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
			}
		>
			{toTitleCase(name ?? 'team')}
		</div>
	)
}
