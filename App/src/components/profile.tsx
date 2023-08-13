import { AuthContext } from '@/firebase/auth-context'
import { useContext } from 'react'

export const Profile = () => {
	const { user } = useContext(AuthContext)
	return (
		<div
			className={
				'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
			}
		>
			{user?.displayName ? `Hello ${user.displayName}` : 'Your Profile'}
		</div>
	)
}
