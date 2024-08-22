import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	ToastForever,
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
			<ToastForever variant={'warning'}>
				<div className="grid gap-1">
					<ToastTitle>{'Website is under active development!'}</ToastTitle>
					<ToastDescription>
						{'Your changes will be lost. Come back later.'}
					</ToastDescription>
				</div>
			</ToastForever>

			<ToastViewport />
		</ToastProvider>
	)
}
