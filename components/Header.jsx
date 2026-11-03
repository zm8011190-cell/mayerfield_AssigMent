"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/#catalog", label: "Books" },
  { href: "/#events", label: "Events" },
  { href: "/#visit", label: "Visit" },
];

export default function Header() {
  const router = useRouter();
  // useSession reads the session cookie, so it survives a page refresh.
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 bg-forest px-5 py-4 text-paper md:px-8">
      <Link href="/" className="font-heading text-xl font-bold">
        Marginalia Books
      </Link>
      <nav aria-label="Main">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="border-b-2 border-transparent py-1 hover:border-mustard">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {isPending ? null : session ? (
              <span className="flex flex-wrap items-center gap-3">
                <span>Hi, {session.user.name}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded border border-paper px-3 py-1 hover:bg-paper hover:text-forest"
                >
                  Sign out
                </button>
              </span>
            ) : (
              <Link
                href="/login"
                className="rounded border border-paper px-3 py-1 hover:bg-paper hover:text-forest"
              >
                Sign in
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
