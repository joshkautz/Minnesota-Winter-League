import { useEffect, useState } from 'react'

const HOURS = 1000 * 60 * 60
const MINUTES = 1000 * 60

export const RegistrationCountdown = () => {
	const todaysDate = new Date()
	const futureDate = new Date('2024-11-1')

	const timerEndDate = futureDate.getTime() - todaysDate.getTime()
	const isRegistrationOpen = timerEndDate <= 0
	const [remainingTime, setRemainingTime] = useState(timerEndDate)

	useEffect(() => {
		const timerInterval = setInterval(() => {
			setRemainingTime((prevTime) => {
				if (prevTime === 0) {
					clearInterval(timerInterval)
					return 0
				} else {
					return prevTime - 1000
				}
			})
		}, 1000)

		return () => clearInterval(timerInterval)
	}, [])

	const days = Math.floor(remainingTime / (HOURS * 24))
	const hours = Math.floor((remainingTime % (HOURS * 24)) / HOURS)
	const minutes = Math.floor((remainingTime % HOURS) / MINUTES)
	const seconds = Math.floor((remainingTime % MINUTES) / 1000)

	return (
		<>
			{isRegistrationOpen ? (
				<div className="text-3xl font-bold">Registration open now!</div>
			) : (
				<div className="flex flex-col items-start">
					<div className="text-3xl font-bold">Registration opens soon!</div>
					<div className="flex mt-2 space-x-2">
						<div className="flex flex-col items-center min-w-16">
							<p className="w-full p-2 text-3xl text-center rounded-lg bg-accent dark:bg-primary text-accent-foreground dark:text-primary-foreground">
								{days}
							</p>
							<p className="text-sm font-bold">days</p>
						</div>
						<div className="flex flex-col items-center min-w-16">
							<p className="w-full p-2 text-3xl text-center rounded-lg bg-accent dark:bg-primary text-accent-foreground dark:text-primary-foreground">
								{hours}
							</p>
							<p className="text-sm font-bold">hours</p>
						</div>
						<div className="flex flex-col items-center min-w-16">
							<p className="w-full p-2 text-3xl text-center rounded-lg bg-accent dark:bg-primary text-accent-foreground dark:text-primary-foreground">
								{minutes}
							</p>
							<p className="text-sm font-bold">minutes</p>
						</div>
						<div className="flex flex-col items-center min-w-16">
							<p className="w-full p-2 text-3xl text-center rounded-lg bg-accent dark:bg-primary text-accent-foreground dark:text-primary-foreground">
								{seconds}
							</p>
							<p className="text-sm font-bold">seconds</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
