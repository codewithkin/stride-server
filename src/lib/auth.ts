import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { magicLink } from "better-auth/plugins";

import { prisma } from '../helpers/prisma';
import { expo } from '@better-auth/expo';
import { sendMagicLink } from '../helpers/email/sendMagicLink';

const env = process.env as {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Allow requests from the frontend development server
  trustedOrigins: [
    "*",
    "stride://*"
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    expo(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        sendMagicLink({
          email,
          token,
          url,
        })
      }
    })
  ]
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}