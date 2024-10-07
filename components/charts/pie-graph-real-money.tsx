'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
  
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const realMoneyChartData = [
  { 
    type: 'App Real Money:  ', 
    total_real_money: 71705, 
    fill: 'blue' 
  },
  { 
    type: 'Info Real Money:  ', 
    total_real_money: 35650, 
    fill: 'yellow' 
  },
  { 
    type: 'POS Real Money:  ', 
    total_real_money: 23141, 
    fill: 'red' 
  }
];

const realMoneyChartConfig = {
  total_real_money: {
    label: 'Real Money'
  },
  'App Real Money': {
    label: 'App Real Money',
    color: 'hsl(var(--chart-1))'
  },
  'Info Real Money': {
    label: 'Info Real Money',
    color: 'hsl(var(--chart-2))'
  },
  'POS Real Money': {
    label: 'POS Real Money',
    color: 'hsl(var(--chart-3))'
  }
};

export function PieGraphRealMoney() {
  const totalRealMoney = React.useMemo(() => {
    return realMoneyChartData.reduce((acc, curr) => acc + curr.total_real_money, 0);
  }, []);

  return (
    <ChartContainer
      config={realMoneyChartConfig}
      className="mx-auto aspect-square max-h-[360px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={realMoneyChartData}
          dataKey="total_real_money"
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
                      {totalRealMoney.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Real Money
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
