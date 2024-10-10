'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  total_revenue: {
    label: 'סה"כ הכנסות',
    color: 'hsl(var(--chart-1))'
  },
  transaction_count: {
    label: 'מספר עסקאות',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

interface AreaGraphProps {
  data: {
    hour: string;
    vendor: string;
    transaction_count: number;
    total_revenue: number;
  }[];
}

export function AreaGraph({ data }: AreaGraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>גרף אזורי לפי ספק - שעות</CardTitle>
        <CardDescription>
          סהכ הכנסות ומספר עסקאות לפי שעה לכל ספק
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                left: 12,
                right: 12
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
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
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {Array.from(new Set(data.map((item) => item.vendor))).map((vendor) => (
                <React.Fragment key={vendor}>
                  <Area
                    type="monotone"
                    dataKey={(d) => (d.vendor === vendor ? d.total_revenue : 0)}
                    name={`סה"כ הכנסות - ${vendor}`}
                    fill={chartConfig.total_revenue.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.total_revenue.color}
                    yAxisId="left"
                    stackId="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey={(d) => (d.vendor === vendor ? d.transaction_count : 0)}
                    name={`מספר עסקאות - ${vendor}`}
                    fill={chartConfig.transaction_count.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.transaction_count.color}
                    yAxisId="right"
                    stackId="transactions"
                  />
                </React.Fragment>
              ))}
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              סיכום מכירות לפי ספק לשעות נבחרות
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              26-28 ספטמבר 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
