/** @jsxImportSource react */
import * as React from "react";

const APP_NAME = process.env.APP_NAME || "Foundry";

export function OtpEmail({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px" }}>
      <h2>Your {APP_NAME} verification code</h2>

      {name && <p>Hi {name},</p>}

      <p>Your one-time verification code is:</p>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          letterSpacing: "6px",
          margin: "24px 0",
        }}
      >
        {otp}
      </div>

      <p>This code expires in a few minutes.</p>

      <p>If you did not request this, you can safely ignore this email.</p>

      <p>-- {APP_NAME} Security</p>
    </div>
  );
}
