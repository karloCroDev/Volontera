// Modules
import { Heading } from '@/components/ui/heading';
import { Tag } from '@/components/ui/tag';

export default async function HomePage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading>Home</Heading>
				<div className="flex gap-3">
					<Tag className="mt-2 h-fit" colorScheme="accent">
						For you
					</Tag>
					<Tag className="mt-2 h-fit">Following</Tag>
				</div>
			</div>
			{/* TODO: Put this inside the suspense component */}
			{/* <Post
				title="Example title"
				content="Lorem ipsum dolorem et imet sssswqdd po qkwd kqwdkpoqwpodk qk. What is going on in this world. Hello w"
			/> */}
		</>
	);
}
