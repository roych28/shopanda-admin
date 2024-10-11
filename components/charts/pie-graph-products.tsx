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

export function ProductPieCharts({ data }: ProductPieChartProps) {
  // Separate data by vendor
  const vendors = Array.from(new Set(data.map((item) => item.vendor_name)));

  const pieCharts = vendors.map((vendorName, index) => {
    const vendorData = data.filter((item) => item.vendor_name === vendorName);

    // Prepare pie chart data for each vendor
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => (value >= 130 ? `${name}: ${value}` : '')}
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
