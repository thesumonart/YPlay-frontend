"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatViews } from "@/lib/utils";

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
];

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  formatter?: (v: number) => string;
}

function CustomTooltip({ active, payload, label, formatter }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-lg text-xs">
      {label && <p className="font-semibold text-[var(--text)] mb-1.5">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)]">{p.name}:</span>
          <span className="font-medium text-[var(--text)]">
            {formatter ? formatter(p.value) : formatViews(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface AreaChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  xKey?: string;
  color?: string;
  label?: string;
  formatter?: (v: number) => string;
  height?: number;
}

export function AnalyticsAreaChart({
  data, dataKey, xKey = "date", color = "var(--primary)",
  label, formatter, height = 220,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: string) => v.slice(5)}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatViews(v)}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatter} />}
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={label ?? dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${dataKey})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  xKey?: string;
  color?: string;
  label?: string;
  formatter?: (v: number) => string;
  height?: number;
}

export function AnalyticsBarChart({
  data, dataKey, xKey = "source", color = "var(--secondary)",
  label, formatter, height = 220,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 80, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatViews(v)}
        />
        <YAxis
          type="category"
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
          tickLine={false}
          axisLine={false}
          width={76}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatter} />}
          cursor={{ fill: "var(--surface-secondary)" }}
        />
        <Bar dataKey={dataKey} name={label ?? dataKey} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function AnalyticsDonutChart({ data, height = 220 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0];
            return (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-lg text-xs">
                <p className="font-semibold text-[var(--text)]">{p.name}</p>
                <p className="text-[var(--text-secondary)]">{p.value}%</p>
              </div>
            );
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
