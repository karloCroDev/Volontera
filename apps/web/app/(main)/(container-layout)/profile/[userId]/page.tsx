// External packages
import { MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';
import { ListPosts } from '@/modules/main/public-profile/list-posts';

// Lib
import { getUserData, getSession } from '@/lib/server/user';
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { ListOrganizations } from '@/modules/main/public-profile/list-organization';

export default async function PublicProfilePage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;

	const [user, session] = await Promise.all([
		getUserData(userId),
		getSession(),
	]);

	if (!user || !user.success || !session || !session.success) notFound();
	return (
		<div className="my-8 flex flex-col items-center lg:my-12 2xl:mb-16 2xl:mt-12">
			<Avatar
				className=""
				imageProps={{
					src: user.image || undefined,
				}}
				size="full"
			>
				{convertToFullname({
					firstname: user.firstName,
					lastname: user.lastName,
				})}
			</Avatar>
			<div className="flex w-full items-baseline justify-between lg:w-fit lg:justify-start lg:gap-8">
				<div>
					<h1 className="mt-6 text-2xl font-semibold lg:mt-8">
						{convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})}
					</h1>

					<p className="text-muted-foreground">
						{convertToPascalCase(user.role!)}
					</p>
				</div>

				{user.id !== session.id && (
					<LinkAsButton
						href={`/direct-messages?user=${userId}`}
						variant="outline"
						colorScheme="bland"
						className="p-3"
					>
						<MessageCircle />
					</LinkAsButton>
				)}
			</div>
			<InformationContainer title="General information">
				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<h6 className="text-md mt-8 lg:text-lg">About</h6>
				<p className="text-muted-foreground mt-4">
					{user.bio || 'Not fullfilled yet'}
				</p>

				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Location</h6>
					<p className="text-muted-foreground">
						{user.address || 'Not fullfilled yet'}
					</p>
				</div>
				<hr className="bg-input-border my-2 h-px w-full border-0" />

				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Date of Birth</h6>
					<p className="text-muted-foreground">
						{user.DOB || 'Not fullfilled yet'}
					</p>
				</div>

				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Work / School</h6>
					<p className="text-muted-foreground">
						{user.workOrSchool || 'Not fullfilled yet'}
					</p>
				</div>
			</InformationContainer>
			<ListOrganizations />
			<ListPosts />
		</div>
	);
}
