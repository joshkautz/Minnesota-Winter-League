import { SketchLogoIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { DomeSvg } from './ui/dome-svg'
import { useAnchorScroll } from '@/lib/use-anchor-scroll'
import { Link } from 'react-router-dom'

export const Home = () => {
	useAnchorScroll()
	return (
		<div className={'w-full'}>
			<section id="welcome" className={'h-[80vh] max-h-[620px] container'}>
				<div className="flex flex-col items-stretch h-full md:flex-row justify-stretch">
					<div className="flex-1">
						<div className={'flex flex-col gap-4 pt-16 pb-8 max-w-[680px]'}>
							<p className={'text-5xl font-bold'}>Minneapolis Winter League</p>
							<p className={'text-2xl font-light '}>
								Bundle up, lace up your cleats, and experience Minneapolis
								winter ultimate like never before.
							</p>
						</div>
						<div
							className={
								'w-[220px] h-1 rounded bg-gradient-to-r from-primary to-sky-300'
							}
						/>
						<div className="flex flex-col">
							<p className={'mt-12 max-w-[490px] flex flex-1 flex-col'}>
								Join us this season for unforgettable Saturday nights of
								organized league play. Whether you're a seasoned club veteran,
								or a rookie in college,{' '}
								<span className={'font-bold'}>
									we can't wait to welcome you to the league.
								</span>
							</p>
						</div>
					</div>

					<DomeSvg
						className={'max-w-[620px] invisible relative sm:visible flex-1'}
					/>
				</div>
			</section>

			<div className={'w-full min-h-screen text-background bg-foreground'}>
				<section id="league-details" className={'container pb-40'}>
					<div className={'flex flex-col items-end gap-2 pt-24'}>
						<p className={'text-4xl font-bold  max-w-[800px]'}>
							Our league is about community, growth, competition, and a whole
							lot of fun.
						</p>
						<div
							className={
								'self-center lg:translate-x-1/2 w-full lg:max-w-[475px] h-1 rounded bg-gradient-to-r from-primary to-sky-300'
							}
						/>
					</div>
					<div className={'flex flex-wrap items-center gap-20 mt-40 w-full'}>
						<Card
							className={
								'flex flex-col flex-1 basis-[320px] shrink-0 rounded-2xl'
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
										Saturdays from 6:00 PM to 9:00 PM during November and
										December
									</span>
								</div>
								<div className={'flex'}>
									<p className={'w-16 mr-2 font-bold'}>Where:</p>
									<span>
										<a
											href="https://maps.app.goo.gl/avAamyReCbGmz8jWA"
											target="_blank"
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
									If you're a solo player looking for a team, don't worry! We'll
									help you find a team up to play with for the season!{' '}
									<Link to={'/#how-to-register'}>
										<u>Learn more about registration below.</u>
									</Link>
								</p>
							</div>
							<div className={'flex flex-col gap-4'}>
								<p className={'text-2xl font-bold'}>Teams</p>
								<p>
									Minneapolis Winter League has room for <b>12 teams.</b> Be
									sure to register your team before space fills up. There is a
									10-player minimum for teams, with no roster limit. The cost to
									register a team is $100. Be sure to check the Teams page to
									see how many teams are currently registered.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			<div className={''}>
				<section
					id="why-join"
					className={
						'bg-accent text-accent-foreground min-h-[600px] rounded-2xl max-w-[1200px] mx-auto -mt-20 p-8 lg:py-24 lg:px-24'
					}
				>
					<div className={'flex flex-col gap-8 max-w-[800px] mx-auto'}>
						<div className={'text-4xl font-bold '}>Why Join?</div>
						<div className={'flex flex-row gap-4'}>
							<div className={''}>
								<SketchLogoIcon className={'w-8 h-8'} />
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
									making sure everone has valuable opportunities during the
									winter months to continue playing, improving, and competing.
									Weekly play will be organized, and results will be used to
									ensure that teams are matched up against opponents of similar
									skill levels. At the end of the season, the top teams will
									compete to determine the league champion, while the other
									teams will continue with regular games!
								</div>
							</div>
						</div>
						<div className={'flex flex-row gap-4'}>
							<img src="/Map.png" />
						</div>
						<div className={'mt-8 text-2xl font-light '}>
							Whether you're perfecting your throws, working on your defense, or
							just out to have a great time,{' '}
							<span className={'font-bold'}>
								Minneapolis Winter League is the place to be.
							</span>
						</div>
					</div>
				</section>
			</div>

			<div className={'container'}>
				<section
					id="how-to-register"
					className={'my-32 flex justify-center items-stretch gap-8'}
				>
					<div className="flex items-center justify-center flex-1 rounded-md bg-secondary max-w-[500px]">
						Logo
					</div>
					<div className="flex flex-col flex-1 gap-2 py-2 max-w-[500px]">
						<p className="pb-2 text-2xl font-bold">How to Register</p>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								1
							</span>
							<p>Click on the "Login" button to register and log in.</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
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
									'bg-accent flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
								}
							>
								3
							</span>
							<p>
								Click on the "Register" button on your Profile to submit
								payment.
							</p>
						</div>
						<div className={'w-full flex'}>
							<span
								className={
									'bg-accent flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
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
									'bg-accent flex flex-shrink-0 w-4 h-4 mt-2 mr-2 text-xs items-center justify-center font-bold rounded-full -translate-y-0.5'
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
						'flex flex-col gap-2 pb-24 items-center max-w-[1040px] mx-auto'
					}
				>
					<p className={'text-2xl max-w-[1040px] mx-center'}>
						Don't miss out on this opportunity to keep playing year-round.
						Secure your spot today, and let's make this season of the
						Minneapolis Winter League one to remember!
					</p>

					<div
						className={
							'self-start max-w-[640px] w-full h-1 rounded bg-gradient-to-r from-primary to-sky-300'
						}
					/>
				</div>

				<div className="flex items-center justify-center pb-24">
					<p className="text-4xl font-bold ">See you on the field!</p>
				</div>
				<p></p>
			</div>

			<footer className="bg-foreground text-background h-[400px] flex flex-col items-center justify-center gap-8">
				<p>Thank you for helping to make this league possible</p>
				<div className="container flex items-center justify-center gap-8">
					<div>
						<a
							href="http://mplsmallard.com/"
							target="_blank"
							title="Minneapolis Mallard"
						>
							<img
								src="https://pbs.twimg.com/profile_images/1639001836240752661/sgd0f6W2_400x400.jpg"
								alt="Minneapolis Mallard"
								width={100}
							/>
						</a>
					</div>
					<div>
						<a
							href="https://theaudl.com/windchill"
							target="_blank"
							title="Minnesota Wind Chill"
						>
							<img
								src="https://pbs.twimg.com/profile_images/1481722101824475143/c_dxHt-p_400x400.jpg"
								alt="Minnesota Wind Chill"
								width={100}
							/>
						</a>
					</div>
					<div>
						<a
							href="https://www.novacare.com/"
							target="_blank"
							title="NovaCare Rehabilitation"
						>
							<img
								src="data:image/png;base64,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"
								alt="NovaCare Rehabilitation"
								width={100}
							/>
						</a>
					</div>
				</div>
				<p>
					Got questions or need assistance? Contact us at{' '}
					<a href="mailto:leadership@mplsmallard.com">
						<u>leadership@mplsmallard.com</u>
					</a>
					.
				</p>
			</footer>
		</div>
	)
}
