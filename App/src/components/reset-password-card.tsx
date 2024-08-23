import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ResetPassword } from './reset-password'

export const ResetPasswordCard = ({
	closeMobileSheet,
}: {
	closeMobileSheet?: () => void
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>
					Enter your email address and we will send you a link to reset your
					password.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResetPassword closeMobileSheet={closeMobileSheet} />
			</CardContent>
		</Card>
	)
}
