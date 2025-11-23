// External packages
import { MessageCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { getSession } from '@/lib/server/get-session';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';
import { ListPosts } from '@/modules/main/public-profile/list-posts';
import { ListComments } from '@/modules/main/public-profile/list-comments';

export default async function PublicProfilePage() {
	return (
		<div className="my-8 flex flex-col items-center lg:my-12 2xl:mb-16 2xl:mt-12">
			<Avatar
				className=""
				imageProps={{
					src: '',
				}}
				size="full"
			>
				Ana Horvat
			</Avatar>

			<div className="flex w-full items-baseline justify-between lg:w-fit lg:justify-start lg:gap-8">
				<div>
					<h1 className="mt-6 text-2xl font-semibold lg:mt-8">Ana Horvat</h1>
					<p className="text-muted-foreground">Organizator</p>
				</div>
				<LinkAsButton
					href="/direct-messages?user=ana-horvat"
					variant="outline"
					colorScheme="bland"
					className="p-3"
				>
					<MessageCircle />
				</LinkAsButton>
			</div>

			<InformationContainer title="About">
				<p className="text-muted-foreground mt-4">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae tenetur
					sequi odio mollitia distinctio beatae magnam! Laboriosam vel
					molestiae, deleniti, molestias veniam accusamus culpa hic minima
					itaque quo natus fuga.
				</p>
			</InformationContainer>

			<InformationContainer
				title="Location"
				className="flex items-center justify-between"
			>
				<p className="text-muted-foreground">Zagreb, Croatia</p>
			</InformationContainer>
			<InformationContainer
				title="Date of Birth"
				className="flex items-center justify-between"
			>
				<p className="lg:text-md text-muted-foreground">23/12/2008</p>
			</InformationContainer>

			<InformationContainer title="Organizations">
				<div className="border-input-border bg-muted mt-4 flex items-center gap-4 rounded-md border px-4 py-3">
					<Avatar
						imageProps={{
							src: '',
						}}
						variant="secondary"
					>
						Organization Example
					</Avatar>

					<p className="text-md">Organization Example</p>

					<LinkAsButton
						href="/organizations/organization"
						size="sm"
						className="ml-auto"
					>
						Explore
					</LinkAsButton>
				</div>
			</InformationContainer>
			<ListComments />

			<ListPosts />
		</div>
	);
}
