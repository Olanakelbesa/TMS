import { cn } from "../../lib/utils";

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none",
            "focus:border-primary focus:ring-4 focus:ring-primary/10",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "hover:border-slate-300",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none resize-none min-h-[120px]",
          "focus:border-primary focus:ring-4 focus:ring-primary/10",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "hover:border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}
