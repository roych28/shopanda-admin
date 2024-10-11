'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

interface TotalSalesGraphProps {
  data: {
    vendor_id: number;
    vendor_name: string;
    transaction_count: string;
    total_revenue: string;
    average_transaction: string;
  }[];
}

export function TotalSalesGraph({ data }: TotalSalesGraphProps) {
  // Calculate the total revenue and transaction count across all vendors
  const totalTransactions = data.reduce((acc, vendor) => acc + parseInt(vendor.transaction_count, 10), 0);
  const totalRevenue = data.reduce((acc, vendor) => acc + parseFloat(vendor.total_revenue), 0).toFixed(2);

  // Format the description with vendor details
  const description = (
    <ul className="list-none space-y-1 text-right rtl">
      {data.map((vendor) => {
        const averageTransaction = parseFloat(vendor.average_transaction).toFixed(2);
        const totalTip = parseFloat(vendor.total_tip).toFixed(2); // Format the total tip to 2 decimal places
        return (
          <li key={vendor.vendor_id} className="relative pr-1">
            <span className="absolute right-0 mr-2">•</span>
            <div className="mr-6">
              <strong>{vendor.vendor_name}</strong>: {vendor.transaction_count} עסקאות,
              הכנסה כוללת של ₪{vendor.total_revenue}, עסקה ממוצעת ₪{averageTransaction},
              טיפ כולל ₪{totalTip}
            </div>
          </li>
        );
      })}
    </ul>
  );


  // Prepare pie chart data for total revenue distribution
  const pieData = data.map((vendor) => ({
    name: vendor.vendor_name,
    value: parseFloat(vendor.total_revenue)
  }));

  // Colors for the pie chart segments
  const COLORS = ['#1f77b4', '#ff7f0e'];

  return (
    <Card className="rtl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-right">
          <CardTitle>
            <div>{`סה"כ מכירות: ₪${totalRevenue}`}</div>
            <div>{`סה"כ עסקאות: ${totalTransactions}`}</div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
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
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₪${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
