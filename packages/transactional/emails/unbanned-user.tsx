// External packages
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
	Img,
	Row,
	Column,
	Link,
} from '@react-email/components';

type UnbannedUserProps = {
	firstName?: string;
};

// TODO: Dodaj slike lokalno ili na s3, nemoj prebacivati url slika
export const UnbannedUser = ({ firstName }: UnbannedUserProps) => {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className="mx-auto my-auto bg-white font-sans lg:px-6">
					<Container className="my-10 rounded-lg border-2 border-solid border-[#f59f0a] p-4">
						<Preview>Your Volontera account is active again</Preview>
						<Section>
							<Row>
								<Column>
									<Heading className="text-2xl font-semibold italic underline underline-offset-4">
										Account Unbanned
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
						<Img
							src="https://marketplace.canva.com/1FPbU/MAG2dA1FPbU/1/tl/canva-illustration-of-woman-celebrating-success-at-computer-MAG2dA1FPbU.png"
							className="aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-2xl font-semibold">
								Your account has been unbanned, {firstName}.
							</Text>
							<Text className="text-base">
								You can now use Volontera again. If you have any questions or
								concerns, please contact our support team at{' '}
								<Link
									href="mailto:karlo.webdev@gmail.com"
									className="text-blue-600 underline underline-offset-2"
								>
									karlo.webdev@gmail.com
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export default UnbannedUser;

UnbannedUser.PreviewProps = {
	firstName: 'Ana',
} satisfies UnbannedUserProps;
