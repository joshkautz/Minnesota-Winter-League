import { ReactNode } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'

export const DestructiveConfirmationDialog = ({
	children,
	title,
	description,
	cancelText,
	continueText,
	onConfirm,
}: {
	children: ReactNode
	title: ReactNode
	description: ReactNode
	cancelText?: string
	continueText?: string
	onConfirm: () => void
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText ?? 'Cancel'}</AlertDialogCancel>
					<AlertDialogAction
						className={cn(buttonVariants({ variant: 'destructive' }))}
						onClick={onConfirm}
					>
						{continueText ?? 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
