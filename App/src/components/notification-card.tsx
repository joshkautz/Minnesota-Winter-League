import { ScrollArea } from './ui/scroll-area'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from './ui/card'
import { DocumentData, DocumentReference } from '@/firebase/firestore'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { ExtendedOfferData, OfferData } from '@/lib/interfaces'
import { ReactNode } from 'react'

interface NotificationCardItemProps {
	data: ExtendedOfferData | DocumentData
	statusColor?: string
	message?: string
	actionOptions: {
		title: string
		action: (arg: DocumentReference<OfferData, DocumentData>) => void
	}[]
}
export const NotificationCardItem = ({
	data,
	statusColor,
	message,
	actionOptions,
}: NotificationCardItemProps) => {
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
				<p>{data.creator === 'player' ? data.playerName : data.teamName}</p>
				<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
					{`${message} ${data.teamName}`}
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
	moreActions,
	searchBar,
	footerContent,
}: {
	title?: ReactNode
	description?: string
	scrollArea?: boolean
	children: ReactNode
	className?: string
	moreActions?: ReactNode
	searchBar?: ReactNode
	footerContent?: ReactNode
}) => {
	return (
		<Card className={cn('max-w-[888px]', className)}>
			<CardHeader className="relative">
				<CardTitle className="select-none">{title}</CardTitle>
				{description && (
					<CardDescription className="select-none max-w-[600px]">
						{description}
					</CardDescription>
				)}
				{moreActions && moreActions}
				{searchBar && searchBar}
			</CardHeader>
			{scrollArea ? (
				<ScrollArea className="h-[600px]">
					<CardContent>{children}</CardContent>
				</ScrollArea>
			) : (
				<CardContent>{children}</CardContent>
			)}
			{footerContent && <CardFooter>{footerContent}</CardFooter>}
		</Card>
	)
}
