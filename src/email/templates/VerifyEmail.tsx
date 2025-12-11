/** @jsxImportSource react */
import * as React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./Layout";

const APP_NAME = process.env.APP_NAME || "Foundry";

export function VerifyEmail({
  name,
  verifyUrl,
}: {
  name?: string;
  verifyUrl: string;
}) {
  return (
    <Layout preview={`Verify your ${APP_NAME} account`}>
      <Text>Hello{name ? `, ${name}` : ""}!</Text>

      <Text>
        Please verify your email address to activate your {APP_NAME} account.
      </Text>

      <Button
        href={verifyUrl}
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "8px",
          marginTop: "16px",
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        Verify Email
      </Button>

      <Text style={{ marginTop: "16px", fontSize: 12 }}>
        If you did not create this account, you can safely ignore this email.
      </Text>
    </Layout>
  );
}
