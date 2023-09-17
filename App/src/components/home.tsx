import { SketchLogoIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { DomeSvg } from './ui/dome-svg'
import { useAnchorScroll } from '@/lib/use-anchor-scroll'
import { Link } from 'react-router-dom'

const SnowFlake = ({ className }: { className?: string }) => {
	return (
		<svg
			width="400"
			height="400"
			viewBox="0 0 400 400"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M200 20.8333C203.315 20.8333 206.495 22.1503 208.839 24.4945C211.183 26.8387 212.5 30.0181 212.5 33.3333V69.8333L241.167 41.1666C243.536 38.9586 246.67 37.7566 249.909 37.8137C253.147 37.8709 256.237 39.1827 258.527 41.4729C260.817 43.7632 262.129 46.8529 262.186 50.0913C262.243 53.3296 261.041 56.4637 258.833 58.8333L212.5 105.167V178.35L275.867 141.767L292.833 78.4666C293.258 76.8809 293.991 75.3944 294.99 74.0919C295.989 72.7893 297.235 71.6964 298.656 70.8754C300.078 70.0543 301.647 69.5213 303.275 69.3068C304.902 69.0923 306.556 69.2004 308.142 69.625C309.727 70.0496 311.214 70.7824 312.516 71.7815C313.819 72.7806 314.912 74.0265 315.733 75.448C316.554 76.8695 317.087 78.4388 317.302 80.0663C317.516 81.6938 317.408 83.3476 316.983 84.9333L306.483 124.1L338.083 105.85C340.953 104.219 344.351 103.788 347.537 104.653C350.722 105.518 353.436 107.608 355.087 110.466C356.737 113.325 357.19 116.72 356.346 119.911C355.503 123.103 353.431 125.831 350.583 127.5L319 145.733L358.167 156.233C361.369 157.093 364.099 159.19 365.756 162.062C367.412 164.935 367.86 168.347 367 171.55C366.14 174.752 364.044 177.482 361.171 179.139C358.299 180.795 354.886 181.243 351.683 180.383L288.383 163.417L225 200L288.367 236.583L351.667 219.617C354.871 218.759 358.285 219.21 361.158 220.869C364.03 222.529 366.126 225.262 366.983 228.467C367.841 231.671 367.39 235.085 365.73 237.958C364.071 240.83 361.338 242.926 358.133 243.783L318.983 254.267L350.583 272.517C352.016 273.331 353.274 274.422 354.284 275.724C355.294 277.027 356.037 278.517 356.468 280.108C356.9 281.699 357.013 283.36 356.801 284.994C356.588 286.629 356.055 288.206 355.23 289.633C354.406 291.061 353.308 292.311 351.998 293.313C350.689 294.314 349.194 295.047 347.6 295.468C346.006 295.889 344.345 295.991 342.712 295.768C341.078 295.545 339.505 295 338.083 294.167L306.483 275.917L316.983 315.067C317.408 316.652 317.516 318.306 317.302 319.934C317.087 321.561 316.554 323.13 315.733 324.552C314.912 325.973 313.819 327.219 312.516 328.218C311.214 329.218 309.727 329.95 308.142 330.375C306.556 330.8 304.902 330.908 303.275 330.693C301.647 330.479 300.078 329.946 298.656 329.125C297.235 328.304 295.989 327.211 294.99 325.908C293.991 324.606 293.258 323.119 292.833 321.533L275.867 258.233L212.5 221.667V294.833L258.833 341.167C260.028 342.319 260.981 343.698 261.636 345.223C262.292 346.747 262.638 348.388 262.653 350.047C262.668 351.707 262.353 353.353 261.725 354.89C261.097 356.426 260.17 357.822 258.997 358.996C257.824 360.171 256.428 361.099 254.892 361.729C253.357 362.358 251.711 362.675 250.051 362.661C248.391 362.648 246.751 362.304 245.225 361.649C243.7 360.995 242.32 360.043 241.167 358.85L212.5 330.183V366.667C212.5 369.982 211.183 373.161 208.839 375.505C206.495 377.85 203.315 379.167 200 379.167C196.685 379.167 193.505 377.85 191.161 375.505C188.817 373.161 187.5 369.982 187.5 366.667V330.167L158.833 358.833C156.464 361.041 153.33 362.243 150.091 362.186C146.853 362.129 143.763 360.817 141.473 358.527C139.183 356.237 137.871 353.147 137.814 349.909C137.757 346.67 138.959 343.536 141.167 341.167L187.5 294.833V221.65L124.133 258.233L107.167 321.533C106.742 323.119 106.009 324.606 105.01 325.908C104.011 327.211 102.765 328.304 101.344 329.125C99.9222 329.946 98.3529 330.479 96.7254 330.693C95.0979 330.908 93.444 330.8 91.8583 330.375C90.2726 329.95 88.7861 329.218 87.4836 328.218C86.181 327.219 85.0881 325.973 84.267 324.552C83.446 323.13 82.913 321.561 82.6985 319.934C82.4839 318.306 82.5921 316.652 83.0167 315.067L93.5167 275.9L61.9167 294.167C59.0435 295.824 55.6295 296.273 52.4258 295.413C49.222 294.553 46.4909 292.456 44.8333 289.583C43.1757 286.71 42.7274 283.296 43.5869 280.092C44.4465 276.889 46.5435 274.158 49.4167 272.5L81.0167 254.267L41.85 243.767C40.2224 243.381 38.6889 242.672 37.3402 241.683C35.9915 240.693 34.8551 239.443 33.9983 238.007C33.1415 236.57 32.5818 234.976 32.3523 233.319C32.1227 231.662 32.2281 229.976 32.662 228.361C33.096 226.745 33.8498 225.233 34.8787 223.915C35.9077 222.596 37.1908 221.497 38.6522 220.683C40.1135 219.869 41.7234 219.357 43.3863 219.177C45.0493 218.996 46.7315 219.152 48.3333 219.633L111.633 236.583L175 200L111.633 163.417L48.3333 180.383C46.7465 180.808 45.0916 180.916 43.4631 180.701C41.8346 180.486 40.2644 179.952 38.8421 179.13C37.4198 178.309 36.1733 177.215 35.1738 175.911C34.1743 174.608 33.4413 173.12 33.0167 171.533C32.5921 169.947 32.4842 168.292 32.6991 166.663C32.9141 165.035 33.4477 163.464 34.2695 162.042C35.0913 160.62 36.1852 159.373 37.4887 158.374C38.7922 157.374 40.2799 156.641 41.8667 156.217L81.0167 145.733L49.4167 127.5C47.994 126.679 46.747 125.586 45.7467 124.284C44.7464 122.981 44.0125 121.494 43.5869 119.908C43.1613 118.321 43.0523 116.667 43.2662 115.038C43.4801 113.41 44.0126 111.839 44.8333 110.417C45.6541 108.994 46.747 107.747 48.0497 106.747C49.3525 105.746 50.8394 105.013 52.4258 104.587C55.6295 103.727 59.0435 104.176 61.9167 105.833L93.5 124.1L83 84.95C82.1425 81.7453 82.5931 78.3312 84.2528 75.4588C85.9125 72.5863 88.6453 70.4908 91.85 69.6333C95.0547 68.7758 98.4688 69.2264 101.341 70.8861C104.214 72.5458 106.309 75.2786 107.167 78.4833L124.117 141.783L187.5 178.333V105.167L141.167 58.8333C138.959 56.4637 137.757 53.3296 137.814 50.0913C137.871 46.8529 139.183 43.7632 141.473 41.4729C143.763 39.1827 146.853 37.8709 150.091 37.8137C153.33 37.7566 156.464 38.9586 158.833 41.1666L187.5 69.8333V33.3333C187.5 30.0181 188.817 26.8387 191.161 24.4945C193.505 22.1503 196.685 20.8333 200 20.8333Z"
			/>
		</svg>
	)
}

export const Home = () => {
	useAnchorScroll()
	return (
		<div className={'w-full'}>
			<section id="welcome" className={'h-[80vh] max-h-[620px] container'}>
				<div className="flex flex-col items-stretch h-full md:flex-row justify-stretch">
					<div className="flex-1 mt-8">
						<div className={'flex flex-col gap-4 pt-16 pb-2 max-w-[680px]'}>
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

						<div className={'mt-12 max-w-[490px] flex-1'}>
							Join us this season for unforgettable Saturday nights of organized
							league play. Whether you're a seasoned club veteran, or a rookie
							in college,{' '}
							<span className={'font-bold'}>
								we can't wait to welcome you to the league.
							</span>
						</div>
					</div>

					<DomeSvg
						className={'max-w-[620px] invisible relative sm:visible flex-1'}
					/>
				</div>
			</section>

			<div className={'w-full min-h-screen text-background bg-foreground'}>
				<section id="league-details" className={'container pb-40'}>
					<div className="flex flex-row">
						<SnowFlake className="-mt-32 max-w-[400px] flex flex-1 basis-[80px] shrink-0 fill-accent" />

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
								'flex flex-col flex-1 basis-[320px] shrink-0 rounded-2xl bg-foreground text-background'
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

			<div>
				<section
					id="why-join"
					className={
						'relative bg-accent text-accent-foreground min-h-[600px] rounded-2xl max-w-[1200px] mx-auto -mt-20 p-8 lg:py-24 lg:px-24'
					}
				>
					<div className={' flex flex-col gap-8 max-w-[800px] mx-auto'}>
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
						<div className={'mt-8 text-2xl font-light '}>
							Whether you're perfecting your throws, working on your defense, or
							just out to have a great time,{' '}
							<span className={'font-bold'}>
								Minneapolis Winter League is the place to be.
							</span>
						</div>
					</div>
					<div className="absolute right-0 invisible md:visible -bottom-52 xl:-bottom-52 xl:-right-32">
						<SnowFlake className="fill-foreground max-w-[150px] xl:max-w-[300px]" />
					</div>
				</section>
			</div>

			<div className={'container'}>
				<section
					id="how-to-register"
					className={'my-32 flex justify-center items-stretch gap-8'}
				>
					<div className="flex items-center justify-center flex-1 rounded-lg overflow-clip bg-secondary max-w-[500px]">
						<img src="/Map.png" />
					</div>
					<div className="flex flex-col flex-1 gap-2 my-auto max-w-[500px]">
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
