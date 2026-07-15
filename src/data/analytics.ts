export interface DailyMetric {
  date: string;
  views: number;
  watchTime: number; // minutes
  subscribers: number;
  revenue: number;
}

export interface TrafficSource {
  source: string;
  percentage: number;
  views: number;
}

export interface DeviceBreakdown {
  device: string;
  percentage: number;
}

export interface AgeBreakdown {
  range: string;
  percentage: number;
}

function generateDailyData(days: number): DailyMetric[] {
  const data: DailyMetric[] = [];
  const base = new Date("2025-05-12");
  let cumSubs = 2_350_000;

  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const weekday = d.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const spike = i === 14 || i === 21 ? 2.4 : 1;
    const base_views = isWeekend ? 38_000 : 52_000;
    const views = Math.round((base_views + Math.random() * 18_000 - 9_000) * spike);
    const newSubs = Math.round(views * 0.0018 + Math.random() * 80);
    cumSubs += newSubs;

    data.push({
      date: d.toISOString().slice(0, 10),
      views,
      watchTime: Math.round(views * 4.2),
      subscribers: cumSubs,
      revenue: Math.round(views * 0.0032 * 100) / 100,
    });
  }
  return data;
}

export const analyticsData28 = generateDailyData(28);
export const analyticsData90 = generateDailyData(90);

export const trafficSources: TrafficSource[] = [
  { source: "Browse features",    percentage: 34, views: 421_000 },
  { source: "YouTube search",     percentage: 28, views: 347_000 },
  { source: "External",           percentage: 14, views: 173_000 },
  { source: "Suggested videos",   percentage: 12, views: 149_000 },
  { source: "Direct / unknown",   percentage:  7, views:  87_000 },
  { source: "Notifications",      percentage:  5, views:  62_000 },
];

export const deviceBreakdown: DeviceBreakdown[] = [
  { device: "Mobile",  percentage: 58 },
  { device: "Desktop", percentage: 31 },
  { device: "Tablet",  percentage:  8 },
  { device: "TV",      percentage:  3 },
];

export const ageBreakdown: AgeBreakdown[] = [
  { range: "13–17", percentage:  6 },
  { range: "18–24", percentage: 28 },
  { range: "25–34", percentage: 35 },
  { range: "35–44", percentage: 18 },
  { range: "45–54", percentage:  9 },
  { range: "55+",   percentage:  4 },
];
