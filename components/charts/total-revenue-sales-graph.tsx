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
  CardTitle,
  CardFooter
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
    transaction_count: number;
  }[];
  title: string;
  description: string;
}

const chartConfig = {
  totalRevenue: {
    label: 'הכנסות מצטברות',
    color: '#8884d8', // You can customize the color for the revenue line
  },
  cumulativeTransactions: {
    label: 'כמות עסקאות מצטברת',
    color: '#82ca9d', // Color for the transaction count line
  },
  averageTransaction: {
    label: 'ממוצע עסקה',
    color: '#ff7300', // Color for the average transaction line
  },
};

function processData(rawData) {
  // Step 1: Group data by hour and sum revenue and transactions
  const groupedData = rawData.reduce((acc, item) => {
    const hour = item.hour;
    const revenue = parseFloat(item.total_revenue); // Ensure it's a number
    const transactionCount = parseFloat(item.transaction_count); // Ensure it's a number

    if (!acc[hour]) {
      acc[hour] = { hour, total_revenue: 0, transaction_count: 0 };
    }
    acc[hour].total_revenue += revenue;
    acc[hour].transaction_count += transactionCount;

    return acc;
  }, {});

  // Convert the grouped data back to an array
  const sortedData = Object.values(groupedData).sort((a, b) => new Date(a.hour) - new Date(b.hour));

  // Step 2: Calculate cumulative revenue, cumulative transactions, and average transaction
  let cumulativeRevenue = 0;
  let cumulativeTransactions = 0;
  return sortedData.map(item => {
    cumulativeRevenue += item.total_revenue;
    cumulativeTransactions += item.transaction_count;

    const averageTransaction = item.transaction_count > 0
      ? item.total_revenue / item.transaction_count
      : 0;

    return {
      ...item,
      cumulative_revenue: cumulativeRevenue,
      cumulative_transactions: cumulativeTransactions,
      average_transaction: averageTransaction,
    };
  });
}

export function RevenueLineGraph({ data, title, description }: RevenueLineGraphProps) {
  const processedData = processData(data);
  const totalRevenue = processedData.reduce((acc, item) => acc + item.total_revenue, 0);
  const totalTransactions = processedData.reduce((acc, item) => acc + item.transaction_count, 0);
  const averageTransactionAmount = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;


  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{`סה"כ מכירות בקרדיטים - ${formatNumber(totalRevenue)}`}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full sm:h-[400px]">
        <div style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3' }}>
        <ResponsiveContainer>
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
                      {/* Tooltip content based on the line hovered */}
                      {payload.map((entry, index) => {
                        if (entry.dataKey === 'cumulative_revenue') {
                          return (
                            <div key={index}>{`הכנסות מצטברות: ${entry.value.toLocaleString()}`}</div>
                          );
                        }
                        if (entry.dataKey === 'cumulative_transactions') {
                          return (
                            <div key={index}>{`כמות עסקאות מצטברת: ${entry.value}`}</div>
                          );
                        }
                        if (entry.dataKey === 'average_transaction') {
                          return (
                            <div key={index}>{`ממוצע עסקה: ${entry.value.toLocaleString()}`}</div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                }}
              />
              {/* Line for cumulative revenue */}
              <Line
                type="monotone"
                dataKey="cumulative_revenue"
                stroke={chartConfig.totalRevenue.color}
                strokeWidth={2}
                name={chartConfig.totalRevenue.label}
              />
              {/* Line for cumulative transaction count */}
              <Line
                type="monotone"
                dataKey="cumulative_transactions"
                stroke={chartConfig.cumulativeTransactions.color}
                strokeOpacity={0} 
                strokeWidth={0} 
                dot={false}        
                activeDot={false}
                name={chartConfig.cumulativeTransactions.label}
              />
              {/* Line for average transaction */}
              <Line
                type="monotone"
                dataKey="average_transaction"
                stroke={chartConfig.averageTransaction.color}
                strokeOpacity={0} 
                strokeWidth={0} 
                dot={false}        
                activeDot={false}
                name={chartConfig.averageTransaction.label}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        {/* Footer with total transactions and average transaction */}
        <div className="mt-4 text-right text-md">
          <div>{`סה"כ עסקאות: ${totalTransactions.toLocaleString()}`}</div>
          <div>{`עסקה ממוצעת: ${averageTransactionAmount.toFixed(2)}`}</div>
        </div>
      </CardFooter>
    </Card>
  );
}