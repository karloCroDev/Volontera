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

export async function getDirectMessagesConversationById(
  conversationId: DirectMessagesConversations["id"]
) {
  return prisma.directMessages.findMany({
    where: {
      conversationId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      directMessagesImages: true,
    },
  });
}

// TODO: Write some small algorithm to search all users by their username (first or last name) or email
export async function searchAllUsers({
  query,
  userId,
  // limit,
  // offset,
}: {
  query: string;
  userId: User["id"];
  // limit: number;
  // offset: number;
}) {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    // include: {
    //   directMessagesConversations: {
    //     select: {
    //       conversationId: true,
    //     },
    //   },
    // },

    // skip: offset,
    // take: limit,
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

export async function createDirectMessagesConversation({
  participantIds,
}: {
  participantIds: User["id"][];
}) {
  return prisma.directMessagesConversations.create({
    data: {
      pairKey: "ss",
      participants: {
        create: participantIds.map((id) => ({
          userId: id,
        })),
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function startConversationOrStartAndSendDirectMessage({
  senderId,
  receiverId,
  content,
  imageKeys,
}: {
  senderId: User["id"];
  receiverId: User["id"];
  content: string;
  imageKeys?: string[];
}) {
  // Pair key mi olakšava način na koji ću pronaći konverzaciju između dva korisnika, također mi omogućava da ako se 2 iste poruke pošalju u isto vrijeme, da ne dobijem konflikt u bazi podataka jer će pair key uvijek biti isti za ta dva korisnika.
  const pairKey = [senderId, receiverId].sort().join(":"); // Uvijek isti redoslijed korisnika bez obzira tko šalje poruku

  // Koristim transakciju jer imamo veći broj operacija koje moramo obaviti. Ideja je kada korisnik pošalje poruku, ako ne postoji konverzacija između ta dva korisnika, da se kreira nova konverzacija i da se u nju doda poruka. Ako konverzacija postoji, samo se doda poruka u postojeću konverzaciju. Također, potrebno je ažurirati i posljednju poruku u konverzaciji, kako bi ju prikazali u listi konverzacija.

  return prisma.$transaction(async (tx) => {
    // 1. Tražim ili kreiram konverzaciju

    // Create uvijek napravi novu konverzaciju, zato koristim upsert koji traži po pair keyu, ako ne postoji kreira novu konverzaciju sa ta dva korisnika
    const conversation = await tx.directMessagesConversations.upsert({
      where: { pairKey },
      create: {
        pairKey,
        participants: {
          create: [{ userId: senderId }, { userId: receiverId }],
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
        author: true,
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
