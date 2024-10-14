// @ts-nocheck
'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface RevenueLineGraphProps {
  data: {
    hour: string;
    total_revenue: number;
  }[];
  title: string;
  description: string;
}

const chartConfig = {
  totalRevenue: {
    label: 'הכנסות מצטברות',
    color: '#8884d8', // You can customize the color for the line
  },
};

function processData(rawData) {
  // Step 1: Group data by hour and sum revenue
  const groupedData = rawData.reduce((acc, item) => {
    const hour = item.hour;
    const revenue = parseFloat(item.total_revenue); // Ensure it's a number

    if (!acc[hour]) {
      acc[hour] = { hour, total_revenue: 0 };
    }
    acc[hour].total_revenue += revenue;

    return acc;
  }, {});

  // Convert the grouped data back to an array
  const sortedData = Object.values(groupedData).sort((a, b) => new Date(a.hour) - new Date(b.hour));

  // Step 2: Calculate cumulative revenue
  let cumulative = 0;
  return sortedData.map(item => {
    cumulative += item.total_revenue;
    return { ...item, cumulative_revenue: cumulative };
  });
}

export function RevenueLineGraph({ data, title, description }: RevenueLineGraphProps) {
  const processedData = processData(data);
  const totalRevenue = processedData.reduce((acc, item) => acc + item.total_revenue, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{`סה"כ מכירות בקרדיטים - ${formatNumber(totalRevenue)}`}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
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
                formatter={(value) => `₪${value.toLocaleString()}`}
                content={({ payload, label }) => {
                  if (!payload || payload.length === 0) return null;

                  const date = new Date(label);
                  const formattedDate = date.toLocaleDateString('he-IL', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Jerusalem',
                  });

                  return (
                    <div className="bg-white p-3 rounded shadow-md text-right">
                      {/* Date Title */}
                      <div className="font-semibold mb-2">{formattedDate}</div>
                      {/* Revenue Details */}
                      <div>{`הכנסות מצטברות: ₪${payload[0].value.toLocaleString()}`}</div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="cumulative_revenue"
                stroke={chartConfig.totalRevenue.color}
                strokeWidth={2}
                name={chartConfig.totalRevenue.label}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
