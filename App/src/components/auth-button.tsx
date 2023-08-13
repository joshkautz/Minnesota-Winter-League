import { User, handleSignOut, handleLogin } from '@/firebase/auth'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'

export const AuthButton = ({
	loading,
	user,
	className,
}: {
	loading: boolean
	user: User | null | undefined
	className?: string
}) => {
	if (loading) {
		return (
			<Button className={className} disabled>
				<ReloadIcon className={'mr-2 h-4 w-4 animate-spin'} />
				Please wait
			</Button>
		)
	}
	if (user) {
		return (
			<Button className={className} onClick={handleSignOut}>
				Logout
			</Button>
		)
	}
	if (!user) {
		const testData = { email: 'admin@testing.com', password: '00000000' }
		return (
			<Button className={className} onClick={() => handleLogin(testData)}>
				Login
			</Button>
		)
	}
}
