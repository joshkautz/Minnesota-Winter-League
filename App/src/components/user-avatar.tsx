import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthContext } from '@/firebase/auth-context'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { Button } from './ui/button'

export const UserAvatar = ({ handleClick }: { handleClick: () => void }) => {
	const { user, loading } = useContext(AuthContext)

	if (loading) {
		return <ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
	}

	if (!user) {
		return <Button onClick={handleClick}>Login</Button>
	}

	if (user) {
		return (
			<Avatar>
				<AvatarImage src={user.photoURL ?? undefined} alt={'profile image'} />
				<AvatarFallback>{user.displayName?.slice(0, 2) ?? 'NA'}</AvatarFallback>
			</Avatar>
		)
	}
}
