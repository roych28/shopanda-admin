'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

//export const description = 'Pairings per hour bar chart';

const chartConfig = {
  views: {
    label: 'Pairings per Hour'
  },
  hourly_count: {
    label: 'צימודים',
    color: 'hsl(var(--chart-1))'
  }
};

interface BarGraphProps {
  data: {
    hour: string;
    hourly_count: number;
  }[];
  title: string;
  description: string;
}

export function BarGraph({ data, title, description }: BarGraphProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('hourly_count');

  const total = React.useMemo(
    () => ({
      hourly_count: data.reduce((acc, curr) => acc + (+curr.hourly_count), 0)
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString('he-IL', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Jerusalem'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="hourly_count"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('he-IL', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'Asia/Jerusalem'
                    });
                  }}
                />
              }
            />
            <Bar dataKey="hourly_count" fill="var(--color-hourly_count)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}