import { Catalog } from "@/types";
import fs from "fs/promises";
import path from "path";

export async function getCatalog(): Promise<Catalog> {
    // Read from filesystem to support SSG/SSR without absolute URL
    const filePath = path.join(process.cwd(), "public", "catalog.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
}
