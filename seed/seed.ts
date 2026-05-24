import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { LAMPS } from "./lamps";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` first.");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  for (const lamp of LAMPS) {
    process.stdout.write(`→ ${lamp.slug} ... `);

    const uploadUrl = await client.mutation(api.lamps.generateUploadUrl, {});
    const bytes = await readFile(join(__dirname, "images", lamp.imageFile));
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: bytes,
    });
    if (!res.ok) throw new Error(`upload failed for ${lamp.slug}: ${res.status}`);
    const { storageId } = (await res.json()) as { storageId: string };

    const { imageFile: _, ...row } = lamp;
    await client.mutation(api.lamps.create, {
      ...row,
      imageStorageId: storageId as never,
    });
    console.log("✓");
  }

  console.log(`\nSeeded ${LAMPS.length} lamps.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
