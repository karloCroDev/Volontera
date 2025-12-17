// External packages
import Link from 'next/link';
import { Plus } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/components/ui/post/post';

export default function OrganizationId() {
	return (
		<>
			{/* Admins */}
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
