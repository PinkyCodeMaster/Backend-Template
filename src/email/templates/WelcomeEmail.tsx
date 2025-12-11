/** @jsxImportSource react */

import * as React from "react";
import { Layout } from "./Layout";
import { Text } from "@react-email/components";

const APP_NAME = process.env.APP_NAME || "Foundry";

export function WelcomeEmail({ name }: { name?: string }) {
  return (
    <Layout preview={`Welcome to ${APP_NAME}!`}>
      <Text>Hello{name ? `, ${name}` : ""}!</Text>
      <Text>Thanks for joining {APP_NAME}. We are glad you are here.</Text>
    </Layout>
  );
}
