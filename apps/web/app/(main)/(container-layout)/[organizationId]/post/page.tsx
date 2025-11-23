// Modules
import { Post } from '@/components/ui/post/post';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { CommentTextArea } from '@/modules/main/organization/post/comment-text-area';

export default async function HomePage() {
	return (
		<>
			<Post
				title="Example title"
				content="Lorem ipsum dolorem et imet sssswqdd po qkwd kqwdkpoqwpodk qk. What is going on in this world. Hello w"
			/>

			<hr className="bg-muted my-6 h-px w-full border-0" />
			<div className="border-input-border bg-muted relative rounded-xl border px-5 py-6">
				<CommentTextArea />
			</div>
		</>
	);
}
