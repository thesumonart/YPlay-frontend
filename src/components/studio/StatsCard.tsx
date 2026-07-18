import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  index?: number;
}

export function StatsCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  index = 0,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium rounded-md px-2 py-1",
              isPositive && "text-success bg-success/10",
              isNegative && "text-danger bg-danger/10",
              isNeutral && "text-text-secondary bg-surface-secondary",
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold text-text tabular-nums">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
        {changeLabel && (
          <p className="text-xs text-text-secondary mt-0.5">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
