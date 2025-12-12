# Using the generated OpenAPI client types

The file `clients/openapi.ts` is auto-generated (`bun run contracts:build`). Import types from it to get end-to-end typing for your frontend or consumer services.

## Installation / sync
- Generate locally: `bun run contracts:build` (emits `docs/openapi.json` and `clients/openapi.ts`).
- Copy `clients/openapi.ts` into your frontend codebase (or publish a shared package).

## Basic fetch helper example
```ts
// client/api.ts
import type { paths } from "./clients/openapi"; // adjust relative path

type HealthResponse =
  paths["/api/v1/health"]["get"]["responses"][200]["content"]["application/json"];

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://backend-template-production.up.railway.app";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/health`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json() as Promise<HealthResponse>;
}
```

## React usage
```tsx
// client/HealthStatus.tsx
import { useEffect, useState } from "react";
import { fetchHealth } from "./api";

export function HealthStatus() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchHealth>>>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchHealth().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading…</div>;

  return (
    <div>
      <div>Status: {data.status}</div>
      <div>Service: {data.service}</div>
      <div>Env: {data.environment}</div>
    </div>
  );
}
```

## Typing other routes
- Responses: `paths["/route"]["method"]["responses"][status]["content"]["application/json"]`
- Request bodies: `paths["/route"]["method"]["requestBody"]["content"]["application/json"]`
- Params: `paths["/route"]["method"]["parameters"]["path" | "query" | "header" | "cookie"]`

Example for a POST with JSON body:
```ts
type LoginBody =
  paths["/api/v1/auth/login"]["post"]["requestBody"]["content"]["application/json"];
```

## Tips
- Keep `clients/openapi.ts` in sync with the API by regenerating after API changes.
- If sharing across repos, publish it as a small npm package or use a git submodule.
