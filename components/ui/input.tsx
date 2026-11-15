import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-brand-purple",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";