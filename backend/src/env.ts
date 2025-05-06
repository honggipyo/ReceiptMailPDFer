import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  SENDGRID_API_KEY: z.string().catch("sendgrid_api_key"),
});

export const env = envSchema.parse(process.env);
