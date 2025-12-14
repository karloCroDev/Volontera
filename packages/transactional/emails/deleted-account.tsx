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

export const DeletedAccount: React.FC<{
	firstName: string;
}> = ({ firstName }) => {
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
										Account Deleted
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
							src="https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/602ccc72b2f2e2001df1a885.png"
							className="aspect-[4/3] w-full rounded object-cover"
						/>
						<Section className="text-center">
							<Text className="text-2xl font-semibold">
								You have successfully deleted your account, {firstName} Karlo
							</Text>
							<Text className="text-base">
								We're sorry to see you go. If you change your mind, you're
								welcome to create a new account anytime.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export default DeletedAccount;
