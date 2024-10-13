'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  total_amount: {
    label: 'Deposits'
  },
  Deposit: {
    label: 'Deposit',
    color: 'hsl(var(--chart-1))'
  },
  'Without Payment': {
    label: 'Without Payment',
    color: 'white'
  },
  'POS Deposit': {
    label: 'POS Deposit',
    color: 'hsl(var(--chart-4))'
  }
};

export function PieGraphTotal({chartData, title} :any ) {
  const totalDeposits = React.useMemo(() => {
    return chartData?.reduce((acc : number, curr: any) => acc + curr.total_amount, 0);
  }, [chartData]);

  if(!chartData) return null;
  
  return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total_amount"
              nameKey="displayName"
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
                          {totalDeposits.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {title}
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
