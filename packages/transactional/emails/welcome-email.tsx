import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Section,
	Tailwind,
	Text,
	Img,
	Row,
	Column,
	Button,
} from '@react-email/components';

const WelcomeEmail: React.FC<{
	firstName: string;
	lastTimeLoggedIn: Date;
}> = ({ firstName = 'Karlo', lastTimeLoggedIn = new Date() }) => {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className="mx-auto my-auto bg-white px-4 font-sans lg:px-6">
					<Container className="my-10 rounded-lg border-2 border-solid border-[#f59f0a] p-4">
						<Section>
							<Row>
								<Column>
									<Heading className="text-2xl font-semibold italic underline underline-offset-4">
										Let&apos;s get started
									</Heading>
								</Column>
								<Column>
									<Row>
										<Column align="right">
											<Text>[app name]</Text>
										</Column>
										<Column align="right">
											{/* Stavi sliku 
                      <div className="rounded-full bg-black size-10" /> */}
										</Column>
									</Row>
								</Column>
							</Row>
						</Section>
						<Hr className="!border-[#91400d]" />
						<Img
							src="https://img.freepik.com/free-vector/set-people-welcoming-illustrated_52683-36326.jpg?semt=ais_hybrid&w=740&q=80"
							className="mt-5 aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-3xl font-semibold">Hi, {firstName}</Text>
							<Text className="text-lg">
								Let&apos; get started with [app name]
							</Text>
						</Section>

						<Section className="text-center">
							{/* TODO: Karlo add app name! */}
							<Button
								href="/"
								className="mx-auto w-[calc(100%-32px)] cursor-pointer rounded bg-[#91400d] text-center leading-10 text-white"
							>
								Get started
							</Button>
						</Section>
						<Section>
							<Text className="text-base">
								Best <br /> The [app name] team
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default WelcomeEmail;
