"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Small copy button for any address shown in full next to it. */
export function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard refused (embedded view); the address stays selectable.
        }
      }}
      aria-label="Copy address"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-mist text-ink/70 hover:bg-cloud"
    >
      {copied ? <Check className="size-4 text-up" /> : <Copy className="size-4" />}
    </button>
  );
}
