"use client";

import {
  AreaChart,
  Badge,
  Card,
  Grid,
  Metric,
  Text,
  Title,
} from "@tremor/react";

import type { EnergySummary } from "@/lib/energy";

type EnergyDashboardProps = {
  summary: EnergySummary;
  recommendation?: string;
  savingsPotentialKg?: number;
};

export function EnergyDashboard({
  summary,
  recommendation,
  savingsPotentialKg,
}: EnergyDashboardProps) {
  const chartData = summary.trend.map((point) => ({
    date: point.day,
    "Energy (kWh)": point.kwh,
    "Carbon (kg)": point.carbonKg,
  }));

  return (
    <div className="space-y-6">
      <Grid numItemsMd={2} className="gap-6">
        <Card className="glass-panel">
          <Text>Total Weekly Energy</Text>
          <Metric>{summary.totalKwh.toFixed(2)} kWh</Metric>
          <Badge color="emerald" className="mt-3">
            Edge-synced
          </Badge>
        </Card>
        <Card className="glass-panel">
          <Text>Total Weekly Carbon</Text>
          <Metric>{summary.totalCarbonKg.toFixed(2)} kg CO2</Metric>
          <Badge color="amber" className="mt-3">
            AI monitored
          </Badge>
        </Card>
      </Grid>

      <Card className="glass-panel">
        <Title>7-Day Energy and Carbon Trend</Title>
        <Text>Live from edge ingestion + Turso analytics.</Text>
        <AreaChart
          className="mt-6 h-72"
          data={chartData}
          index="date"
          categories={["Energy (kWh)", "Carbon (kg)"]}
          colors={["emerald", "cyan"]}
          valueFormatter={(value) => `${Number(value).toFixed(2)}`}
          showAnimation
        />
      </Card>

      <Card className="glass-panel">
        <Title>AI Carbon Recommendation</Title>
        <Text className="mt-3 text-sm leading-7 text-slate-700">
          {recommendation ??
            "Run AI analysis to surface personalized recommendations based on your edge telemetry."}
        </Text>
        <p className="mt-4 font-mono text-sm text-teal-700">
          Potential savings: {Number(savingsPotentialKg ?? 0).toFixed(2)} kg CO2 / week
        </p>
      </Card>
    </div>
  );
}
