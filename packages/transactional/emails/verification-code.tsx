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
	Row,
	Column,
} from '@react-email/components';

export const VerificationCode: React.FC<{
	verificationCode: string;
}> = ({ verificationCode }) => {
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
										Verification code
									</Heading>
								</Column>
								<Column>
									<Row>
										<Column align="right">
											<Text>Volontera</Text>
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
						<Text className="mt-6 text-base">
							Thank you for logging in again on [app nane]. We want to make sure
							it&apos;s really you. Please enter the following verification code
							when prompted.
						</Text>

						<Section>
							<Text className="text-center text-base font-semibold">
								Your verification code is:
							</Text>
							<Text className="text-center text-3xl font-semibold text-[#91400d]">
								{verificationCode}
							</Text>
							<Text className="text-center text-sm">
								(After 10 minutes the code will expire)
							</Text>
						</Section>
						<Text></Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default VerificationCode;
