// External packages
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { JwtUser } from "@/@types/jwt";

export const oAuthGoogleHandle = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
            where: { email: profile.emails[0].value || "" },
            update: {},
            create: {
              email: profile.emails[0].value,
              firstName: profile.displayName,
              lastName: "",
              fullname: profile.displayName,
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
          onboardingFinished: user.onboardingFinished,
          // subscriptionTier: user.subscriptionTier,
        } as JwtUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
