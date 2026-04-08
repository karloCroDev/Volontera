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

type BannedUserProps = {
	firstName?: string;
};

// TODO: Dodaj slike lokalno ili na s3, nemoj prebacivati url slika
export const BannedUser = ({ firstName }: BannedUserProps) => {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className="mx-auto my-auto bg-white font-sans lg:px-6">
					<Container className="my-10 rounded-lg border-2 border-solid border-[#f59f0a] p-4">
						<Preview>Important update about your Volontera account</Preview>
						<Section>
							<Row>
								<Column>
									<Heading className="text-2xl font-semibold italic underline underline-offset-4">
										Account Banned
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
							src="https://cdn.hashnode.com/res/hashnode/image/upload/v1730432079765/693e74bb-dbe4-4426-a3f4-3dd3bddc9dd3.jpeg"
							className="aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-2xl font-semibold">
								You have violated our terms of service, {firstName}.
							</Text>
							<Text className="text-base">
								You have been violated our terms of service and have been banned
								from using Volontera. If you think this is a mistake, please
								contact our support team for more information. We are here to
								help you and resolve any issues you may have. Contact us at{' '}
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
export default BannedUser;

BannedUser.PreviewProps = {
	firstName: 'Ana',
} satisfies BannedUserProps;
