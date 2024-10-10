'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  vendorA: {
    label: 'המזנון',
    color: '#1f77b4'
  },
  vendorB: {
    label: "צ'אי שופ / הבר",
    color: '#ff7f0e'
  }
};

interface SalesBarGraphProps {
  data: {
    hour: string;
    vendorA_count: number;
    vendorB_count: number;
    vendorA_revenue: number;
    vendorB_revenue: number;
  }[];
  title: string;
  description: string;
}

export function SalesBarGraph({ data, title, description }: SalesBarGraphProps) {
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
      <CardContent className="sm:p-10 pl-10">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full sm:h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                left: 0,
                right: 0,
                top: 20,
                bottom: 20
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
              <Tooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="hour"
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
              <Legend
                formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
              <Bar
                dataKey="vendorA_count"
                fill={chartConfig.vendorA.color}
                name={chartConfig.vendorA.label}
                barSize={30}
              />
              <Bar
                dataKey="vendorB_count"
                fill={chartConfig.vendorB.color}
                name={chartConfig.vendorB.label}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
