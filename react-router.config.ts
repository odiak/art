import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

const buildDirectory = "dist";

export default {
  buildDirectory,
  ssr: false,
  async buildEnd() {
    const clientBuildDirectory = path.resolve(buildDirectory, "client");
    const buildRootDirectory = path.resolve(buildDirectory);

    for (const entry of await readdir(clientBuildDirectory)) {
      await rename(
        path.join(clientBuildDirectory, entry),
        path.join(buildRootDirectory, entry),
      );
    }

    await rm(clientBuildDirectory, { recursive: true, force: true });
  },
} satisfies Config;
