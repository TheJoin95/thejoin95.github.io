"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [pending, setPending] = useState(false);
  const hydrated = useHydrated();
  const summary = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<{ message: string; error: boolean; invalidEmail?: boolean } | null>(null);
  useEffect(() => { if (status?.error) summary.current?.focus(); }, [status]);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website") }),
      });
      const result = await response.json();
      setStatus({ message: result.message, error: !response.ok, invalidEmail: response.status === 400 });
      if (response.ok) form.reset();
    } catch {
      setStatus({ message: "Unable to subscribe right now. Please try again.", error: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={subscribe} aria-busy={pending} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={status?.invalidEmail || undefined} data-disabled={!hydrated || pending || undefined}>
          <FieldLabel htmlFor="newsletter-email">Email address</FieldLabel>
          <Input id="newsletter-email" name="email" type="email" autoComplete="email"
            placeholder="you@example.com" required maxLength={254} disabled={!hydrated || pending}
            aria-invalid={status?.invalidEmail || undefined} aria-describedby="newsletter-status" />
        </Field>
        <div hidden aria-hidden="true">
          <label htmlFor="newsletter-website">Leave this empty</label>
          <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <Field>
          <Button type="submit" disabled={!hydrated || pending}>{pending ? "Subscribing…" : "Subscribe"}</Button>
        </Field>
      </FieldGroup>
      {!hydrated ? <p>Newsletter signup needs JavaScript. You can <a href="/rss.xml">follow the Journal by RSS</a>.</p> : null}
      <p id="newsletter-status" ref={summary} tabIndex={-1} role={status?.error ? undefined : "status"}
        aria-live={status?.error ? "off" : "polite"} aria-atomic="true"
        className={cn("min-h-5 text-sm", status?.error ? "text-destructive" : "text-muted-foreground")}>
        {status?.message}
      </p>
    </form>
  );
}
