import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <header className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Miki Lombardi</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">A new space for ideas.</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          The next chapter of my website is taking shape. More soon.
        </p>
        <div><Button asChild variant="outline">
          <Link href="/experience">Explore the experience</Link>
        </Button></div>
      </header>
      <section aria-labelledby="newsletter-title" className="flex max-w-md flex-col gap-4">
        <h2 id="newsletter-title" className="text-xl font-medium">Stay in the loop</h2>
        <p className="text-sm text-muted-foreground">
          Subscribe for new writing and updates. Unsubscribe at any time.
        </p>
        <NewsletterForm />
      </section>
    </main>
  );
}
