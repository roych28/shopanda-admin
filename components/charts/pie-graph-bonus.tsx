// @ts-nocheck
'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
  
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const bonusChartData = [
  { type: 'App Bonus:  ', total_bonus: 11295, fill: 'blue' },
  { type: 'Info Bonus:  ', total_bonus: 3880, fill: 'yellow' },
  { type: 'POS Bonus:  ', total_bonus: 0, fill: 'red' }
];

const bonusChartConfig = {
  total_bonus: {
    label: 'Bonuses'
  },
  'App Bonus': {
    label: 'App Bonus',
    color: 'hsl(var(--chart-1))'
  },
  'Info Bonus': {
    label: 'Info Bonus',
    color: 'hsl(var(--chart-2))'
  },
  'POS Bonus': {
    label: 'POS Bonus',
    color: 'hsl(var(--chart-3))'
  }
};

export function PieGraphBonus() {
  const totalBonuses = React.useMemo(() => {
    return bonusChartData.reduce((acc, curr) => acc + parseFloat(curr.total_bonus), 0);
  }, []);

  return (
    <ChartContainer
      config={bonusChartConfig}
      className="mx-auto aspect-square max-h-[360px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={bonusChartData}
          dataKey="total_bonus"
          nameKey="type"
          innerRadius={60}
          outerRadius={100}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalBonuses.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Bonuses
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
