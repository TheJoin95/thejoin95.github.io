import { useState } from "react";
import { createRoot } from "react-dom/client";
import ErrorPage from "../../src/app/error";

function ErrorFixture() {
  const [recovered, setRecovered] = useState(false);
  return recovered ? <><h1>Recovery fixture</h1><p role="status">The recovery callback ran.</p></>
    : <ErrorPage error={new Error("Test-only error specimen")} reset={() => setRecovered(true)} />;
}
createRoot(document.getElementById("accessibility-fixture")!).render(<ErrorFixture />);
