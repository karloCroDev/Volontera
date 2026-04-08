// Database
import { sortPairKey } from "@/lib/utils/pair-key";
import { prisma, User, DirectMessages } from "@repo/database";

export async function listAllDirectMessagesConversation(userId: User["id"]) {
  return prisma.directMessagesConversations.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getDirectMessagesConversationById({
  recieverId,
  senderId,
}: {
  senderId: User["id"];
  recieverId: User["id"];
}) {
  const pairKey = sortPairKey({ senderId, recieverId });
  return prisma.directMessagesConversations.findUnique({
    where: {
      pairKey,
    },

    include: {
      directMessages: {
        include: {
          directMessagesImages: true,
          parentMessage: {
            select: {
              id: true,
              content: true,
              author: {
                omit: {
                  password: true,
                },
              },
            },
          },
          author: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
}

export async function searchAllUsers({
  query,
  userId,
}: {
  query: string;
  userId: User["id"];
}) {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    where: {
      // Ne vraćam samog sebe tj. treutačnog korisnika koji koristi aplikaciju
      NOT: {
        id: userId,
      },
      OR: [
        {
          firstName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 5,
  });
}

export async function deleteDirectMessageById({
  conversationId,
  messageId,
  userId,
}: {
  conversationId: DirectMessages["conversationId"];
  messageId: DirectMessages["id"];
  userId: User["id"];
}) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.directMessages.findUnique({
      where: {
        conversationId,
        id: messageId,
        authorId: userId,
      },
      select: {
        id: true,
        replyMessage: {
          select: {
            id: true,
          },
        },
      },
    });

    // Karlo: Bolje handleaj ovaj error (neće biti sigurno prikazan na frontendu, ali dobro za znati)
    if (!message) {
      throw new Error(
        "Message not found or you are not the author of the message",
      );
    }

    const deletedMessageIds = [
      message.id,
      ...message.replyMessage.map((reply) => reply.id),
    ];

    await tx.directMessages.delete({
      where: {
        id: messageId,
      },
    });

    const latestMessage = await tx.directMessages.findFirst({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        content: true,
      },
    });

    await tx.directMessagesConversations.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessage: latestMessage?.content ?? null,
      },
    });

    const participants = await tx.directMessagesConversations.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        participants: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      deletedMessageIds,
      participants: participants?.participants ?? [],
    };
  });
}

export async function startConversationOSendDirectMessage({
  senderId,
  recieverId,
  content,
  imageKeys,
}: {
  senderId: User["id"];
  recieverId: User["id"];
  content: string;
  imageKeys?: string[];
}) {
  // Pair key mi olakšava način na koji ću pronaći konverzaciju između dva korisnika, također mi omogućava da ako se 2 iste poruke pošalju u isto vrijeme, da ne dobijem konflikt u bazi podataka jer će pair key uvijek biti isti za ta dva korisnika.
  const pairKey = sortPairKey({ senderId, recieverId });

  // Koristim transakciju jer imamo veći broj operacija koje moramo obaviti. Ideja je kada korisnik pošalje poruku, ako ne postoji konverzacija između ta dva korisnika, da se kreira nova konverzacija i da se u nju doda poruka. Ako konverzacija postoji, samo se doda poruka u postojeću konverzaciju. Također, potrebno je ažurirati i posljednju poruku u konverzaciji, kako bi ju prikazali u listi konverzacija.

  return prisma.$transaction(async (tx) => {
    // 1. Tražim ili kreiram konverzaciju

    // Create uvijek napravi novu konverzaciju, zato koristim upsert koji traži po pair keyu, ako ne postoji kreira novu konverzaciju sa ta dva korisnika
    const conversation = await tx.directMessagesConversations.upsert({
      where: { pairKey },
      create: {
        pairKey,
        participants: {
          create: [{ userId: senderId }, { userId: recieverId }],
        },
      },
      update: {},
    });

    // 2. Kreiram poruku
    const message = await tx.directMessages.create({
      data: {
        conversationId: conversation.id,
        authorId: senderId,
        content,

        // Create attachments in the same write so they are present in the emitted payload
        ...(imageKeys && imageKeys.length
          ? {
              directMessagesImages: {
                create: imageKeys.map((key) => ({
                  imageUrl: key,
                })),
              },
            }
          : {}),
      },

      // Trebam vratiti slike i autora da ih mogu prikazati odmah nakon slanja poruke (websocket)
      include: {
        directMessagesImages: true,
        parentMessage: {
          select: {
            id: true,
            content: true,
            author: {
              omit: {
                password: true,
              },
            },
          },
        },
        author: {
          omit: {
            password: true,
          },
        },
      },
    });

    // 3️. Ažuriram posljednju poruku u konverzaciji
    await tx.directMessagesConversations.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content,
      },
    });

    return {
      message,
      conversation,
    };
  });
}

export async function createDirectMessageReply({
  senderId,
  conversationId,
  parentMessageId,
  content,
  imageKeys,
}: {
  senderId: User["id"];
  conversationId: DirectMessages["conversationId"];
  parentMessageId: DirectMessages["id"];
  content: string;
  imageKeys?: string[];
}) {
  return prisma.$transaction(async (tx) => {
    const reply = await tx.directMessages.create({
      data: {
        conversationId,
        authorId: senderId,
        content,
        parentMessageId,
        ...(imageKeys && imageKeys.length
          ? {
              directMessagesImages: {
                create: imageKeys.map((key) => ({
                  imageUrl: key,
                })),
              },
            }
          : {}),
      },
      include: {
        directMessagesImages: true,
        author: {
          omit: {
            password: true,
          },
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            author: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    await tx.directMessagesConversations.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessage: content,
      },
    });

    const participants = await tx.directMessagesConversations.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        participants: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      reply,
      participantIds: participants?.participants.map((p) => p.userId) ?? [],
    };
  });
}
