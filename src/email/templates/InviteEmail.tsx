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

// ✅ ENV-DRIVEN BRANDING
const APP_NAME = process.env.APP_NAME || "MyApp";
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
          {/* ✅ Logo */}
          <Section style={{ textAlign: "center", marginBottom: 24 }}>
            <Img
              src={LOGO_URL}
              alt={`${APP_NAME} Logo`}
              width={80}
              height={80}
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* ✅ Title */}
          <Heading
            style={{
              fontSize: "24px",
              marginBottom: "16px",
              textAlign: "center",
              color: "#111",
            }}
          >
            You've Been Invited to Join {organizationName}
          </Heading>

          {/* ✅ Message */}
          <Text
            style={{
              fontSize: "16px",
              color: "#444",
              lineHeight: "24px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {invitedBy} has invited you to join the{" "}
            <strong>{organizationName}</strong> group on {APP_NAME}.
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
            {APP_NAME} helps families stay connected, track goals, and make
            progress together.
          </Text>

          {/* ✅ Button */}
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

          {/* ✅ Footer Text */}
          <Text
            style={{
              fontSize: "12px",
              color: "#777",
              textAlign: "center",
              lineHeight: "18px",
            }}
          >
            If you’re on your phone and the {APP_NAME} app is installed, it will
            open automatically. Otherwise, you can continue in your browser.
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#aaa",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InviteEmail;
