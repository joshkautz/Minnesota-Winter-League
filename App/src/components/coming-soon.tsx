import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { cn } from '@/lib/utils'

export const ComingSoon = ({
	message,
	className,
}: {
	message: ReactNode
	className?: string
}) => {
	return (
		<Card className={cn('max-w-[800px] w-full mx-auto', className)}>
			<CardHeader className="items-center justify-center h-40 text-2xl font-bold rounded-t-lg text-background md:h-60 bg-gradient-to-r from-primary to-sky-300">
				Coming Soon
			</CardHeader>
			<CardContent>
				<p className={' pt-6 '}>{message}</p>
			</CardContent>
		</Card>
	)
}
