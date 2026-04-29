import { cn } from "../../lib/utils";

export function Card({ children, className }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, className }) {
  return (
    <div className={cn("p-6 border-b border-slate-100", className)}>
      <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={cn("p-6 bg-slate-50/50 border-t border-slate-100", className)}>{children}</div>;
}
