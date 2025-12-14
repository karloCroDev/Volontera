// External packages
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
} from '@react-email/components';

export const RecentLogin: React.FC<{
	firstName: string;
	lastTimeLoggedIn: Date;
}> = ({ firstName, lastTimeLoggedIn }) => {
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
										Recent login
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
							src="https://media.istockphoto.com/id/538595396/vector/safe-vector-icon-in-a-flat-style.jpg?s=612x612&w=0&k=20&c=1OnEl40vBy_iMLsxHAe0xMcKbRYPAYyUOxnYHpR-NvQ="
							className="aspect-[4/3] w-full object-cover"
						/>
						<Section className="text-center">
							<Text className="text-3xl font-semibold">Hi {firstName}</Text>
							<Text className="text-lg">
								We noticed a recent login to your [app name] account.{' '}
							</Text>
						</Section>

						<Section className="text-center">
							<Text className="text-lg text-[#91400d]">
								Time:
								<span className="ml-2 italic">
									{`${lastTimeLoggedIn.getHours()}:${lastTimeLoggedIn.getMinutes()} | ${lastTimeLoggedIn.getDate()}.${lastTimeLoggedIn.getMonth()}${lastTimeLoggedIn.getFullYear()}`}
								</span>
							</Text>
						</Section>
						<Section>
							<ul>
								<li>
									If this was you, there&apos;s nothing else you need to do.
								</li>
								<li className="mt-2">
									If this wasn&apos;t you or if you have additional questions,
									please see our support page.
								</li>
							</ul>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default RecentLogin;
