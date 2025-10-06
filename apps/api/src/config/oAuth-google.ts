import { prisma } from "@/src/config/prisma";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const oAuthGoogle = passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing account
        let account = await prisma.accounts.findUnique({
          where: {
            provider_providerId: {
              provider: "google",
              providerId: profile.id,
            },
          },
          include: { user: true },
        });

        let user;
        if (account) {
          // Update tokens
          account = await prisma.accounts.update({
            where: { id: account.id },
            data: { accessToken, refreshToken },
            include: { user: true },
          });
          user = account.user;
        } else {
          // If no account, link to existing user by email or create new

          if (
            !profile.emails?.[0]?.value ||
            !profile.displayName ||
            !profile.photos?.[0]?.value
          )
            return done(null, false);

          user = await prisma.user.upsert({
            where: { email: profile.emails?.[0]?.value || "" },
            update: {},
            create: {
              email: profile.emails[0].value,
              username: profile.displayName,
              image: profile.photos?.[0].value,
              password: "", // or generate a random string if needed
            },
          });

          await prisma.accounts.create({
            data: {
              provider: "google",
              providerId: profile.id,
              accessToken,
              refreshToken,
              userId: user.id,
            },
          });
        }

        return done(null, {
          userId: user.id,
          role: user.role,
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);
