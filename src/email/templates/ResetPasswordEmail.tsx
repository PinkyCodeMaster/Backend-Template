/** @jsxImportSource react */
import * as React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./Layout";

const APP_NAME = process.env.APP_NAME || "Foundry";

export function ResetPasswordEmail({
  name,
  url,
}: {
  name?: string;
  url: string;
}) {
  return (
    <Layout preview={`Reset your ${APP_NAME} password`}>
      <Text>Hello{name ? `, ${name}` : ""},</Text>

      <Text>
        You requested to reset your password. Click the button below to continue.
      </Text>

      <Button
        href={url}
        style={{
          backgroundColor: "#111827",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
          textDecoration: "none",
          display: "inline-block",
          marginTop: 16,
        }}
      >
        Reset Password
      </Button>

      <Text style={{ marginTop: 20, fontSize: 12 }}>
        If you did not request this, you can safely ignore this email.
      </Text>
    </Layout>
  );
}
