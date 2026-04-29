import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export function Button({ className, variant = "primary", size = "md", isLoading, children, ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-white text-text-primary border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    accent: "bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20",
    outline: "bg-transparent border border-slate-200 text-text-primary hover:bg-slate-50",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
