// @ts-nocheck
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
const fetchReports = async (endpoint: any) => {
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
    console.log(`Fetched ${endpoint} report:`, data.data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} report:`, error);
    return [];
  }
};

export default function Page() {
  const { posUser } = useDataContext();
  const [depositReport, setDepositReport] = useState<any>(null);
  const [salesByHourReport, setSalesByHourReport] = useState(null);
  const [salesByVendorReport, setSalesByVendorReport] = useState(null);
  const [vendorRealMoneyReport, setVendorRealMoneyReport] = useState(null);
  const [inactiveCustomersReport, setInactiveCustomersReport] = useState(null);

  // Fetch all reports when the page loads
  useEffect(() => {
    const fetchAllReports = async () => {
      const deposits = await fetchReports('deposits');
      console.log('deposits', deposits);
      setDepositReport(deposits);

      /*const salesByHour = await fetchReports('sales-by-hour');
      setSalesByHourReport(salesByHour);

      const salesByVendor = await fetchReports('sales-by-vendor');
      setSalesByVendorReport(salesByVendor);

      const vendorRealMoney = await fetchReports('vendor-real-money');
      setVendorRealMoneyReport(vendorRealMoney);

      const inactiveCustomers = await fetchReports('inactive-customers');
      setInactiveCustomersReport(inactiveCustomers);*/
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
                  <CardTitle className="text-xl font-medium">
                  {`Total Credit Deposits - ${(parseFloat(depositReport?.[0].total_amount || 0) + parseFloat(depositReport?.[1].total_amount || 0) + parseFloat(depositReport?.[3].total_amount || 0)).toFixed(0)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <pre>{`App Credit Deposits - ${parseFloat(depositReport?.[0].total_amount || 0).toFixed(0) }`}</pre>
                <pre>{`Info Credit Deposits- ${depositReport?.[1].total_amount}`}</pre>
                <pre>{`POS Credit Deposits- ${parseFloat(depositReport?.[3].total_amount).toFixed(0)}`}</pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                  {`Total Bonus Deposits - ${(parseFloat(depositReport?.[0].total_bonus || 0) + parseFloat(depositReport?.[1].total_bonus || 0)).toFixed(0)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <pre>{`App Bonus Deposits - ${depositReport?.[0].total_bonus}`}</pre>
                <pre>{`Info Bonus Deposits- ${depositReport?.[1].total_bonus}`}</pre>
                <pre>{`POS Bonus Deposits- ${depositReport?.[3].total_bonus}`}</pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {`Total Real Money - ${(
                      parseFloat(depositReport?.[0].total_amount || 0) +
                      parseFloat(depositReport?.[1].total_amount || 0) +
                      parseFloat(depositReport?.[3].total_amount || 0) -
                      (parseFloat(depositReport?.[0].total_bonus || 0) +
                      parseFloat(depositReport?.[1].total_bonus || 0))
                    ).toFixed(0)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{`App Real Money - ${(parseFloat(depositReport?.[0].total_amount || 0) - parseFloat(depositReport?.[0].total_bonus || 0)).toFixed(0)}`}</pre>
                  <pre>{`Info Real Money - ${(parseFloat(depositReport?.[1].total_amount || 0) - parseFloat(depositReport?.[1].total_bonus || 0)).toFixed(0)}`}</pre>
                  <pre>{`POS Real Money - ${parseFloat(depositReport?.[3].total_amount || 0).toFixed(0)}`}</pre>
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
              {/*<Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>*/}
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
