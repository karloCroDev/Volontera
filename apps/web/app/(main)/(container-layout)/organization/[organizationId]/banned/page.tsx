// External packages
import { ArrowLeft, Ban, MessageCircle } from 'lucide-react';

// Components
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';

export default async function BannedPage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Ban className="text-destructive size-80" />

			<div className="mt-8 flex flex-col gap-4 lg:mt-10 lg:flex-row lg:gap-6">
				<div className="max-w-3xl">
					<h1 className="text-balance text-4xl font-semibold">
						You have been banned from activities in this organization
					</h1>
					<p className="text-muted-foreground mt-2">
						Please contact the organization owner for more information:
					</p>
				</div>
				<Container className="flex flex-col gap-4 rounded-md p-6">
					<LinkAsButton
						href="/home"
						variant="outline"
						colorScheme="yellow"
						size="sm"
						iconRight={<MessageCircle />}
						isFullyRounded
						className="self-center"
						iconLeft={
							<Avatar
								imageProps={
									{
										// src: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${user.image}`,
									}
								}
								size="sm"
							>
								{/* {convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
							})} */}
								Ana Horvat
							</Avatar>
						}
					>
						<div className="flex flex-col items-start">
							<p>
								{/* {convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
							})} */}
								Ana Horvat
							</p>
							<p className="text-muted-foreground text-xs">
								{/* {user.role === 'ORGANIZATION' ? 'Organization' : 'Volunteer'} |{' '}
						{convertToPascalCase(user.subscriptionTier)} */}
								Organization | Pro
							</p>
						</div>
					</LinkAsButton>
					<Separator />

					<LinkAsButton
						href="/home"
						iconLeft={<ArrowLeft />}
						className="self-center"
					>
						Go back home
					</LinkAsButton>
				</Container>
			</div>
		</div>
	);
}
