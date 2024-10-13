'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
    hourly_count: string; // String based on your data
  }[];
  title: string;
  description: string;
}

export function BarGraph({ data, title, description }: BarGraphProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('hourly_count');

  // Compute the cumulative pairings till each hour
  const dataWithCumulative = React.useMemo(() => {
    let cumulativeSum = 0;
    return data.map((item) => {
      const hourlyCount = +item.hourly_count; // Convert string to number
      cumulativeSum += hourlyCount;
      return {
        ...item,
        hourly_count: hourlyCount,
        cumulative_count: cumulativeSum, // Add cumulative count
      };
    });
  }, [data]);

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
          {/* Add the total count of pairings */}
          <div className="text-lg font-semibold text-gray-700">{`סך הכל צימודים: ${total.hourly_count}`}</div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={dataWithCumulative}
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
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
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
                  formatter={(value, name, props) => {
                    const hourlyCount = props.payload.hourly_count;
                    const cumulativeCount = props.payload.cumulative_count;
                    return `צימודים לשעה: ${hourlyCount}\r\nסך הכל צימודים עד עכשיו: ${cumulativeCount}`;
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
