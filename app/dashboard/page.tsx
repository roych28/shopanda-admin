'use client'
import { useEffect, useState } from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataContext } from '@/lib/DataProvider';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;

// Fetch all reports
const fetchReports = async (endpoint) => {
  try {
    const response = await fetch(
      `${SERVER_API_BASE_URL}/pos/reports/${endpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} report`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} report:`, error);
    return [];
  }
};

export default function Page() {
  const { posUser } = useDataContext();
  const [depositReport, setDepositReport] = useState([]);
  const [salesByHourReport, setSalesByHourReport] = useState([]);
  const [salesByVendorReport, setSalesByVendorReport] = useState([]);
  const [vendorRealMoneyReport, setVendorRealMoneyReport] = useState([]);
  const [inactiveCustomersReport, setInactiveCustomersReport] = useState([]);

  // Fetch all reports when the page loads
  useEffect(() => {
    const fetchAllReports = async () => {
      const deposits = await fetchReports('deposits');
      setDepositReport(deposits);

      const salesByHour = await fetchReports('sales-by-hour');
      setSalesByHourReport(salesByHour);

      const salesByVendor = await fetchReports('sales-by-vendor');
      setSalesByVendorReport(salesByVendor);

      const vendorRealMoney = await fetchReports('vendor-real-money');
      setVendorRealMoneyReport(vendorRealMoney);

      const inactiveCustomers = await fetchReports('inactive-customers');
      setInactiveCustomersReport(inactiveCustomers);
    };
    fetchAllReports();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <div className="text-2xl font-bold tracking-tight">
            {posUser?.username}
          </div>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Deposits */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{JSON.stringify(depositReport, null, 2)}</pre>
                </CardContent>
              </Card>

              {/* Sales by Vendor */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sales by Vendor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{JSON.stringify(salesByVendorReport, null, 2)}</pre>
                </CardContent>
              </Card>

              {/* Vendor Real Money after Bonuses */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vendor Real Money (after Bonus)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{JSON.stringify(vendorRealMoneyReport, null, 2)}</pre>
                </CardContent>
              </Card>

              {/* Sales by Hour in Pie Graph */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sales by Hour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PieGraph data={salesByHourReport} />
                </CardContent>
              </Card>

              {/* Inactive Customers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Inactive Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{JSON.stringify(inactiveCustomersReport, null, 2)}</pre>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
