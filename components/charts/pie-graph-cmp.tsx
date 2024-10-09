'use client';

import * as React from 'react';
import { Pie, PieChart, Label } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslations } from 'next-intl';

export function PieGraphCmp({ chartData, title }: any) {
  const t = useTranslations();

  const totalValue = React.useMemo(() => {
    return chartData?.reduce((acc: number, curr: any) => acc + curr.total_amount, 0);
  }, [chartData]);

  const genderChartConfig = {
    total_amount: {
      label: 'Customers'
    },
    males: {
      label: 'גברים',
      color: 'hsl(var(--pie-five))'
    },
    females: {
      label: t('females'),
      color: 'hsl(var(--pie-six))'
    },
    other: {
      label: t('other'),
      color: 'hsl(var(--pie-seven))'
    }
  };

  if (!chartData) return null;

  return (
    <ChartContainer
      config={genderChartConfig}
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
          fill="hsl(var(--chart-default))"
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
                      {totalValue.toLocaleString()}
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
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
