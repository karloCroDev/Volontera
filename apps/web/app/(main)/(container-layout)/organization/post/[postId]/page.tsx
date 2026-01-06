// Modules
import { Comment } from '@/modules/main/organization/post/comment';
import { CommentTextArea } from '@/modules/main/organization/post/comment-text-area';

// Components
import { Post } from '@/components/ui/post/post';

// Lib
import { retrievePostWithComments } from '@/lib/server/post';
import { notFound } from 'next/navigation';
import { getImageFromKey } from '@/lib/server/image';
import { CommentsMapping } from '@/modules/main/organization/post/comments-mapping';

export default async function PostWithComments({
	params,
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;
	console.log(postId);

	const postWithComments = await retrievePostWithComments({ postId });

	if (!postWithComments.success) notFound();

	const imageResponse =
		postWithComments.post.postImages.length > 0
			? await getImageFromKey({
					imageUrls: postWithComments.post.postImages.map(
						(img) => img.imageUrl
					),
				})
			: null;

	console.log('POST WITH COMMENTS:', postWithComments.post.postComments);
	return (
		<>
			<Post post={postWithComments.post} images={imageResponse?.urls} />
			<hr className="bg-muted my-6 h-px w-full border-0" />
			<div className="border-input-border bg-muted max-h- relative w-full rounded-xl border px-5 py-6">
				<h4 className="text-lg font-semibold italic lg:text-xl">Comments</h4>
				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<CommentsMapping />
				<CommentTextArea />
			</div>
		</>
	);
}
