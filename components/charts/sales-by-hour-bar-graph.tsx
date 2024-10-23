'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductSalesData {
  hour: string;
  product_id: string;
  product_name: string;
  total_revenue: number;
}

interface ProductSalesByHourProps {
  data: ProductSalesData[];
}

export function ProductSalesByHour({ data }: ProductSalesByHourProps) {
  // State to keep track of selected products for filtering
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  // Get unique product names for filtering options
  const uniqueProducts = Array.from(new Set(data.map((item) => item.product_name)));

  // Function to handle product selection changes
  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  // Filter the data based on selected products
  const filteredData = selectedProducts.length
    ? data.filter((item) => selectedProducts.includes(item.product_name))
    : data;

  // Prepare the chart data grouped by hour
  const chartData = Array.from(new Set(data.map((item) => item.hour))).map((hour) => {
    const hourData = filteredData.filter((item) => item.hour === hour);
    const chartEntry: { [key: string]: number | string } = { hour };

    hourData.forEach((item) => {
      chartEntry[item.product_name] = item.total_revenue;
    });

    return chartEntry;
  });

  // Get a consistent color for each product based on its position in the original uniqueProducts array
  const getProductColor = (product: string) => {
    const index = uniqueProducts.indexOf(product);
    return `hsl(${(index * 360) / uniqueProducts.length}, 70%, 50%)`;
  };

  return (
    <Card className="rtl mb-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-right">
          <CardTitle>הכנסות ממוצרים לפי שעה</CardTitle>
          <CardDescription>
            בחר את המוצרים להציג בגרף או להציג את כל המוצרים
          </CardDescription>
          {/* Product selection with color */}
          <div className="flex flex-wrap gap-4 mt-4">
            {uniqueProducts.map((product, index) => (
              <div key={product} className="flex items-center space-x-2">
                {/* Color box */}
                <div
                  style={{
                    backgroundColor: getProductColor(product),
                  }}
                  className="w-4 h-4 rounded"
                />
                {/* Label with checkbox */}
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedProducts.includes(product)}
                    onCheckedChange={() => handleProductToggle(product)}
                  />
                  <span>{product}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3' }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                left: 10,
                right: 10,
                top: 20,
                bottom: 20,
              }}
              barSize={30} // Increase the bar size to take up more width
              barCategoryGap="5%" // Reduce the gap between bar categories
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
                    hour12: false,
                    timeZone: 'Asia/Jerusalem',
                  });
                }}
              />
              <YAxis />
              <Tooltip />
              {/* Render only selected product bars, and ensure the color is mapped consistently */}
              {(selectedProducts.length ? selectedProducts : uniqueProducts).map((product) => (
                <Bar
                  key={product}
                  dataKey={product}
                  fill={getProductColor(product)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
