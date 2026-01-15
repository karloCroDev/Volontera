// import { prisma, User } from "@repo/database";

// export async function retrieveAlgoPosts({
//   offset = 0,
//   limit = 10,
// }: {
//   offset?: number;
//   limit?: number;
// }) {
//   return prisma.post.findMany({

//     where : {
//         organization: {

//         }
//     },

//     skip: offset,
//     take: limit,
//   });
// }

// export async function retrieveFollowedAlgoPosts({
//   userId,
//   offset = 0,
//     limit = 10,
// }: {
//   userId: User['id']
//   offset?: number;
//     limit?: number;
// }) {
//     return prisma.post.findMany({
//         where: {
//             organization : {
//                 follo
//             }
//         }
//     })
// }
