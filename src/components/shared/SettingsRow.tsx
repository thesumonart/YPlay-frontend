import { cn } from "@/lib/utils";

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsRow({
  label,
  description,
  children,
  className,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 py-4 border-b border-border last:border-0",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-text">{label}</span>
        {description && (
          <span className="text-xs text-text-secondary leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-text">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-border bg-surface px-5 divide-y divide-border">
        {children}
      </div>
    </div>
  );
}
