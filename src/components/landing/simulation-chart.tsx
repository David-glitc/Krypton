"use client"

import { LineChart, Line } from "@/components/charts/line-chart"
import { Grid } from "@/components/charts/grid"
import { XAxis } from "@/components/charts/x-axis"
import { ChartTooltip } from "@/components/charts/tooltip"

const simulationData = [
  { date: new Date("2025-01-01"), nav: 100, benchmark: 100 },
  { date: new Date("2025-02-01"), nav: 102.4, benchmark: 101.1 },
  { date: new Date("2025-03-01"), nav: 104.8, benchmark: 100.6 },
  { date: new Date("2025-04-01"), nav: 103.2, benchmark: 102.3 },
  { date: new Date("2025-05-01"), nav: 107.1, benchmark: 103.8 },
  { date: new Date("2025-06-01"), nav: 109.5, benchmark: 104.2 },
  { date: new Date("2025-07-01"), nav: 108.3, benchmark: 105.9 },
  { date: new Date("2025-08-01"), nav: 112.0, benchmark: 106.4 },
  { date: new Date("2025-09-01"), nav: 114.6, benchmark: 107.1 },
  { date: new Date("2025-10-01"), nav: 113.8, benchmark: 108.5 },
  { date: new Date("2025-11-01"), nav: 116.2, benchmark: 109.0 },
  { date: new Date("2025-12-01"), nav: 118.9, benchmark: 110.2 },
]

export function SimulationChart() {
  return (
    <div className="panel p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label mb-2">simulation_output</p>
          <h3 className="font-[family-name:var(--font-hanken)] text-xl font-semibold text-text-primary">
            Backtest vs benchmark
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Monte Carlo survivors scored against policy constraints before execution.
          </p>
        </div>
        <div className="flex gap-4 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-secondary">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Policy NAV
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-info" />
            Benchmark
          </span>
        </div>
      </div>
      <LineChart
        data={simulationData}
        aspectRatio="2.4 / 1"
        margin={{ top: 16, right: 16, bottom: 32, left: 16 }}
        className="w-full"
      >
        <Grid horizontal stroke="var(--chart-grid)" />
        <Line dataKey="nav" stroke="var(--chart-line-primary)" strokeWidth={2.5} />
        <Line dataKey="benchmark" stroke="var(--chart-line-secondary)" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  )
}
