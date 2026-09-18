import { existsSync } from "node:fs";
import { config } from "dotenv";

/*
  `.env.local` is the per-developer override and is not always present — this
  repo only ships `.env`. Loading whichever exists keeps the database-backed
  tests from failing with "URL_INVALID: the URL 'undefined'", which is what
  they did whenever `.env.local` was absent.
*/
config({ path: existsSync(".env.local") ? ".env.local" : ".env" });
