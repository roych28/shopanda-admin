'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductSalesData {
  vendor_id: number;
  vendor_name: string;
  product_id: string;
  product_name: string;
  total_quantity_sold: string;
}

interface ProductPieChartProps {
  data: ProductSalesData[];
}

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

// Custom label component for rendering labels with Tailwind styles and anchor adjustment
const CustomLabel = ({ x, y, name, value, fill, midAngle }: any) => {
  // Calculate text anchor based on midAngle (left for 180-360 degrees, right for 0-180)
  const anchor = midAngle > 270 ? 'start' : 'end';

  if (value < 100) {
    return null; // Hide labels for values under 100
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      className="text-xs"
      fill={fill}
    >
      {`${name}`}
    </text>
  );
};

// Custom labelLine function for controlling the visibility and style of the label line
const CustomLabelLine = (props: any) => {
  const { cx, cy, midAngle, outerRadius, fill, stroke, index, value } = props;

  // Only show the label line if the value is greater than 100
  if (value < 100) {
    return <></>;
  }

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <line
      x1={cx}
      y1={cy}
      x2={x}
      y2={y}
      stroke={stroke || fill}
      strokeWidth={1}
      strokeDasharray="3 3" // Make it dashed for better visibility
    />
  );
};

export function ProductPieCharts({ data }: ProductPieChartProps) {
  // Separate data by vendor
  const vendors = Array.from(new Set(data.map((item) => item.vendor_name)));

  const pieCharts = vendors.map((vendorName, index) => {
    const vendorData = data.filter((item) => item.vendor_name === vendorName);

    const pieData = vendorData.map((item) => ({
      name: item.product_name,
      value: parseInt(item.total_quantity_sold, 10) // Ensure the value is a number
    }));

    return (
      <Card key={index} className="rtl mb-4">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-right">
            <CardTitle>{vendorName}</CardTitle>
            <CardDescription>מוצרים לפי כמויות שנמכרו</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="60%"
                cy="50%"
                outerRadius={120}
                label={({ cx, cy, midAngle, outerRadius, name, value, fill }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 40;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return <CustomLabel x={x} y={y} name={name} value={value} fill={fill} midAngle={midAngle} />;
                }}
                labelLine={CustomLabelLine}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `כמות: ${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  });

  return <>{pieCharts}</>;
}
