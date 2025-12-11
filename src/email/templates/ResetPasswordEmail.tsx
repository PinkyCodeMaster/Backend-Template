/** @jsxImportSource react */
import * as React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./Layout";

export function ResetPasswordEmail({
    name,
    url,
}: {
    name?: string;
    url: string;
}) {
    return (
        <Layout preview="Reset your BabySteps password">
            <Text>Hello{name ? `, ${name}` : ""},</Text>

            <Text>
                You requested to reset your password. Click the button below:
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
                If you didn’t request this, you can safely ignore this email.
            </Text>
        </Layout>
    );
}
