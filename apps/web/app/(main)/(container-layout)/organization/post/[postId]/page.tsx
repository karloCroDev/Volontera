// Components
import { Post } from '@/components/ui/post/post';
import { Comment } from '@/modules/main/organization/post/comment';

// Modules
import { CommentTextArea } from '@/modules/main/organization/post/comment-text-area';

export default async function HomePage() {
	return (
		<>
			{/* <Post
				title="Example title"
				content="Lorem ipsum dolorem et imet sssswqdd po qkwd kqwdkpoqwpodk qk. What is going on in this world. Hello w"
			/> */}

			<hr className="bg-muted my-6 h-px w-full border-0" />
			<div className="border-input-border bg-muted max-h- relative w-full rounded-xl border px-5 py-6">
				<h4 className="text-lg font-semibold italic lg:text-xl">Comments</h4>
				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<div className="no-scrollbar mt-4 max-h-[600px] overflow-scroll">
					<Comment
						numberOfLikes={10}
						numberOfReplies={12}
						comment={'Awesome stuff'}
					/>
				</div>
				<CommentTextArea />
			</div>
		</>
	);
}
