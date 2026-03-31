// Database
import {
  prisma,
  User,
  DirectMessagesConversations,
  DirectMessages,
} from "@repo/database";

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
  const pairKey = [senderId, recieverId].sort().join(":");
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
  messageId,
  userId,
}: {
  messageId: DirectMessages["id"];
  userId: User["id"];
}) {
  return prisma.directMessages.delete({
    where: {
      id: messageId,
      authorId: userId,
    },
    include: {
      conversation: {
        select: {
          participants: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });
}

// U sidbearu prikaz posljednje poruke u konverzaciji (bolje nego tražiti sve poruke i uzimati zadnju i sigurno će se svaki put kada se pošalje nova poruka ažurirati taj podatak)
export async function updateDirectMessagesConversationLastMessage({
  conversationId,
  lastMessage,
}: {
  conversationId: DirectMessagesConversations["id"];
  lastMessage: DirectMessagesConversations["lastMessage"];
}) {
  return prisma.directMessagesConversations.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessage,
    },
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
  const pairKey = [senderId, recieverId].sort().join(":"); // Uvijek isti redoslijed korisnika bez obzira tko šalje poruku

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

    // Uhh vidi je li trebam ionako ista vratiti

    return {
      message,
      conversation,
    };
  });
}

export async function createDirectMessageReply({
  senderId,
  parentMessageId,
  content,
  imageKeys,
}: {
  senderId: User["id"];
  parentMessageId: DirectMessages["id"];
  content: string;
  imageKeys?: string[];
}) {
  return prisma.$transaction(async (tx) => {
    // Fetch parent message with conversation participants for auth and delivery.
    const parentMessage = await tx.directMessages.findUnique({
      where: { id: parentMessageId },
      include: {
        replyMessage: {
          select: {
            id: true,
          },
        },
        conversation: {
          select: {
            id: true,
            participants: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!parentMessage) {
      throw new Error("Parent message not found");
    }

    const participantIds = parentMessage.conversation.participants.map(
      (participant) => participant.userId,
    );

    if (!participantIds.includes(senderId)) {
      throw new Error("You are not allowed to reply in this conversation");
    }

    if (parentMessage.replyMessage) {
      throw new Error("This message already has a reply");
    }

    const reply = await tx.directMessages.create({
      data: {
        conversationId: parentMessage.conversation.id,
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
        id: parentMessage.conversation.id,
      },
      data: {
        lastMessage: content,
      },
    });

    return {
      reply,
      participantIds,
    };
  });
}
