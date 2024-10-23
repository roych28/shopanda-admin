// @ts-nocheck
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
  4: {
    label: 'המזנון',
    color: '#1f77b4',
  },
  5: {
    label: "צ'אי שופ / הבר",
    color: '#ff7f0e',
  }
  // Add more vendors as needed with their unique IDs, labels, and colors
};

interface SalesBarGraphProps {
  data: {
    hour: string;
    [key: string]: number | string; // Allow dynamic vendor keys
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
      <CardContent className="px-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full sm:h-[400px]"
        >
          <div style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3' }}>
            <ResponsiveContainer>
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
                  formatter={(value, name, props) => {
                    const vendorId = props.dataKey.split('_')[1];
                    const vendorConfig = chartConfig[vendorId];

                    // Skip showing tooltip if revenue is 0
                    if (value === 0) return null;

                    return `עסקאות: ${value}`;
                  }}
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
                        {/* Transaction Details */}
                        {payload.map((item, index) => {
                          const vendorId = item.dataKey.split('_')[1];
                          const vendorConfig = chartConfig[vendorId];
                          const vendorColor = vendorConfig.color;

                          return (
                            <div key={index} className="flex items-center justify-end">
                              <span>{`עסקאות: ${item.value}`}</span>
                              <div
                                className="inline-block w-3 h-3 ml-2"
                                style={{ backgroundColor: vendorColor }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                />
                <Legend
                  formatter={(value) => chartConfig[value]?.label || value}
                />
                {Object.keys(chartConfig).map((vendorId) => (
                  <Bar
                    key={vendorId}
                    dataKey={`vendor_${vendorId}_count`}
                    fill={chartConfig[vendorId].color}
                    name={vendorId}
                    barSize={30}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
