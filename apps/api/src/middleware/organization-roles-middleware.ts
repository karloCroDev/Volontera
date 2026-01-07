// // External packages
// import { retrieveOrganizationMember } from "@/models/organization-managment.model";
// import { Request, Response, NextFunction } from "express";

// export async function organizationAdminMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { userId } = req.user;

//   const organizationMember = await retrieveOrganizationMember(
//     req.params.organizationId,
//     userId
//   );

//   next();
// }

// export async function organizationOwnerMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { userId } = req.user;
//     const organizationMember = await retrieveOrganizationMember(
//         {
//             organizationId: req.params.organizationId,
//             userId,
//         }

//   );
//     if (organizationMember?.role !== "OWNER") {}

//     next()
// }
