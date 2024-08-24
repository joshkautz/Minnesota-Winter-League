import { PersonIcon, SketchLogoIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Snowflake } from './snowflake'

import { Footer } from './footer'
import { HeroSection } from './hero-section'

export const Home = () => {
	return (
		<div className={'w-full'}>
			<HeroSection />

			<div
				className={
					'w-full min-h-screen bg-background text-foreground dark:text-background dark:bg-foreground'
				}
			>
				<section id="league-details" className={'container pb-40'}>
					<div className="flex flex-row">
						<Snowflake className="-mt-32 max-w-[400px] flex-1 basis-[80px] shrink-0 fill-accent z-10 hidden lg:flex" />

						<div className={'flex flex-col flex-2 items-end gap-2 pt-24'}>
							<p className={'text-4xl font-bold max-w-[800px]'}>
								Our league is about community, growth, competition, and a whole
								lot of fun.
							</p>
							<div className="max-w-[800px] h-1 w-full flex items-start lg:justify-center justify-start">
								<div
									className={
										'mr-16 w-full max-w-[300px] lg:max-w-[475px] h-1 rounded bg-gradient-to-r from-primary to-sky-300'
									}
								/>
							</div>
						</div>
					</div>
					<div className={'flex flex-wrap items-center gap-20 mt-32 w-full'}>
						<Card
							className={
								'flex flex-col flex-1 basis-[320px] shrink-0 rounded-2xl bg-foreground text-background dark:bg-background dark:text-foreground'
							}
						>
							<CardHeader>
								<CardTitle className={'text-2xl font-bold self-center'}>
									Dates + Details
								</CardTitle>
							</CardHeader>
							<CardContent className={'flex flex-col gap-4'}>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>What:</p>
									<span>5v5 Open Ultimate on Turf Fields</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>When:</p>
									<span>
										Saturdays from 6:00 PM to 9:00 PM during November (4th,
										11th, and 18th) and December (2nd, 9th, and 16th)
									</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>Where:</p>
									<span>
										<a
											href="https://maps.app.goo.gl/avAamyReCbGmz8jWA"
											target="_blank"
											rel="noreferrer"
										>
											<u>University of Minnesota | URW Sports Field Complex</u>
										</a>
									</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>Skill:</p>
									<span>Open to all skill levels</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>Games:</p>
									<span>Two 40-minute games every Saturday</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>Cost:</p>
									<span>Just $10/person per night</span>
								</div>
							</CardContent>
						</Card>
						<div
							className={
								'flex flex-col flex-1 gap-12 p-8 basis-[320px] shrink-0'
							}
						>
							<div className={'flex flex-col gap-4'}>
								<p className={'text-2xl font-bold'}>Individuals</p>
								<p>
									{`If you're a solo player looking for a team, don't worry! We'll
									help you find a team up to play with for the season! `}
									<Link to={'/#how-to-register'}>
										<u>Learn more about registration below.</u>
									</Link>
								</p>
							</div>
							<div className={'flex flex-col gap-4'}>
								<p className={'text-2xl font-bold'}>Teams</p>
								<p>
									Minneapolis Winter League has room for <b>12 teams.</b> Be
									sure to register your team before space fills up. There is a{' '}
									<b>10-player minimum</b> requirement for teams, with no roster
									maximum. The first 12 teams to meet this requirement will be
									successfully locked in. All other players have the option to:
								</p>
								<ul>
									<li>1. Request a roster spot on an existing team.</li>
									<li>
										2. Do nothing, and be fully refunded when the league starts.
									</li>
								</ul>
								<p>
									Check the{' '}
									<Link to={'/teams'}>
										<u>Teams</u>
									</Link>{' '}
									page to see how many teams are currently locked in.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			<div className="border border-transparent bg-foreground dark:bg-background">
				<section
					id="why-join"
					className={
						'relative bg-accent text-accent-foreground min-h-[600px] rounded-2xl max-w-[968px] mx-auto -mt-20 p-8 lg:py-16 lg:px-0'
					}
				>
					<div className={'flex flex-col gap-8 max-w-[800px] mx-auto'}>
						<div className={'text-4xl font-bold '}>Why Join?</div>
						<div className={'flex flex-row gap-4'}>
							<div>
								<PersonIcon className={'w-8 h-8'} />
							</div>
							<div className={'flex flex-col gap-2'}>
								<div className={'text-2xl font-bold'}>Friends</div>
								<p>
									Form your own team with friends, or join as an individual, and
									experience the camaraderie of sportsmanship against a variety
									of players in the area.
								</p>
							</div>
						</div>

						<div className={'flex flex-row gap-4'}>
							<div>
								<SketchLogoIcon className={'w-8 h-8'} />
							</div>
							<div className={'flex flex-col gap-2'}>
								<div className={'text-2xl font-bold'}>Competition</div>
								<div>
									The league is open to all skill levels, and is focused on
									making sure everyone has valuable opportunities during the
									winter months to continue playing, improving, and competing.
									Weekly play will be organized, and results will be used to
									ensure that teams are matched up against opponents of similar
									skill levels. At the end of the season, the top teams will
									compete to determine the league champion, while the other
									teams will continue with regular games!
								</div>
							</div>
						</div>
						<div className={'mt-8 text-2xl font-light '}>
							{`Whether you're perfecting your throws, working on your defense, or
							just out to have a great time, `}
							<span className={'font-bold'}>
								Minneapolis Winter League is the place to be.
							</span>
						</div>
					</div>
					<div className="absolute right-0 invisible md:visible -bottom-52 2xl:-bottom-52 2xl:-right-32">
						<Snowflake className="fill-background dark:fill-foreground max-w-[150px] 2xl:max-w-[300px]" />
					</div>
				</section>
			</div>

			<div
				className={
					'border border-transparent container dark:text-foreground dark:bg-background text-background bg-foreground'
				}
			>
				<section
					id="how-to-register"
					className={
						'my-32 flex justify-center md:items-stretch gap-8 flex-col md:flex-row items-center'
					}
				>
					<div className="flex items-center justify-center flex-1 rounded-lg overflow-clip bg-secondary max-w-[500px]">
						<img src="/Map.png" />
					</div>
					<div className="flex flex-col flex-1 gap-2 my-auto max-w-[500px]">
						<p className="pb-2 text-2xl font-bold">How to Register</p>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent text-foreground dark:text-background flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								1
							</span>
							<p>{`Click on the "Login" button to register and log in.`}</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent text-foreground dark:text-background flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								2
							</span>
							<p>
								Confirm your email address by clicking on the link in the email.
							</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent text-foreground dark:text-background flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								3
							</span>
							<p>
								{`Click on the "Register" button on your Profile to submit
								payment.`}
							</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent text-foreground dark:text-background flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								4
							</span>
							<p>
								Request to join an existing team, accept an invitation from an
								existing team, or create your own team.
							</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent text-foreground dark:text-background flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								5
							</span>
							<p>Await confirmation and league updates via email.</p>
						</div>
					</div>
				</section>

				<div
					className={
						'flex flex-col gap-2 pb-8 items-center max-w-[1040px] mx-auto'
					}
				>
					<p className={'text-2xl max-w-[1040px] mx-auto'}>
						{`Don't miss out on this opportunity to keep playing year-round.
						Secure your spot today, and let's make this season of the
						Minneapolis Winter League one to remember!`}
					</p>
				</div>

				<div className="max-w-[1040px] mx-auto flex items-center justify-start pb-24">
					<p className="text-2xl font-bold">See you on the field!</p>
				</div>
			</div>

			<Footer />
		</div>
	)
}
