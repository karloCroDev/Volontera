-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('BANNED', 'OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "OrganizationJoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrganizationTasksAndCalendarStatus" AS ENUM ('LOW_PRIORITY', 'MEDIUM_PRIORITY', 'HIGH_PRIORITY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DirectMessagesConversations" (
    "id" TEXT NOT NULL,
    "lastMessage" TEXT,
    "pairKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectMessagesConversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipants" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentMessageId" TEXT,

    CONSTRAINT "DirectMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessagesImages" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectMessagesImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "avatarImage" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL DEFAULT 'MEMBER',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationJoinRequest" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "OrganizationJoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationInfo" (
    "id" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "externalFormLink" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationFollowers" (
    "id" TEXT NOT NULL,
    "followerUserId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationFollowers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLeaveFeedback" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "suggestions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationLeaveFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalLinks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "organizationInfoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rankingScore" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCommentsLikes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostCommentsLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCommentsReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostCommentsReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCommentsReplyLikes" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostCommentsReplyLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationChannels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationChannels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationChannelChatMessage" (
    "id" TEXT NOT NULL,
    "channelChatId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationChannelChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationChannelChatMessageImage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationChannelChatMessageImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTasksBoards" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTasksBoards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTask" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" "OrganizationTasksAndCalendarStatus" NOT NULL,
    "authorId" TEXT NOT NULL,
    "organizationTasksBoardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTaskInfo" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTaskInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizatonMembersAsiggnedToTask" (
    "id" TEXT NOT NULL,
    "organizationMemberId" TEXT NOT NULL,
    "organizationTaskInfoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizatonMembersAsiggnedToTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTaskQuestions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "organizationTaskId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTaskQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCalendar" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCalendarEvent" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "status" "OrganizationTasksAndCalendarStatus" NOT NULL,
    "content" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationCalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessagesConversations_pairKey_key" ON "DirectMessagesConversations"("pairKey");

-- CreateIndex
CREATE INDEX "DirectMessagesConversations_updatedAt_id_idx" ON "DirectMessagesConversations"("updatedAt", "id");

-- CreateIndex
CREATE INDEX "ConversationParticipants_userId_idx" ON "ConversationParticipants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipants_conversationId_userId_key" ON "ConversationParticipants"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "DirectMessages_conversationId_createdAt_idx" ON "DirectMessages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "DirectMessages_authorId_idx" ON "DirectMessages"("authorId");

-- CreateIndex
CREATE INDEX "DirectMessages_parentMessageId_idx" ON "DirectMessages"("parentMessageId");

-- CreateIndex
CREATE INDEX "DirectMessagesImages_messageId_idx" ON "DirectMessagesImages"("messageId");

-- CreateIndex
CREATE INDEX "Organization_ownerId_idx" ON "Organization"("ownerId");

-- CreateIndex
CREATE INDEX "Organization_createdAt_idx" ON "Organization"("createdAt");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_role_idx" ON "OrganizationMember"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "OrganizationJoinRequest_organizationId_status_createdAt_idx" ON "OrganizationJoinRequest"("organizationId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationJoinRequest_requesterId_status_createdAt_idx" ON "OrganizationJoinRequest"("requesterId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationJoinRequest_organizationId_requesterId_key" ON "OrganizationJoinRequest"("organizationId", "requesterId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInfo_organizationId_key" ON "OrganizationInfo"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationFollowers_followerUserId_idx" ON "OrganizationFollowers"("followerUserId");

-- CreateIndex
CREATE INDEX "OrganizationFollowers_organizationId_idx" ON "OrganizationFollowers"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationFollowers_organizationId_followerUserId_key" ON "OrganizationFollowers"("organizationId", "followerUserId");

-- CreateIndex
CREATE INDEX "OrganizationLeaveFeedback_organizationId_createdAt_idx" ON "OrganizationLeaveFeedback"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationLeaveFeedback_authorId_idx" ON "OrganizationLeaveFeedback"("authorId");

-- CreateIndex
CREATE INDEX "AdditionalLinks_organizationInfoId_idx" ON "AdditionalLinks"("organizationInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalLinks_organizationInfoId_url_key" ON "AdditionalLinks"("organizationInfoId", "url");

-- CreateIndex
CREATE INDEX "Post_organizationId_createdAt_idx" ON "Post"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Post_authorId_createdAt_idx" ON "Post"("authorId", "createdAt");

-- CreateIndex
CREATE INDEX "Post_organizationId_rankingScore_idx" ON "Post"("organizationId", "rankingScore");

-- CreateIndex
CREATE INDEX "PostImages_postId_idx" ON "PostImages"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLikes_postId_userId_key" ON "PostLikes"("postId", "userId");

-- CreateIndex
CREATE INDEX "PostComments_postId_createdAt_idx" ON "PostComments"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "PostComments_authorId_idx" ON "PostComments"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "PostCommentsLikes_commentId_userId_key" ON "PostCommentsLikes"("commentId", "userId");

-- CreateIndex
CREATE INDEX "PostCommentsReply_commentId_createdAt_idx" ON "PostCommentsReply"("commentId", "createdAt");

-- CreateIndex
CREATE INDEX "PostCommentsReply_authorId_idx" ON "PostCommentsReply"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "PostCommentsReplyLikes_replyId_userId_key" ON "PostCommentsReplyLikes"("replyId", "userId");

-- CreateIndex
CREATE INDEX "OrganizationChannels_organizationId_idx" ON "OrganizationChannels"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationChannels_organizationId_name_key" ON "OrganizationChannels"("organizationId", "name");

-- CreateIndex
CREATE INDEX "OrganizationChannelChatMessage_channelChatId_createdAt_idx" ON "OrganizationChannelChatMessage"("channelChatId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationChannelChatMessage_authorId_idx" ON "OrganizationChannelChatMessage"("authorId");

-- CreateIndex
CREATE INDEX "OrganizationChannelChatMessage_parentMessageId_idx" ON "OrganizationChannelChatMessage"("parentMessageId");

-- CreateIndex
CREATE INDEX "OrganizationChannelChatMessageImage_messageId_idx" ON "OrganizationChannelChatMessageImage"("messageId");

-- CreateIndex
CREATE INDEX "OrganizationTasksBoards_organizationId_idx" ON "OrganizationTasksBoards"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationTasksBoards_organizationId_title_key" ON "OrganizationTasksBoards"("organizationId", "title");

-- CreateIndex
CREATE INDEX "OrganizationTask_organizationId_idx" ON "OrganizationTask"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationTask_organizationTasksBoardId_idx" ON "OrganizationTask"("organizationTasksBoardId");

-- CreateIndex
CREATE INDEX "OrganizationTask_organizationId_status_dueDate_idx" ON "OrganizationTask"("organizationId", "status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationTaskInfo_organizationTaskId_key" ON "OrganizationTaskInfo"("organizationTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizatonMembersAsiggnedToTask_organizationMemberId_organ_key" ON "OrganizatonMembersAsiggnedToTask"("organizationMemberId", "organizationTaskInfoId");

-- CreateIndex
CREATE INDEX "OrganizationTaskQuestions_organizationTaskId_createdAt_idx" ON "OrganizationTaskQuestions"("organizationTaskId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationTaskQuestions_authorId_idx" ON "OrganizationTaskQuestions"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCalendar_organizationId_key" ON "OrganizationCalendar"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationCalendarEvent_calendarId_date_idx" ON "OrganizationCalendarEvent"("calendarId", "date");

-- CreateIndex
CREATE INDEX "OrganizationCalendarEvent_calendarId_startTime_idx" ON "OrganizationCalendarEvent"("calendarId", "startTime");

-- CreateIndex
CREATE INDEX "Accounts_userId_idx" ON "Accounts"("userId");

-- CreateIndex
CREATE INDEX "Help_userId_createdAt_idx" ON "Help"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "User_role_createdAt_idx" ON "User"("role", "createdAt");

-- CreateIndex
CREATE INDEX "User_isBanned_createdAt_idx" ON "User"("isBanned", "createdAt");

-- CreateIndex
CREATE INDEX "User_subscriptionTier_createdAt_idx" ON "User"("subscriptionTier", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DirectMessagesConversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DirectMessagesConversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "DirectMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessagesImages" ADD CONSTRAINT "DirectMessagesImages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "DirectMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationJoinRequest" ADD CONSTRAINT "OrganizationJoinRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationJoinRequest" ADD CONSTRAINT "OrganizationJoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInfo" ADD CONSTRAINT "OrganizationInfo_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFollowers" ADD CONSTRAINT "OrganizationFollowers_followerUserId_fkey" FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFollowers" ADD CONSTRAINT "OrganizationFollowers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLeaveFeedback" ADD CONSTRAINT "OrganizationLeaveFeedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLeaveFeedback" ADD CONSTRAINT "OrganizationLeaveFeedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalLinks" ADD CONSTRAINT "AdditionalLinks_organizationInfoId_fkey" FOREIGN KEY ("organizationInfoId") REFERENCES "OrganizationInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImages" ADD CONSTRAINT "PostImages_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsLikes" ADD CONSTRAINT "PostCommentsLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsLikes" ADD CONSTRAINT "PostCommentsLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsReply" ADD CONSTRAINT "PostCommentsReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsReply" ADD CONSTRAINT "PostCommentsReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsReplyLikes" ADD CONSTRAINT "PostCommentsReplyLikes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "PostCommentsReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsReplyLikes" ADD CONSTRAINT "PostCommentsReplyLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannels" ADD CONSTRAINT "OrganizationChannels_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannelChatMessage" ADD CONSTRAINT "OrganizationChannelChatMessage_channelChatId_fkey" FOREIGN KEY ("channelChatId") REFERENCES "OrganizationChannels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannelChatMessage" ADD CONSTRAINT "OrganizationChannelChatMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannelChatMessage" ADD CONSTRAINT "OrganizationChannelChatMessage_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "OrganizationChannelChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannelChatMessageImage" ADD CONSTRAINT "OrganizationChannelChatMessageImage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "OrganizationChannelChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTasksBoards" ADD CONSTRAINT "OrganizationTasksBoards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTask" ADD CONSTRAINT "OrganizationTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTask" ADD CONSTRAINT "OrganizationTask_organizationTasksBoardId_fkey" FOREIGN KEY ("organizationTasksBoardId") REFERENCES "OrganizationTasksBoards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTaskInfo" ADD CONSTRAINT "OrganizationTaskInfo_organizationTaskId_fkey" FOREIGN KEY ("organizationTaskId") REFERENCES "OrganizationTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizatonMembersAsiggnedToTask" ADD CONSTRAINT "OrganizatonMembersAsiggnedToTask_organizationMemberId_fkey" FOREIGN KEY ("organizationMemberId") REFERENCES "OrganizationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizatonMembersAsiggnedToTask" ADD CONSTRAINT "OrganizatonMembersAsiggnedToTask_organizationTaskInfoId_fkey" FOREIGN KEY ("organizationTaskInfoId") REFERENCES "OrganizationTaskInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTaskQuestions" ADD CONSTRAINT "OrganizationTaskQuestions_organizationTaskId_fkey" FOREIGN KEY ("organizationTaskId") REFERENCES "OrganizationTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTaskQuestions" ADD CONSTRAINT "OrganizationTaskQuestions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCalendar" ADD CONSTRAINT "OrganizationCalendar_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCalendarEvent" ADD CONSTRAINT "OrganizationCalendarEvent_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "OrganizationCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
