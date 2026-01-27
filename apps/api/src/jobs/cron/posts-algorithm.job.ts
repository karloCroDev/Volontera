// External packages
import cron from "node-cron";

// Models
import { retrieveCronPosts, updatePostRankingScore } from "@/models/home.model";

// Lib
import { calculatePostRankingScore } from "@/lib/algorithm-formula";

// TODO: Check if this works every 10 minutes
export const postAlgorithmJob = cron.schedule("0 */45 * * * *", async () => {
  const cronPosts = await retrieveCronPosts();

  await Promise.all(
    cronPosts.map(async (post) => {
      const rankingScore = calculatePostRankingScore({
        likes: post._count.postLikes,
        comments: post._count.postComments,
        createdAt: post.createdAt,
        images: post._count.postImages,
        orgFollowers: post.organization._count.organizationFollowers,
        isAuthorPremium: post.author.subscriptionTier === "PRO",
        isOrgPremium: post.organization.owner.subscriptionTier === "PRO",
      });

      const updatedPost = await updatePostRankingScore({
        postId: post.id,
        rankingScore,
      });

      return updatedPost;
    }),
  );
});

// Iz dokumentacije node-crona što znači koji izraz (*)

//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *
