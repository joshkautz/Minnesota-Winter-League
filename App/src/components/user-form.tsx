import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserSignup } from './user-signup'
import { UserLogin } from './user-login'

export const UserForm = () => {
	return (
		<Tabs defaultValue={'login'} className={'min-w-[340px]'}>
			<TabsList className={'grid w-full grid-cols-2'}>
				<TabsTrigger value={'login'}>Login</TabsTrigger>
				<TabsTrigger value={'signup'}>Sign up</TabsTrigger>
			</TabsList>
			<TabsContent value={'login'}>
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Welcome back</CardDescription>
					</CardHeader>
					<CardContent>
						<UserLogin />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value={'signup'}>
				<Card>
					<CardHeader>
						<CardTitle>Sign up</CardTitle>
						<CardDescription>Create a new account</CardDescription>
					</CardHeader>
					<CardContent>
						<UserSignup />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
