"use client";

import { useActionState } from "react";
import { captureLead } from "@/app/actions/public";

type Props = {
  pageId: string;
  heading?: string | null;
  buttonClassName: string;
  buttonStyle?: React.CSSProperties;
  inputClassName: string;
  mutedClassName: string;
};

// Email lead-capture block rendered on public pages when collectEmails is on.
export function SubscribeForm({
  pageId,
  heading,
  buttonClassName,
  buttonStyle,
  inputClassName,
  mutedClassName,
}: Props) {
  const action = captureLead.bind(null, pageId);
  const [state, formAction] = useActionState(action, undefined);

  if (state?.ok) {
    return (
      <p className={`text-center text-sm ${mutedClassName}`}>
        Thanks for subscribing! 🎉
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      {heading && (
        <p className="text-center text-sm font-medium">{heading}</p>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={`min-w-0 flex-1 px-4 py-3 text-sm outline-none ${inputClassName}`}
        />
        <button
          type="submit"
          className={`shrink-0 px-4 py-3 text-sm font-semibold ${buttonClassName}`}
          style={buttonStyle}
        >
          Subscribe
        </button>
      </div>
      {state && !state.ok && (
        <p className="text-center text-xs text-red-300">{state.error}</p>
      )}
    </form>
  );
}
