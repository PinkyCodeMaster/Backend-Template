/** @jsxImportSource react */

import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text } from "@react-email/components";

type LayoutProps = {
  preview: string;
  children: React.ReactNode;
};

const appName = process.env.APP_NAME || "Foundry";

export function Layout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>{appName}</Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Section style={footer}>
            <Text style={footerText}>
              You are receiving this email because you have an account with {appName}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  margin: 0,
  padding: "20px 0",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#111827",
  padding: "16px 24px",
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
};

const content: React.CSSProperties = {
  padding: "24px",
};

const footer: React.CSSProperties = {
  padding: "16px 24px",
  borderTop: "1px solid #e5e7eb",
};

const footerText: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
};
