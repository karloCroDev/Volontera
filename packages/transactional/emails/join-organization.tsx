// External packages
import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

// USER-INVATATION JE JEDINA ZNAČAJKA KOJA JOŠ NIJE IMPLEMENTIRANA!!! (nije u dokumentaciji ni nigdje drugdje spomenuta, samo je UI emaila i stranice napravljen, ali ništa drugo osim toga)

type JoinOrganizationProps = {
	username?: string;
	userImage?: string;
	invitedByUsername?: string;
	invitedByEmail?: string;
	organizationName?: string;
	organizationImage?: string;
};

function getInitial(name?: string) {
	return name?.charAt(0).toUpperCase() || '';
}

export const JoinOrganization = ({
	username,
	userImage,
	invitedByUsername,
	invitedByEmail,
	organizationName,
	organizationImage,
}: JoinOrganizationProps) => {
	const previewText = `Join ${invitedByUsername ?? 'a teammate'} on Volontera`;

	const hasUserImage = Boolean(userImage?.trim());
	const hasOrganizationImage = Boolean(organizationImage?.trim());
	const userInitial = getInitial(username);
	const organizationInitial = getInitial(organizationName);

	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className="mx-auto my-auto bg-white font-sans lg:px-6">
					<Container className="my-10 rounded-lg border-2 border-solid border-[#f59f0a] p-4">
						<Preview>{previewText}</Preview>
						<Section>
							<Row>
								<Column>
									<Heading className="text-2xl font-semibold italic underline underline-offset-4">
										Join {organizationName}
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

						<Container className="mx-auto my-[40px] max-w-[465px] rounded">
							<Section className="mt-[32px]">
								<Img
									// src={`${baseUrl}/static/volontera-logo.png`}
									width="40"
									height="37"
									alt="Volontera Logo"
									className="mx-auto my-0"
								/>
							</Section>
							<Heading className="mx-0 p-0 text-center font-normal text-black">
								Join organization <strong>{organizationName}</strong> on{' '}
								<strong>Volontera</strong>
							</Heading>
							<Text className="text-[14px] leading-[24px] text-black">
								Hello {username},
							</Text>
							<Text className="text-[14px] leading-[24px] text-black">
								<strong>{invitedByUsername}</strong> (
								<Link
									href={`mailto:${invitedByEmail}`}
									className="text-blue-600 no-underline"
								>
									{invitedByEmail}
								</Link>
								) has invited you to the <strong>{organizationName}</strong>{' '}
								organization on <strong>Volontera</strong>.
							</Text>
							<Section>
								<Row>
									<Column align="right">
										{hasUserImage ? (
											<Img
												className="rounded-full"
												src={userImage}
												width="64"
												height="64"
												alt={`${username ?? 'User'} profile picture`}
											/>
										) : (
											<div className="inline-block h-[64px] w-[64px] rounded-full bg-[#91400d] text-center text-[28px] leading-[64px] text-white">
												{userInitial}
											</div>
										)}
									</Column>
									<Column align="center">
										<Img
											// src={`${baseUrl}/static/volontera-arrow.png`}
											// TODO: Add Volontera image
											width="12"
											height="9"
											alt="Arrow indicating invitation"
										/>
									</Column>
									<Column align="left">
										{hasOrganizationImage ? (
											<Img
												className="rounded-full"
												src={organizationImage}
												width="64"
												height="64"
												alt={`${organizationName ?? 'Organization'} logo`}
											/>
										) : (
											<div className="inline-block h-[64px] w-[64px] rounded-full bg-[#f59f0a] text-center text-[28px] leading-[64px] text-black">
												{organizationInitial}
											</div>
										)}
									</Column>
								</Row>
							</Section>
							<Section className="mb-[32px] mt-[32px] text-center">
								<Button
									href={`${process.env.NEXT_PUBLIC_URL}/invatation-link`}
									className="mx-auto w-[calc(100%-32px)] cursor-pointer rounded bg-[#91400d] text-center leading-10 text-white"
								>
									Join the organization
								</Button>
							</Section>
						</Container>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

JoinOrganization.PreviewProps = {
	username: 'Ana',
	userImage: '',
	invitedByUsername: 'Karlo',
	invitedByEmail: 'karlo@example.com',
	organizationName: 'Save Marjan',
	organizationImage: '',
} satisfies JoinOrganizationProps;

export default JoinOrganization;
