import { createRoot } from "react-dom/client";
import { Analytics } from "../../src/components/analytics";
import { NewsletterForm } from "../../src/components/newsletter-form";
import { SiteFooter } from "../../src/components/site/shell";

createRoot(document.getElementById("analytics-fixture")!).render(
  <Analytics>
    <a href="#analytics-fixture">Analytics test link</a>
    <button type="button">Analytics test button</button>
    <NewsletterForm />
    <SiteFooter />
  </Analytics>,
);
