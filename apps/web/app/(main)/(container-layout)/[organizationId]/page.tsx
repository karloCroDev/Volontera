// External packages
import Link from 'next/link';
import { Plus } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/components/ui/post/post';
import { Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { Button } from '@/components/ui/button';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { OrganizationRoutingHeader } from '@/modules/main/organization/organization-routing-header';

export default function OrganizationId() {
	return (
		<>
			<div className="border-input-border relative rounded-xl border px-5 py-4">
				<div className="flex justify-between">
					<Tag colorScheme="gray">Nature</Tag>
					<SharePost link="" />
				</div>

				<div className="ml-10 pt-36">
					<div className="flex items-end justify-between">
						<div className="flex w-fit flex-col items-center">
							<Avatar
								imageProps={{
									src: '',
								}}
								variant="secondary"
								size="2xl"
							>
								Organization
							</Avatar>
						</div>

						<div className="flex gap-4">
							<Button colorScheme="yellow" size="md">
								Follow
							</Button>
							<Button colorScheme="orange" size="md">
								Join
							</Button>
						</div>
					</div>
					<h1 className="mt-4 text-xl font-medium md:text-2xl lg:text-3xl">
						Organization #1
					</h1>
					<div className="text-muted-foreground mt-1.5 flex items-center gap-4">
						<p>
							<strong>30</strong> attendees
						</p>
						<hr className="bg-input-border h-6 w-px border-0" />
						<p>
							<strong>300</strong> followers
						</p>
					</div>
					<hr className="bg-input-border my-6 h-px w-full border-0" />

					<Layout>
						<LayoutColumn start={1} end={8}>
							<h4 className="text-lg underline underline-offset-4 lg:text-xl">
								Additional links
							</h4>
							<div className="mt-3 flex gap-4">
								<a href="/">
									<Tag colorScheme="gray">http://localhost:3000</Tag>
								</a>
								<a href="/">
									<Tag colorScheme="gray">http://localhost:3000</Tag>
								</a>
							</div>

							<h4 className="mt-6 text-lg underline underline-offset-4 lg:text-xl">
								About
							</h4>

							<p className="mt-2">
								Lorem ipsum doloremLorem ipsum dolorem Lorem ipsum doloremLorem
								ipsum doloremLorem ipsum doloremLorem ipsum doloremLorem ipsum
								doloremLorem ipsum doloremLorem ipsum dolorem
							</p>
						</LayoutColumn>

						<LayoutColumn start={10} end={13} className="flex flex-col gap-3">
							<p className="text-muted-foreground">21 street, New York, USA</p>
							<div className="border-input-border h-full min-h-80 flex-1 rounded-lg border"></div>
						</LayoutColumn>
					</Layout>
				</div>

				<div className="bg-input-border absolute left-0 top-0 -z-[1] h-64 w-full rounded-t-xl" />
			</div>

			<OrganizationRoutingHeader />
			<Link href="">
				<div className="border-input-border mb-6 flex items-center gap-4 rounded-2xl border p-5">
					<Avatar
						imageProps={{
							src: '',
						}}
						variant="secondary"
						size="md"
					>
						Admin Name
					</Avatar>
					<p className="text-md text-muted-foreground font-medium">
						Add new post
					</p>

					<Plus className="text-muted-foreground ml-auto size-8" />
				</div>
			</Link>

			<Post
				title="Example title"
				content="Lorem ipsum dolorem et imet sssswqdd po qkwd kqwdkpoqwpodk qk. What is going on in this world. Hello w"
			/>
		</>
	);
}
