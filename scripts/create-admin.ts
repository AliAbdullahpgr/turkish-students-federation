import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API = "https://api.clerk.com/v1";

async function createAdmin() {
  // First check if user already exists
  const listRes = await fetch(
    `${CLERK_API}/users?email_address=${encodeURIComponent("admin@tfs.pk")}`,
    {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!listRes.ok) {
    const err = await listRes.json();
    console.error("Failed to check existing users:", JSON.stringify(err, null, 2));
    process.exit(1);
  }

  const existing = await listRes.json();
  if (existing.data && existing.data.length > 0) {
    const user = existing.data[0];
    console.log("User already exists:", user.id, user.email_addresses?.[0]?.email_address);

    // Update metadata to make admin
    const updateRes = await fetch(`${CLERK_API}/users/${user.id}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { isAdmin: true },
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      console.error("Failed to update metadata:", JSON.stringify(err, null, 2));
      process.exit(1);
    }

    const updated = await updateRes.json();
    console.log("Admin metadata set:", JSON.stringify(updated.public_metadata, null, 2));
    console.log("Password remains unchanged. Reset via Clerk Dashboard if needed.");
  } else {
    // Create new user
    const createRes = await fetch(`${CLERK_API}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: ["admin@tfs.pk"],
        password: "tsf789admin",
        public_metadata: { isAdmin: true },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      console.error("Failed to create user:", JSON.stringify(err, null, 2));
      process.exit(1);
    }

    const user = await createRes.json();
    console.log("Admin user created!");
    console.log("ID:", user.id);
    console.log("Email:", user.email_addresses?.[0]?.email_address);
    console.log("Admin:", user.public_metadata?.isAdmin);
  }
}

createAdmin();
