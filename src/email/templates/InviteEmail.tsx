/** @jsxImportSource react */
import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
} from "@react-email/components";

interface InviteEmailProps {
  invitedBy: string;
  organizationName: string;
  inviteUrl: string;
}

const APP_NAME = process.env.APP_NAME || "Foundry";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const LOGO_URL = `${FRONTEND_URL}/assets/logo.png`;

export const InviteEmail = ({
  invitedBy,
  organizationName,
  inviteUrl,
}: InviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f7f7f7",
          padding: "40px 0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "32px",
            maxWidth: "520px",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: 24 }}>
            <Img
              src={LOGO_URL}
              alt={`${APP_NAME} Logo`}
              width={80}
              height={80}
              style={{ margin: "0 auto" }}
            />
          </Section>

          <Heading
            style={{
              fontSize: "24px",
              marginBottom: "16px",
              textAlign: "center",
              color: "#111",
            }}
          >
            You have been invited to join {organizationName}
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#444",
              lineHeight: "24px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {invitedBy} invited you to the <strong>{organizationName}</strong> workspace on {APP_NAME}.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              color: "#555",
              textAlign: "center",
              lineHeight: "22px",
              marginBottom: "24px",
            }}
          >
            Use the link below to accept and get started.
          </Text>

          <Section style={{ textAlign: "center", marginBottom: 32 }}>
            <Button
              href={inviteUrl}
              style={{
                backgroundColor: "#0F172A",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "8px",
                fontSize: "16px",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Accept Invitation
            </Button>
          </Section>

          <Hr style={{ margin: "24px 0", borderColor: "#ddd" }} />

          <Text
            style={{
              fontSize: "12px",
              color: "#777",
              textAlign: "center",
              lineHeight: "18px",
            }}
          >
            If you are on your phone and the {APP_NAME} app is installed, it will open automatically.
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#aaa",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            (c) {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InviteEmail;
