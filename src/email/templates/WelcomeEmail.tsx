/** @jsxImportSource react */

import * as React from "react";
import { Layout } from "./Layout";
import { Text } from "@react-email/components";

export function WelcomeEmail({ name }: { name?: string }) {
    return (
        <Layout preview="Welcome to BabySteps!">
            <Text>Hello{name ? `, ${name}` : ""}!</Text>
        </Layout>
    );
}
