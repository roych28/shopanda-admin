'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { formatNumber } from '@/lib/utils';
import {
  ArrowLeftIcon
} from '@radix-ui/react-icons';

const isRTL = () => typeof document !== 'undefined' && document.dir === 'rtl';

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

  const description = (
    <div className="list-none space-y-1 text-right text-sm">
      {data.map((vendor, index) => {
        // Dynamically create the key based on the index
        const vendorKey = `vendor${String.fromCharCode(65 + index)}`;
        // @ts-ignore
        const vendorColor = chartConfig[vendorKey]?.color || '#000';

        return (
          <div key={vendor.vendor_id} className="relative pr-1">
            <button
              onClick={() => router.push(`/dashboard?vendorId=${vendor.vendor_id}`)}
              className="text-white rounded p-2 w-full text-center shadow-md hover:shadow-lg active:shadow-sm transition-shadow"
              style={{ backgroundColor: vendorColor || '#000' }}
            >
              <div className={`flex ${isRTL() ? 'flex-row-reverse' : 'flex-row'} items-center text-right`}>
                <div className="flex-1">
                  <div className="text-lg text-right">{vendor.vendor_name}</div>
                  <div className="">{`${vendor.transaction_count} הכנסה כוללת ${vendor.total_revenue} עסקאות`}</div>
                </div>
                <ArrowLeftIcon className="ml-2 h-4 w-4" aria-hidden="true" />
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
            <div className="text-center text-2xl">{`מכירות לפי סניף`}</div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="pb-6"> {description} </div>
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
