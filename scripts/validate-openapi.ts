import fs from "node:fs";
import path from "node:path";

const specPath = path.resolve("docs", "openapi.json");

if (!fs.existsSync(specPath)) {
  console.error("OpenAPI spec not found. Run `bun run openapi:emit` first.");
  process.exit(1);
}

const raw = fs.readFileSync(specPath, "utf8");
let spec: any;

try {
  spec = JSON.parse(raw);
} catch (err) {
  console.error("Invalid JSON in OpenAPI spec:", err);
  process.exit(1);
}

if (!spec.openapi || !spec.info || !spec.paths) {
  console.error("OpenAPI spec is missing required fields (openapi/info/paths).");
  process.exit(1);
}

console.log("OpenAPI spec looks valid.");
console.log(`Title: ${spec.info.title}, Version: ${spec.info.version}`);
