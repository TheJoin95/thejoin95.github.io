"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function NewsletterForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);

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
      setStatus({ message: result.message, error: !response.ok });
      if (response.ok) form.reset();
    } catch {
      setStatus({ message: "Unable to subscribe right now. Please try again.", error: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={status?.error || undefined} data-disabled={pending || undefined}>
          <FieldLabel htmlFor="newsletter-email">Email address</FieldLabel>
          <Input id="newsletter-email" name="email" type="email" autoComplete="email"
            placeholder="you@example.com" required maxLength={254} disabled={pending}
            aria-invalid={status?.error || undefined} aria-describedby="newsletter-status" />
        </Field>
        <div hidden aria-hidden="true">
          <label htmlFor="newsletter-website">Leave this empty</label>
          <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <Field>
          <Button type="submit" disabled={pending}>{pending ? "Subscribing…" : "Subscribe"}</Button>
        </Field>
      </FieldGroup>
      <p id="newsletter-status" role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {status?.message}
      </p>
    </form>
  );
}
