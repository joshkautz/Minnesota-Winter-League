import { ScrollArea } from './ui/scroll-area'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from './ui/card'
import { DocumentData, DocumentReference } from '@/firebase/firestore'
import { OfferType } from '@/lib/use-offer'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface NotificationCardItemProps {
	data: OfferType | DocumentData
	statusColor?: string
	message?: string
	actionOptions: { title: string; action: (arg: DocumentReference) => void }[]
}
export const NotificationCardItem = ({
	data,
	statusColor,
	message,
	actionOptions,
}: NotificationCardItemProps) => {
	const isOfferType = 'creator' in data

	return (
		<div className="flex items-end gap-2 py-2">
			{statusColor && (
				<span
					className={cn(
						'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
						statusColor
					)}
				/>
			)}
			<div className="mr-2">
				<p>
					{isOfferType ? data.playerName : `${data.firstname} ${data.lastname}`}
				</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{isOfferType
						? `${message} ${data.teamName}`
						: `is looking for a team.`}
				</p>
			</div>
			<div className="flex justify-end flex-1 gap-2">
				{actionOptions.map(({ title, action }, index) => (
					<Button
						key={`action-${index}-${title}`}
						size={'sm'}
						variant={'outline'}
						onClick={() => {
							action(data.ref)
						}}
					>
						{title}
					</Button>
				))}
			</div>
		</div>
	)
}

export const NotificationCard = ({
	title,
	description,
	children,
	scrollArea,
	className,
}: {
	title: string
	description?: string
	scrollArea?: boolean
	children: React.ReactNode
	className?: string
}) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			{scrollArea ? (
				<ScrollArea className="h-[600px]">
					<CardContent>{children}</CardContent>
				</ScrollArea>
			) : (
				<CardContent>{children}</CardContent>
			)}
		</Card>
	)
}
