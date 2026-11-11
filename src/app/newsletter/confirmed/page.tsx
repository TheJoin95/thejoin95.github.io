import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subscription confirmed", robots: { index: false } };
export default function Confirmed() {
  return (
    <div className="site-container section-space flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Thanks for confirming.</h1>
      <p className="text-muted-foreground">You’re on the list. See you in your inbox.</p>
      <Link href="/" className="underline underline-offset-4">Back to home</Link>
    </div>
  );
}
