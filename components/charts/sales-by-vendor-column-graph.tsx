'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
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
    <div className="list-none space-y-1 text-right text-sm rtl">
      {data.map((vendor, index) => {
        const averageTransaction = parseFloat(vendor.average_transaction).toFixed(2);
        const totalTip = parseFloat(vendor.total_tip).toFixed(2);
        const vendorColor = chartConfig[`vendor${String.fromCharCode(65 + index)}`]?.color || '#000';

        return (
          <div key={vendor.vendor_id} className="relative pr-1">
            <button
              onClick={() => router.push(`/dashboard?vendorId=${vendor.vendor_id}`)}
              className={`text-white rounded p-2 w-full text-center`}
              style={{ backgroundColor: vendorColor }}
            >
              <div className="text-right">
                <div>
                  <strong>{vendor.vendor_name}</strong>: {vendor.transaction_count} עסקאות, הכנסה כוללת {vendor.total_revenue}
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

  // Prepare bar chart data for total revenue and tips stacked
  const barData = data.map((vendor) => ({
    name: vendor.vendor_name,
    revenue: parseFloat(vendor.total_revenue) - parseFloat(vendor.total_tip),
    tip: parseFloat(vendor.total_tip),
  }));

  // Colors for the bar chart
  const COLORS = ['#4A90E2', '#FFAA33'];

  return (
    <Card className="rtl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            <div className="text-center">{`סה"כ מכירות קרדיטים: ${totalRevenue}`}</div>
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
            <Legend formatter={(value) => value === 'מוצרים' ? '' : value} />
            <Bar dataKey="revenue" stackId="a" name="מוצרים" legendType="none">
              {barData.map((entry, index) => (
                <Cell key={`cell-revenue-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="tip" stackId="a" name="טיפים" fill="#FFD700" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
