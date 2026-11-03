import { createAuthClient } from "better-auth/react";

// No baseURL needed: the API lives in the same Next.js app.
export const authClient = createAuthClient();
