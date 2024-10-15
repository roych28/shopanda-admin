'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber } from '@/lib/utils';

const chartConfig = {
  vendorA: {
    label: 'המזנון',
    color: '#1f77b4',
  },
  vendorB: {
    label: "צ'אי שופ / הבר",
    color: '#ff7f0e',
  },
};

interface TotalSalesGraphProps {
  data: {
    vendor_id: number;
    vendor_name: string;
    transaction_count: string;
    total_revenue: string;
    average_transaction: string;
    total_tip: string;
  }[];
}

export function SalesByVendorGraph({ data }: TotalSalesGraphProps) {
  const router = useRouter();

  // Calculate the total revenue across all vendors
  const totalRevenue = data
    .reduce((acc, vendor) => acc + parseFloat(vendor.total_revenue), 0)
    .toFixed(2);

  // Format the description with vendor details as buttons that route with vendor_id
  const description = (
    <div className="list-none space-y-1 text-right rtl">
      {data.map((vendor) => {
        const averageTransaction = parseFloat(vendor.average_transaction).toFixed(2);
        const totalTip = parseFloat(vendor.total_tip).toFixed(2);
        return (
          <div key={vendor.vendor_id} className="relative pr-1">
            <button
              onClick={() => router.push(`/dashboard?vendorId=${vendor.vendor_id}`)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              <div className="mr-6 text-right">
                <div>
                  <strong>{vendor.vendor_name}</strong>: {vendor.transaction_count} עסקאות, הכנסה כוללת של {vendor.total_revenue}
                </div>
                <div>
                  עסקה ממוצעת {averageTransaction}, טיפ כולל {totalTip}
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );

  // Prepare bar chart data for total revenue
  const barData = data.map((vendor) => ({
    name: vendor.vendor_name,
    revenue: parseFloat(vendor.total_revenue),
  }));

  // Colors for the bar chart
  const COLORS = ['#1f77b4', '#ff7f0e'];

  return (
    <Card className="rtl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            <div className="text-center">{`סה"כ מכירות: ${totalRevenue}`}</div>
          </CardTitle>
          <CardDescription></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2">
      {description}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}`} />
            <Bar dataKey="revenue">
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
