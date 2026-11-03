import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// One catch-all route handles sign-up, sign-in, sign-out and session lookup.
export const { GET, POST } = toNextJsHandler(auth);
