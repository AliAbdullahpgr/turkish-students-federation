/**
 * Creates or promotes the administrator account.
 *
 *   npm run admin:create -- admin@tsfturkey.org "Ad Soyad" "a-long-password"
 *
 * Public sign-up is disabled in `src/lib/auth.ts`, so this script is the only
 * way an account comes into existence. It goes through better-auth's own API
 * rather than inserting rows directly, so the password is hashed with the same
 * scrypt parameters sign-in will verify against — a hand-written INSERT
 * produces a row that can never log in.
 *
 * Re-running it for an existing address promotes that account to `admin` and
 * leaves the password alone.
 */
import { eq } from "drizzle-orm";
import { auth } from "../src/lib/auth";
import { db } from "../src/db/client";
import { user } from "../src/db/schema";

const MIN_PASSWORD_LENGTH = 12;

async function main() {
  const [email, name, password] = process.argv.slice(2);

  if (!email || !name) {
    console.error(
      'Usage: npm run admin:create -- <email> "<name>" [password]\n' +
        "The password may be omitted only for an account that already exists.",
    );
    process.exit(1);
  }

  const existing = await db
    .select({ id: user.id, role: user.role })
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .get();

  if (existing) {
    if (existing.role === "admin") {
      console.log(`${email} is already an administrator. Nothing to do.`);
      return;
    }
    await db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id)).run();
    console.log(`Promoted ${email} to administrator.`);
    return;
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `A password of at least ${MIN_PASSWORD_LENGTH} characters is required to create a new account.`,
    );
    process.exit(1);
  }

  /*
    `auth.api.signUpEmail` is refused here — `disableSignUp: true` closes the
    server-side API as well as the HTTP endpoint, which is the behaviour we
    want everywhere except this script. Going through the internal adapter
    keeps the one thing that actually matters: `ctx.password.hash` is the same
    hasher sign-in verifies with, so the row it writes can log in. A
    hand-written INSERT with some other hash cannot.
  */
  const ctx = await auth.$context;

  const created = await ctx.internalAdapter.createUser(
    {
      email: email.toLowerCase(),
      name,
      emailVerified: true,
      // Granted at creation so a failure below cannot leave a half-made account.
      role: "admin",
    },
    // Provisioning origin. "admin" is the out-of-band case: an operator
    // creating the account directly, not a visitor signing themselves up.
    { method: "admin" },
  );

  await ctx.internalAdapter.createAccount({
    userId: created.id,
    providerId: "credential",
    accountId: created.id,
    password: await ctx.password.hash(password),
  });

  console.log(`Created administrator ${email}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
