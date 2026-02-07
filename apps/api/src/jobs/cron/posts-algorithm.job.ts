// External packages
import cron from "node-cron";

// Models
import { retrieveCronPosts, updatePostRankingScore } from "@/models/home.model";

// Lib
import { calculatePostRankingScore } from "@/lib/utils/algorithm-formula";

// Svakih 6 sati se pokreće cron job koji prolazi kroz sve postove i ažurira njihov ranking score na osnovu različitih faktora poput broja lajkova, komentara, vremena kreiranja, broja slika, broja pratilaca organizacije, te da li je autor ili organizacija PRO korisnik. Ovo pomaže u održavanju relevantnosti i vidljivosti postova na platformi.
cron.schedule("0 0 */6 * * *", async () => {
  const cronPosts = await retrieveCronPosts();

  await Promise.all(
    cronPosts.map(async (post) => {
      const rankingScore = calculatePostRankingScore({
        likes: post._count.postLikes,
        comments: post._count.postComments,
        createdAt: post.createdAt,
        images: post._count.postImages,
        orgFollowers: post.organization._count.organizationFollowers,
        isAuthorPro: post.author.subscriptionTier === "PRO",
        isOrgPro: post.organization.owner.subscriptionTier === "PRO",
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
