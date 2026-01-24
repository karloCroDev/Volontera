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
	Button,
} from '@react-email/components';

export const ForgotPassword: React.FC<{
	link: string;
}> = ({ link }) => {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className="mx-auto my-auto bg-white font-sans lg:px-6">
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
							src="https://cdn.vectorstock.com/i/500p/24/67/reset-password-concept-man-holding-keys-forgot-vector-37352467.jpg"
							className="aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-3xl font-semibold">Reset password</Text>
							<Text className="text-base">
								Don't worry! It happens to the best of us. Click the button
								below to reset your password and regain access to your account.
							</Text>
						</Section>

						<Section className="text-center">
							<Button
								href={link}
								className="mx-auto w-[calc(100%-32px)] cursor-pointer rounded bg-[#91400d] text-center leading-10 text-white"
							>
								Reset password
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export default ForgotPassword;
