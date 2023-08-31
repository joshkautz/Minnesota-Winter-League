import { User } from '@/firebase/auth'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { toast } from './ui/use-toast'
import { useContext } from 'react'
import { AuthContext } from '@/firebase/auth-context'

export const AuthButton = ({
	loading,
	user,
	className,
}: {
	loading: boolean
	user: User | null | undefined
	className?: string
}) => {
	const {
		signInWithEmailAndPassword,
		signInWithEmailAndPasswordError,
		signOut,
	} = useContext(AuthContext)

	const runMockLogin = async () => {
		const testData = { email: 'admin@testing.com', password: '00000000' }
		const res = await signInWithEmailAndPassword(
			testData.email,
			testData.password
		)

		toast({
			title: res?.user
				? 'Login successful!'
				: `Login failed: ${signInWithEmailAndPasswordError}`,
			variant: res?.user ? 'default' : 'destructive',
			description: (
				<pre className={'mt-2 w-[340px] rounded-md bg-slate-950 p-4'}>
					<code className={'text-white'}>
						{JSON.stringify(testData, null, 2)}
					</code>
				</pre>
			),
		})
	}

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
			<Button className={className} onClick={signOut}>
				Logout
			</Button>
		)
	}
	if (!user) {
		return (
			<Button className={className} onClick={runMockLogin}>
				Login
			</Button>
		)
	}
}
