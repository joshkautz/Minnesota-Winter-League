import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	// ToastForever,
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export const Toaster = () => {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				)
			})}
			{/* Commenting out, may need to use again later */}
			{/* <ToastForever variant={'warning'}>
				<div className="grid gap-1">
					<ToastTitle>{'Website is under active development!'}</ToastTitle>
					<ToastDescription>
						{'Your changes will be lost. Come back later.'}
					</ToastDescription>
				</div>
				<ToastClose className="text-danger hover:text-danger" />
			</ToastForever> */}
			<ToastViewport />
		</ToastProvider>
	)
}
