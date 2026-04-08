// Database
import { prisma } from "@repo/database";

export async function getParticipantProfile({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  return await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    include: {
      user: true,
    },
  });
}
