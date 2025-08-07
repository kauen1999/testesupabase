import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type Entry = { id: number; text: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Entry[] | { error: string }>
) {
  try {
    if (req.method === "POST") {
      const { text } = req.body as { text?: string };
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }
      await prisma.entry.create({ data: { text } });
    }
    const all = await prisma.entry.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json(all);
  } catch (err: any) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
