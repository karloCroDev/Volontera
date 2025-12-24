// External packages
import { MessageCircle } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';
import { ListPosts } from '@/modules/main/public-profile/list-posts';

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
			<InformationContainer title="General information">
				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<h6 className="text-md mt-8 lg:text-lg">About</h6>
				<p className="text-muted-foreground mt-4">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae tenetur
					sequi odio mollitia distinctio beatae magnam! Laboriosam vel
					molestiae, deleniti, molestias veniam accusamus culpa hic minima
					itaque quo natus fuga.
				</p>

				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Location</h6>
					<p className="text-muted-foreground">Zagreb, Croatia</p>
				</div>
				<hr className="bg-input-border my-2 h-px w-full border-0" />

				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Date of Birth</h6>
					<p className="text-muted-foreground">23/12/2008</p>
				</div>

				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<div className="mt-6 flex items-center justify-between">
					<h6 className="text-md lg:text-lg">Work / School</h6>
					<p className="lg:text-md text-muted-foreground">
						III. gimnazija split
					</p>
				</div>
			</InformationContainer>
			<InformationContainer title="Organizations">
				<div className="border-input-border bg-muted mt-4 flex items-center gap-4 rounded-md border px-4 py-3">
					<Avatar
						imageProps={{
							src: '',
						}}
						colorScheme="gray"
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

			<ListPosts />
		</div>
	);
}
