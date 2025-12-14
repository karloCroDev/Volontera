// External packages
import 'dotenv/config';
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

export const Notification: React.FC<{
	firstName: string;
}> = ({ firstName = 'Karlo' }) => {
	console.log(process.env.NEXT_PUBLIC_URL);
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
										New notifications
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
							src="https://img.freepik.com/premium-vector/notification-bell-illustration_525134-59.jpg"
							className="aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-3xl font-semibold">Hi {firstName} </Text>
							<Text className="text-base">
								We wanted to let you know that you have new notifications in
								your [app name] account.
							</Text>
						</Section>

						<Section className="text-center">
							{/* TODO: Karlo add app name! */}
							<Button
								href={`${process.env.NEXT_PUBLIC_URL}/notifications`}
								className="mx-auto w-[calc(100%-32px)] cursor-pointer rounded bg-[#91400d] text-center leading-10 text-white"
							>
								Check out now
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export default Notification;
