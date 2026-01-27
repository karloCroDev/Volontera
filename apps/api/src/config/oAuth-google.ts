// External packages
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Root types
import { JwtUser } from "@/@types/jwt";

// Database
import { prisma } from "@repo/database";

// Models
import { upsertOAuthUser, addAccountToOAuthUser } from "@/models/auth.model";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const apiUrl = process.env.API_URL;

if (googleClientId && googleClientSecret && apiUrl) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${apiUrl}/auth/google/callback`,
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

            user = await upsertOAuthUser({
              email: profile.emails[0].value,
              firstName: profile.displayName,
            });

            await addAccountToOAuthUser({
              provider: "google",
              providerId: profile.id,
              accessToken,
              refreshToken,
              userId: user.id,
            });
          }

          return done(null, {
            userId: user.id,
            role: user.role,
            onboardingFinished: user.onboardingFinished,
          } as JwtUser);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
} else {
  console.warn(
    "Google OAuth is disabled: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and API_URL to enable it.",
  );
}

export const oAuthGoogleHandle = passport;
