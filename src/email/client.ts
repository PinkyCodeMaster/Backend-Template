import { Resend } from "resend";
import env from "@/config/env";
import * as React from "react"; 

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  react: React.ReactElement; 
};

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  if (env.NODE_ENV === "development") {
    console.log("📧 [DEV] Would send email:", { to, subject });
  }

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }

  return data;
}
