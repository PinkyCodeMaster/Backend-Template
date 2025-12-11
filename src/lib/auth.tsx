/** @jsxImportSource react */
import * as React from "react";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { bearer, openAPI, admin, twoFactor } from "better-auth/plugins";
import { organization } from "better-auth/plugins";

import { db } from "@/db";
import { sendEmail } from "@/email/client";

import { VerifyEmail } from "@/email/templates/VerifyEmail";
import { ResetPasswordEmail } from "@/email/templates/ResetPasswordEmail";
import { InviteEmail } from "@/email/templates/InviteEmail";
import { OtpEmail } from "@/email/templates/OtpEmail";

import * as schema from "./auth";

const APP_NAME = process.env.APP_NAME || "MyApp";
const APP_SCHEME = process.env.APP_SCHEME || "myapp";
const APP_WEB_URL = process.env.APP_WEB_URL || "http://localhost:3000";


export const auth = betterAuth({
  appName: APP_NAME,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    expo({
      disableOriginOverride: false,
    }),

    bearer({
      requireSignature: true,
    }),

    admin({
      adminRoles: ["admin", "superadmin"],
      impersonationSessionDuration: 60 * 60,
      bannedUserMessage: `Your ${APP_NAME} account has been disabled. Contact support.`,
    }),

    twoFactor({
      issuer: APP_NAME,

      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail({
            to: user.email,
            subject: `Your ${APP_NAME} verification code`,
            react: (
              <OtpEmail
                name={user.name ?? undefined}
                otp={otp}
              />
            ),
          });
        },
      },
    }),

    openAPI({
      theme: "deepSpace",
      disableDefaultReference: false,
    }),

    organization({
      creatorRole: "owner",
      membershipLimit: 10,
      requireEmailVerificationOnInvitation: true,
      invitationExpiresIn: 60 * 60 * 24 * 2,
      cancelPendingInvitationsOnReInvite: true,

      async sendInvitationEmail(data: {
        id: string;
        email: string;
        inviter: { user: { name?: string | null } };
        organization: { name: string };
      }) {
        const inviteUrl = `${APP_WEB_URL}/invite/${data.id}`;

        await sendEmail({
          to: data.email,
          subject: `You're invited to join ${data.organization.name} on ${APP_NAME}`,
          react: (
            <InviteEmail
              invitedBy={data.inviter.user.name ?? "A family member"}
              organizationName={data.organization.name}
              inviteUrl={inviteUrl}
            />
          ),
        });
      },
    }),

    nextCookies(),
  ],


  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const deepLink = url.replace(
        process.env.BETTER_AUTH_URL!,
        `${APP_SCHEME}://verify`
      );

      void sendEmail({
        to: user.email,
        subject: `Verify your ${APP_NAME} email`,
        react: (
          <VerifyEmail
            name={user.name ?? undefined}
            verifyUrl={deepLink}
          />
        ),
      });
    },

    afterEmailVerification: async (user) => {
      console.log(`✅ Email verified for: ${user.email}`);
    },
  },

  /**
   * ✅ PASSWORD RESET
   */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const deepLink = url.replace(
        process.env.BETTER_AUTH_URL!,
        `${APP_SCHEME}://reset-password`
      );

      void sendEmail({
        to: user.email,
        subject: `Reset your ${APP_NAME} password`,
        react: (
          <ResetPasswordEmail
            name={user.name ?? undefined}
            url={deepLink}
          />
        ),
      });
    },
  },

  /**
   * ✅ TRUSTED ORIGINS
   */
  trustedOrigins: [
    `${APP_SCHEME}://`,
    ...(process.env.NODE_ENV === "development"
      ? [
        "exp://*/*",
        "exp://10.0.0.*:*/*",
        "exp://192.168.*.*:*/*",
        "exp://172.*.*.*:*/*",
        "exp://localhost:*/*",
      ]
      : []),
  ],

  /**
   * ✅ IP SECURITY
   */
  advanced: {
    ipAddress: {
      ipAddressHeaders:
        process.env.NODE_ENV === "production"
          ? ["cf-connecting-ip"]
          : ["x-forwarded-for"],
    },
  },
});
