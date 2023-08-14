import { User, handleSignOut, handleLogin } from '@/firebase/auth'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { toast } from './ui/use-toast'

export const AuthButton = ({
	loading,
	user,
	className,
}: {
	loading: boolean
	user: User | null | undefined
	className?: string
}) => {
	const runMockLogin = async () => {
		const testData = { email: 'admin@testing.com', password: '00000000' }
		const res = await handleLogin(testData)

		toast({
			title: res.message,
			variant: res.success ? 'default' : 'destructive',
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
			<Button className={className} onClick={handleSignOut}>
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
