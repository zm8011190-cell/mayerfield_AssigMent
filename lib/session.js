import { headers } from "next/headers";
import { auth } from "./auth.js";

// The login check. Reads the session cookie from the incoming request and
// asks Better Auth who it belongs to. Returns the user, or null if signed out.
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
