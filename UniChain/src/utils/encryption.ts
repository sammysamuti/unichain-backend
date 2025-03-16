import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = Buffer.from(
  process.env.ENCRYPTION_KEY || "32-char-key-1234567890abcdefghi"
);
const iv = crypto.randomBytes(16);

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}
