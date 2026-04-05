import { prisma } from "./client";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  OrganizationJoinRequestStatus,
  OrganizationMemberRole,
} from "../generated/prisma";

// Load env from common monorepo locations (supports running from workspace root or package folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const POST_IMAGE_KEYS = [
  "c954f1c7-3448-49d0-be2a-3b6d946dbe58_shelley-pauls-Tsz-4K1sS9w-unsplash.jpg",
  "e3515e10-153f-43f9-a4da-488f87015c59_ismael-paramo-tnVdQGmWtb0-unsplash.jpg",
  "d450c6ab-b5e2-4e5b-9eee-9b4e82c2d81d_dylan-nolte-dUsmF-F-bJg-unsplash.jpg",
  "6cc1c136-68b1-4b27-a14b-cab603012c0d_boxicons-ZX5xK0YX9CA-unsplash.png",
  "e5df4bde-76f8-4866-99dd-bc1369c422bf_ocg-saving-the-ocean-bWAArZ5M4Ag-unsplash.jpg",
  "1013c7a9-e251-4c5d-a24c-75e43afc8f35_helena-lopes-PGnqT0rXWLs-unsplash.jpg",
  "9cad4905-2847-421d-9c4b-73fdff7b6e33_tim-marshall-cAtzHUz7Z8g-unsplash.jpg",
];

const UNIQUE_POST_IMAGE_KEYS = Array.from(new Set(POST_IMAGE_KEYS));

const pickCombinedPostImages = (min: number, max: number) => {
  const count = faker.number.int({ min, max });
  return faker.helpers.shuffle(UNIQUE_POST_IMAGE_KEYS).slice(0, count);
};

const ORG_IMAGE_BY_NAME: Record<
  string,
  { avatarImage: string; coverImage: string }
> = {
  "Green Step Volunteers": {
    avatarImage: POST_IMAGE_KEYS[2]!,
    coverImage: POST_IMAGE_KEYS[0]!,
  },
  "Hands of Solidarity": {
    avatarImage: POST_IMAGE_KEYS[6]!,
    coverImage: POST_IMAGE_KEYS[0]!,
  },
  "Learn Together": {
    avatarImage: POST_IMAGE_KEYS[3]!,
    coverImage: POST_IMAGE_KEYS[1]!,
  },
  "Coastal Cleanup Crew": {
    avatarImage: POST_IMAGE_KEYS[0]!,
    coverImage: POST_IMAGE_KEYS[2]!,
  },
  "Community Care Network": {
    avatarImage: POST_IMAGE_KEYS[4]!,
    coverImage: POST_IMAGE_KEYS[5]!,
  },
  "STEM Mentors Hub": {
    avatarImage: POST_IMAGE_KEYS[1]!,
    coverImage: POST_IMAGE_KEYS[4]!,
  },
};

async function clearDatabase() {
  await prisma.postCommentsReplyLikes.deleteMany();
  await prisma.postCommentsLikes.deleteMany();
  await prisma.postLikes.deleteMany();
  await prisma.postCommentsReply.deleteMany();
  await prisma.postComments.deleteMany();
  await prisma.postImages.deleteMany();
  await prisma.post.deleteMany();

  await prisma.organizationChannelChatMessageImage.deleteMany();
  await prisma.organizationChannelChatMessage.deleteMany();
  await prisma.organizationChannels.deleteMany();

  await prisma.organizatonMembersAsiggnedToTask.deleteMany();
  await prisma.organizationTaskInfo.deleteMany();
  await prisma.organizationTaskQuestions.deleteMany();
  await prisma.organizationTask.deleteMany();
  await prisma.organizationTasksBoards.deleteMany();

  await prisma.organizationLeaveFeedback.deleteMany();
  await prisma.organizationFollowers.deleteMany();
  await prisma.organizationJoinRequest.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.additionalLinks.deleteMany();
  await prisma.organizationInfo.deleteMany();
  await prisma.organization.deleteMany();

  await prisma.directMessagesImages.deleteMany();
  await prisma.directMessages.deleteMany();
  await prisma.conversationParticipants.deleteMany();
  await prisma.directMessagesConversations.deleteMany();

  await prisma.notification.deleteMany();
  await prisma.help.deleteMany();
  await prisma.accounts.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearDatabase();

  const users = await Promise.all(
    Array.from({ length: 40 }).map((_, indx) =>
      prisma.user.create({
        data: {
          email: `user_${faker.string.uuid()}@demo.test`,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: faker.internet.password(),
          role: indx % 2 === 0 ? "ORGANIZATION" : "USER",
        },
      }),
    ),
  );

  const organizationUsers = users.filter((u) => u.role === "ORGANIZATION");
  const regularUsers = users.filter((u) => u.role === "USER");

  const orgOwners = faker.helpers.shuffle(organizationUsers).slice(0, 8);
  const volunteers = faker.helpers.shuffle(regularUsers);

  await Promise.all(
    users.slice(0, 5).map((u, idx) =>
      prisma.accounts.create({
        data: {
          provider: idx % 2 === 0 ? "google" : "discord",
          providerId: faker.string.uuid(),
          accessToken: `at_${faker.string.uuid()}`,
          refreshToken: `rt_${faker.string.uuid()}`,
          userId: u.id,
        },
      }),
    ),
  );

  const orgSpecs = [
    {
      name: "Green Step Volunteers",
      bio: "Community cleanups, tree planting, and sustainability workshops.",
      type: "Environment",
      location: "Zagreb",
    },
    {
      name: "Hands of Solidarity",
      bio: "Food bank support, donation drives, and assistance for seniors.",
      type: "Community Support",
      location: "Split",
    },
    {
      name: "Learn Together",
      bio: "Free tutoring, STEM workshops, and mentoring for students.",
      type: "Education",
      location: "Rijeka",
    },
    {
      name: "Coastal Cleanup Crew",
      bio: "Beach cleanups and microplastic awareness events.",
      type: "Environment",
      location: "Zadar",
    },
    {
      name: "Community Care Network",
      bio: "Neighborhood volunteering: deliveries, check-ins, and community support.",
      type: "Community Support",
      location: "Osijek",
    },
    {
      name: "STEM Mentors Hub",
      bio: "Volunteer mentors helping learners with web dev and computer science basics.",
      type: "Education",
      location: "Zagreb",
    },
  ];

  const organizations = await Promise.all(
    faker.helpers.shuffle(orgSpecs).map(async (o, idx) => {
      const owner = orgOwners[idx % orgOwners.length]!;
      const orgImages =
        ORG_IMAGE_BY_NAME[o.name] ??
        ({
          avatarImage: POST_IMAGE_KEYS[idx % POST_IMAGE_KEYS.length]!,
          coverImage: POST_IMAGE_KEYS[(idx + 1) % POST_IMAGE_KEYS.length]!,
        } as const);

      return prisma.organization.create({
        data: {
          ownerId: owner.id,
          name: o.name,
          bio: o.bio,
          avatarImage: orgImages.avatarImage,
          organizationInfo: {
            create: {
              coverImage: orgImages.coverImage,
              bio: "We organize volunteering opportunities with clear roles, safety guidelines, and measurable outcomes.",
              type: o.type,
              location: o.location,
              externalFormLink: "https://forms.gle/demo-volunteering-signup",
              additionalLinks: {
                create: faker.helpers
                  .shuffle([
                    { name: "Website", url: "https://example.org/volunteer" },
                    {
                      name: "Instagram",
                      url: "https://instagram.com/example_volunteers",
                    },
                    {
                      name: "Volunteer Handbook",
                      url: "https://example.org/handbook",
                    },
                    {
                      name: "Events Calendar",
                      url: "https://example.org/events",
                    },
                  ])
                  .slice(0, 3),
              },
            },
          },
        },
        include: { organizationInfo: { include: { additionalLinks: true } } },
      });
    }),
  );

  const orgMembersByOrgId = new Map<
    string,
    { ownerId: string; members: any[] }
  >();

  for (const org of organizations) {
    const owner = orgOwners.find((u) => u.id === org.ownerId) ?? orgOwners[0]!;
    const memberPool = faker.helpers
      .shuffle(volunteers)
      .slice(0, 5)
      .filter((u) => u.id !== owner.id);

    const ownerMembership = await prisma.organizationMember.create({
      data: {
        organizationId: org.id,
        userId: owner.id,
        role: OrganizationMemberRole.OWNER,
      },
    });

    const memberships = [ownerMembership];
    for (let i = 0; i < memberPool.length; i++) {
      const role =
        i === 0 ? OrganizationMemberRole.ADMIN : OrganizationMemberRole.MEMBER;
      memberships.push(
        await prisma.organizationMember.create({
          data: {
            organizationId: org.id,
            userId: memberPool[i]!.id,
            role,
          },
        }),
      );
    }

    orgMembersByOrgId.set(org.id, {
      ownerId: owner.id,
      members: memberships,
    });

    const followers = faker.helpers.shuffle(volunteers).slice(0, 6);
    for (const follower of followers) {
      await prisma.organizationFollowers.upsert({
        where: {
          organizationId_followerUserId: {
            organizationId: org.id,
            followerUserId: follower.id,
          },
        },
        create: { organizationId: org.id, followerUserId: follower.id },
        update: {},
      });
    }

    const memberUserIds = new Set(memberships.map((m) => m.userId));
    const requesters = faker.helpers
      .shuffle(volunteers)
      .filter((u) => !memberUserIds.has(u.id))
      .slice(0, 3);
    const statuses: OrganizationJoinRequestStatus[] = [
      OrganizationJoinRequestStatus.PENDING,
      OrganizationJoinRequestStatus.APPROVED,
      OrganizationJoinRequestStatus.REJECTED,
    ];
    for (let i = 0; i < requesters.length; i++) {
      const r = requesters[i]!;
      await prisma.organizationJoinRequest.create({
        data: {
          organizationId: org.id,
          requesterId: r.id,
          title: faker.helpers.arrayElement([
            "Volunteer application",
            "Request to join the team",
            "Question about volunteering",
          ]),
          content:
            "I have volunteering experience and would love to help (logistics, communications, or on-site support).",
          status: statuses[i % statuses.length]!,
        },
      });
    }
  }

  const postTemplates: Array<{
    title: string;
    content: string;
    imageKeys?: string[];
  }> = [
    {
      title: "Trail cleanup this weekend - join us!",
      content:
        "We're organizing a volunteer trail cleanup and litter pickup. Bring gloves, comfortable shoes, and a water bottle. Meeting at 8:30 AM; wrap-up around 2 PM.",
      imageKeys: [POST_IMAGE_KEYS[0]],
    },
    {
      title: "Free STEM mentoring for students",
      content:
        "We're looking for volunteer mentors to teach programming basics and help with project work. Small groups, online + in-person options, with a simple curriculum.",
      imageKeys: [POST_IMAGE_KEYS[3], POST_IMAGE_KEYS[1]],
    },
    {
      title: "Food bank volunteers - sorting and packing",
      content:
        "Help sort donations and assemble food parcels for families in need. Shifts are 2-3 hours; everything is provided onsite.",
    },
    {
      title: "Biodiversity field notes: species spotting",
      content:
        "Join us for volunteer field observations (birds, plants, insects) with a short intro training. No prior experience required.",
      imageKeys: [POST_IMAGE_KEYS[2]],
    },
    {
      title: "Volunteer workshop: communication basics",
      content:
        "A quick onboarding workshop: active listening, teamwork, field safety, and basic crisis communication.",
      imageKeys: [POST_IMAGE_KEYS[5]],
    },
    {
      title: "Community action: refresh a children's playground",
      content:
        "Painting benches, small repairs, and tidying the area. Wear old clothes - tools and materials are provided.",
    },
    {
      title: "Tech volunteering: improve an NGO backend",
      content:
        "If you know Node/TypeScript, join a small volunteer project: tidy project structure, improve docs, and ship a couple of fixes.",
      imageKeys: [POST_IMAGE_KEYS[1], POST_IMAGE_KEYS[4]],
    },
    {
      title: "Warm donation drive volunteers",
      content:
        "We're collecting blankets, jackets, and hygiene supplies. Volunteers needed for pickup, inventory, and distribution.",
      imageKeys: [POST_IMAGE_KEYS[5]],
    },
    {
      title: "Tree planting - community day",
      content:
        "Join a beginner-friendly tree planting day with experienced coordinators guiding the process.",
    },
    {
      title: "Support seniors: deliveries and check-ins",
      content:
        "Volunteers needed for grocery deliveries and short social check-ins. Flexible shifts; safety guidelines included.",
    },
  ];

  const posts: Array<{ id: string; organizationId: string }> = [];

  for (const org of organizations) {
    const memberSet = orgMembersByOrgId.get(org.id)!.members;
    const possibleAuthors = memberSet
      .map((m) => users.find((u) => u.id === m.userId)!)
      .filter(Boolean);

    // 6 per org => +12 posts vs the previous 4-per-org setup
    const templatesForOrg = faker.helpers.shuffle(postTemplates).slice(0, 6);
    for (const tpl of templatesForOrg) {
      const author = faker.helpers.arrayElement(possibleAuthors);
      const post = await prisma.post.create({
        data: {
          title: tpl.title,
          content: tpl.content,
          authorId: author.id,
          organizationId: org.id,
          rankingScore: faker.number.int({ min: 10, max: 100 }),
        },
      });
      posts.push({ id: post.id, organizationId: org.id });

      // Ensure every post has at least one image.
      const imageKeys = tpl.imageKeys?.length
        ? tpl.imageKeys
        : pickCombinedPostImages(1, 3);

      if (imageKeys?.length) {
        await prisma.postImages.createMany({
          data: imageKeys.map((key) => ({
            postId: post.id,
            imageUrl: key,
          })),
        });
      }
    }
  }

  for (const p of posts) {
    const commenterCount = faker.number.int({ min: 0, max: 8 });
    const likeCount = faker.number.int({ min: 0, max: 20 });
    const commenters = faker.helpers
      .shuffle(volunteers)
      .slice(0, Math.min(commenterCount, volunteers.length));
    const comments = [] as Array<{ id: string }>;

    for (const c of commenters) {
      comments.push(
        await prisma.postComments.create({
          data: {
            postId: p.id,
            authorId: c.id,
            content: faker.helpers.arrayElement([
              "Great initiative - I can join the morning shift.",
              "Quick question about equipment; I'll DM you.",
              "Awesome! I can bring a friend to help.",
              "Thanks for organizing something so practical and clear.",
            ]),
          },
        }),
      );
    }

    if (comments.length > 0 && faker.datatype.boolean()) {
      const first = comments[0]!;
      const replier = faker.helpers.arrayElement(volunteers);
      const reply = await prisma.postCommentsReply.create({
        data: {
          commentId: first.id,
          authorId: replier.id,
          content:
            "Happy to help - if you need logistics/coordination, I'm in.",
        },
      });

      // Reply likes
      const replyLikeCount = faker.number.int({ min: 0, max: 6 });
      for (const liker of faker.helpers
        .shuffle(volunteers)
        .slice(0, Math.min(replyLikeCount, volunteers.length))) {
        await prisma.postCommentsReplyLikes.upsert({
          where: {
            replyId_userId: { replyId: reply.id, userId: liker.id },
          },
          create: { replyId: reply.id, userId: liker.id },
          update: {},
        });
      }
    }

    // Post likes
    for (const liker of faker.helpers
      .shuffle(volunteers)
      .slice(0, Math.min(likeCount, volunteers.length))) {
      await prisma.postLikes.upsert({
        where: { postId_userId: { postId: p.id, userId: liker.id } },
        create: { postId: p.id, userId: liker.id },
        update: {},
      });
    }

    // Comment likes
    for (const c of comments) {
      const commentLikeCount = faker.number.int({ min: 0, max: 6 });
      for (const liker of faker.helpers
        .shuffle(volunteers)
        .slice(0, Math.min(commentLikeCount, volunteers.length))) {
        await prisma.postCommentsLikes.upsert({
          where: {
            commentId_userId: { commentId: c.id, userId: liker.id },
          },
          create: { commentId: c.id, userId: liker.id },
          update: {},
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
