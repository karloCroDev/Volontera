// External packages
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Modules
import { CommentTextArea } from '@/modules/main/organization/post/comment-text-area';

// Components
import { Post } from '@/components/ui/post/post';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Lib
import { retrievePostWithComments } from '@/lib/server/post';
import { getImageFromKey } from '@/lib/server/image';

// Modules
import {
	CommentOrReplySkeleton,
	CommentsMapping,
} from '@/modules/main/organization/post/comments-mapping';

// Async server component for Post

export default async function PostWithCommentsPage({
	params,
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;
	return (
		<Suspense
			fallback={
				<>
					<PostSkeleton />
					<hr className="bg-muted my-6 h-px w-full border-0" />

					<div className="border-input-border bg-muted max-h- relative w-full rounded-xl border px-5 py-6">
						{[...Array(3)].map((_, indx) => (
							<CommentOrReplySkeleton key={indx} />
						))}
					</div>
				</>
			}
		>
			<PostContent postId={postId} />
		</Suspense>
	);
}

async function PostContent({ postId }: { postId: string }) {
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

	return (
		<>
			<Post post={postWithComments.post} images={imageResponse?.urls} />
			<hr className="bg-muted my-6 h-px w-full border-0" />
			<div className="border-input-border bg-muted max-h- relative w-full rounded-xl border px-5 py-6 shadow-xl">
				<h4 className="text-lg font-semibold underline underline-offset-4 lg:text-xl">
					Comments
				</h4>
				<hr className="bg-input-border my-2 h-px w-full border-0" />
				<div className="max-h-96 overflow-y-scroll">
					<CommentsMapping
						comments={{
							message: postWithComments.message,
							comments: postWithComments.post.postComments,
							success: postWithComments.success,
						}}
					/>
				</div>
				<CommentTextArea />
			</div>
		</>
	);
}
