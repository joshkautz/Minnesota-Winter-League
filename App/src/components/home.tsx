import { SketchLogoIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { DomeSvg } from './ui/dome-svg'

export const Home = () => {
	return (
		<div className="w-full">
			<section id="welcome" className="h-[80vh] max-h-[620px] container">
				<div className="flex flex-col gap-4 pt-16 pb-8 max-w-[680px]">
					<p className="text-5xl font-bold">Welcome To Winter League</p>
					<p className="text-2xl font-light capitalize">
						Get ready for action-packed evenings filled with thrilling frisbee
						matches.
					</p>
				</div>
				<div className="w-[220px] h-1 rounded bg-gradient-to-r from-primary to-sky-300" />
				<p className="mt-12 max-w-[490px]">
					Join us this season for unforgettable Saturday nights of frisbee
					action. Whether you're in it for the love of the game, the chance to
					win, or simply to enjoy the company of fellow frisbee enthusiasts,{' '}
					<span className="font-bold">
						we can't wait to welcome you to the league.
					</span>
				</p>

				<DomeSvg className="max-w-[720px] invisible absolute sm:visible sm:-translate-y-1/6 lg:-translate-y-[75%] lg:top-1/2 left-1/2" />
			</section>

			<div className="w-full min-h-screen text-background bg-foreground">
				<section id="league-details" className="container pb-40">
					<div className="flex flex-col items-end gap-2 pt-24">
						<p className="text-4xl font-bold capitalize max-w-[800px]">
							Our league is all about sportsmanship, friendly competition, and a
							whole lot of fun.
						</p>
						<div className="w-[340px] h-1 rounded bg-gradient-to-r from-primary to-sky-300" />
					</div>
					<div className="flex flex-wrap items-center gap-20 mt-40">
						<Card className="flex flex-col flex-1 basis-[400px] shrink-0 rounded-2xl">
							<CardHeader>
								<CardTitle className="text-2xl font-bold">
									League Details
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex">
									<p className="w-16 mr-2 font-bold">When:</p>
									<span>
										Saturdays from 6:00 PM to 9:00 PM during November and
										December
									</span>
								</div>
								<div className="flex">
									<p className="w-16 mr-2 font-bold">What:</p>
									<span>5v5 Indoor Open Ultimate League</span>
								</div>
								<div className="flex">
									<p className="w-16 mr-2 font-bold">Where:</p>
									<span>
										University of Minnesota | URW Sports Field Complex
									</span>
								</div>
								<div className="flex">
									<p className="w-16 mr-2 font-bold">Skill:</p>
									<span>Open to all skill levels</span>
								</div>
								<div className="flex">
									<p className="w-16 mr-2 font-bold">Games:</p>
									<span>Two 45-minute games every night</span>
								</div>
								<div className="flex">
									<p className="w-16 mr-2 font-bold">Cost:</p>
									<span>Just $60 per person for 6 nights of play</span>
								</div>
							</CardContent>
						</Card>
						<div className="flex flex-col flex-1 gap-12 p-8 basis-[400px] shrink-0">
							<div className="flex flex-col gap-4">
								<p className="text-2xl font-bold">Individual Players</p>
								<p>
									If you're a solo player looking for a team, don't worry! We'll
									help you find like-minded individuals to team up with and
									create a squad that's ready to dominate the frisbee field.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<p className="text-2xl font-bold">Team Captains</p>
								<p>
									In its inaugural year, the league has room for 12 teams. Act
									fast and register your team before space fills up. There is a
									10-player minimum for teams, with no roster limit. Team
									registration requires a flat $100 fee for participation. Team
									captains, assemble your dream team and sign up together to
									ensure your place in the league. Show off your strategic
									skills and lead your team to victory!
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			<div className="">
				<section
					id="why-join"
					className="bg-accent min-h-[600px] rounded-2xl  max-w-[1200px] mx-auto -mt-20 p-8 lg:py-24 lg:px-24"
				>
					<div className="flex flex-col gap-8 max-w-[800px] mx-auto">
						<div className="text-4xl font-bold capitalize">Why Join Us?</div>
						<div className="flex flex-row gap-4">
							<div className="">
								<SketchLogoIcon className="w-8 h-8" />
							</div>
							<div className="flex flex-col gap-2">
								<div className="text-2xl font-bold">Friends</div>
								<p>
									Form your own team with friends or join as an individual, and
									experience the camaraderie of sportsmanship against a variety
									of competitors.
								</p>
							</div>
						</div>

						<div className="flex flex-row gap-4">
							<div className="">
								<SketchLogoIcon className="w-8 h-8" />
							</div>
							<div className="flex flex-col gap-2">
								<div className="text-2xl font-bold">Competition</div>
								<div>
									The league is open to all skill levels, and is focused on
									making sure everone has valuable off-season opportunities to
									continue playing, improving, and competing. Weekly play will
									be organized, and results will be used to ensure that teams
									are matched up against opponents of similar skill levels. At
									the end of the season, the top teams will compete in a playoff
									tournament to determine the league champion!
								</div>
							</div>
						</div>
						<div className="mt-8 text-2xl font-light capitalize">
							Whether you're perfecting your throws, working on your defense, or
							just out to have a great time,{' '}
							<span className="font-bold">
								The Saturday Frisbee League is the place to be.
							</span>
						</div>
					</div>
				</section>
			</div>

			<section id="how-to-register">
				<h2>How to Register</h2>
				<ol>
					<li>Click on the "Register" button.</li>
					<li>Choose whether you're registering as an individual or a team.</li>
					<li>Complete the registration form with your details.</li>
					<li>Make your payment securely online.</li>
					<li>Await confirmation and league updates via email.</li>
				</ol>
			</section>

			<footer>
				<p>
					Join us this season for unforgettable Saturday nights of frisbee
					action. Whether you're in it for the love of the game, the chance to
					win, or simply to enjoy the company of fellow frisbee enthusiasts, we
					can't wait to welcome you to the league.
				</p>
				<p>
					Don't miss out on this opportunity to be a part of something special.
					Secure your spot today, and let's make this season of the Saturday
					Frisbee League one to remember!
				</p>
				<p>
					Got questions or need assistance? Contact us at{' '}
					<a href="mailto:contact@example.com">contact@example.com</a> or call{' '}
					<a href="tel:+123456789">123-456-789</a>.
				</p>
				<p>See you on the field!</p>
			</footer>
		</div>
	)
}
