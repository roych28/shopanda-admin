// @ts-nocheck
'use client'

import { useEffect, useState } from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph-total';
import { PieGraphBonus } from '@/components/charts/pie-graph-bonus';
import { PieGraphCmp } from '@/components/charts/pie-graph-cmp';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataContext } from '@/lib/DataProvider';
import { useTranslations } from 'next-intl';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;
const isRTL = () => typeof document !== 'undefined' && document.dir === 'rtl';

// Fetch all reports
const fetchReports = async (endpoint, startDate = '2024-09-26', endDate = '2024-09-28') => {
  try {
    const response = await fetch(
      `${SERVER_API_BASE_URL}/pos/reports/${endpoint}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
      {
        method: 'GET',
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


export default function DashboardPage() {
  const { posUser } = useDataContext();
  const t = useTranslations();

  const [realMoneyReport, setRealMoneyReport] = useState<any>(null);
  const [depositReportForPie, setDepositReportForPie] = useState<any>(null);
  const [creditsToRealMoney, setCreditsToRealMoney] = useState(0);
  const [fetchingData, setFetchingData] = useState(true);
  const [customersData, setCustomersData] = useState<any>(null);
  const [customersDataForPie, setCustomersDataForPie] = useState<any>(null);

  // Fetch all reports when the page loads
  useEffect(() => {
    const fetchAllReports = async () => {
      const deposits = await fetchReports('deposits');

      // real money 
      const totalDepositAmount = parseFloat(deposits[0].total_amount);
      const totalWithoutPaymentAmount = parseFloat(deposits[1].total_amount);
      const totalPosDepositAmount = parseFloat(deposits[3].total_amount);
      const totalAmount = totalDepositAmount + totalWithoutPaymentAmount + totalPosDepositAmount;

      setRealMoneyReport({
        totalDepositAmount,
        totalWithoutPaymentAmount,
        totalPosDepositAmount,
        totalAmount
      });

      // bonus
      const totalDepositBonus = parseFloat(deposits[0].total_bonus);
      const totalWithoutPaymentBonus = parseFloat(deposits[1].total_bonus);
      const totalPosDepositBonus = parseFloat(deposits[3].total_bonus);
      const totalBonus = totalDepositBonus + totalWithoutPaymentBonus + totalPosDepositBonus;
      
      const totalCredits = totalAmount + totalBonus;
      console.log(totalAmount, totalCredits);
      setCreditsToRealMoney(parseFloat(totalAmount / totalCredits).toFixed(2));

      const chartData = [
        { type: 'Deposit:  ', total_amount: totalDepositAmount, fill: '#49E6A1' },
        { type: 'Without Payment:  ', total_amount: totalWithoutPaymentAmount, fill: '#FDF956' },
        { type: 'POS Deposit:  ', total_amount: totalPosDepositAmount, fill: '#F64894' }
      ];

      setDepositReportForPie(chartData);

      const customersRes = await fetchReports('get-customer-data');
      console.log(customersRes);
      setCustomersData(customersRes);

      const genderChartData = [
        { type: 'Male', total_amount: customersRes.maleCount, fill: '#666666' },
        { type: 'Female', total_amount: customersRes.femaleCount, fill: '#FDF956' },
        { type: 'Other', total_amount: customersRes.otherCount + (customersRes.unknownGenderCount), fill: '#0A0A0A' }
      ];
      setCustomersDataForPie(genderChartData);
      /*const salesByHour = await fetchReports('sales-by-hour');
      setSalesByHourReport(salesByHour);

      const salesByVendor = await fetchReports('sales-by-vendor');
      setSalesByVendorReport(salesByVendor);

      const vendorRealMoney = await fetchReports('vendor-real-money');
      setVendorRealMoneyReport(vendorRealMoney);

      const inactiveCustomers = await fetchReports('inactive-customers');
      setInactiveCustomersReport(inactiveCustomers);*/

      setFetchingData(false);
    };
    fetchAllReports();
  }, []);

  if(fetchingData) {
    return <div>{t('loading')}</div>
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <div className="text-2xl font-bold tracking-tight">
            {posUser?.username}
          </div>
          {/*<div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>*/}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/*<TabsList>
            <TabsTrigger value="overview"></TabsTrigger>
          </TabsList>*/}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Deposits */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div>{`${t('totalIncome')} - ${realMoneyReport.totalAmount}`}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('siteIncome')} - ${realMoneyReport.totalDepositAmount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieOne"></div>
                      </div>
                    </pre>
                    <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('cacheIncome')} - ${realMoneyReport.totalWithoutPaymentAmount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieTwo"></div>
                      </div>
                    </pre>
                    <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('directIncome')} - ${realMoneyReport.totalPosDepositAmount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieThree"></div>
                      </div>
                    </pre>
                </CardContent>                
                {depositReportForPie && <PieGraph chartData={depositReportForPie} title={t('deposits')}/>}
                <div className="text-center text-xl font-medium mb-4">{`${t('creditToRealMoneyRatio')} ${creditsToRealMoney}`}</div>
              </Card>

              {/* Customers Data */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div>{`${t('customersData')}`}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('registeredCustomers')} - ${customersData?.customersRegistered}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieFour"></div>
                      </div>
                    </pre>
                    <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('males')} - ${customersData?.maleCount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieFive"></div>
                      </div>
                    </pre>
                    <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('females')} - ${customersData?.femaleCount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieSeven"></div>
                      </div>
                    </pre>
                    <pre>
                      <div className={`flex items-center ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="mr-2">{` ${t('other')} - ${customersData?.otherCount + customersData.unknownGenderCount}`}</div>
                        <div className="w-3 h-3 rounded-full bg-pieSix"></div>
                      </div>
                    </pre>
                </CardContent>    
                {customersData && <PieGraphCmp chartData={customersDataForPie} title={t('customers')}/>}
                <div className="text-center text-xl font-medium mb-4">{`${t('CustomersWithNfc')} ${customersData?.customersWithNfc}`}</div>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                  {`Total Bonus Deposits - ${1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <pre className="text-blue-500">{`App Bonus Deposits - ${1}`}</pre>
                <pre className="text-yellow-500">{`Info Bonus Deposits- ${2}`}</pre>
                <pre className="text-red-500">{`POS Bonus Deposits- ${3}`}</pre>
                </CardContent>
                <PieGraphBonus/>
              </Card>

              {/*<Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {`Total Real Money - ${(
                      parseFloat(depositReport?.[0]?.total_amount || 0) +
                      parseFloat(depositReport?.[1]?.total_amount || 0) +
                      parseFloat(depositReport?.[3]?.total_amount || 0) -
                      (parseFloat(depositReport?.[0]?.total_bonus || 0) +
                      parseFloat(depositReport?.[1]?.total_bonus || 0))
                    ).toFixed(0)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-blue-500">{`App Real Money - ${(parseFloat(depositReport?.[0].total_amount || 0) - parseFloat(depositReport?.[0].total_bonus || 0)).toFixed(0)}`}</pre>
                  <pre className="text-yellow-500">{`Info Real Money - ${(parseFloat(depositReport?.[1].total_amount || 0) - parseFloat(depositReport?.[1].total_bonus || 0)).toFixed(0)}`}</pre>
                  <pre className="text-red-500">{`POS Real Money - ${parseFloat(depositReport?.[3].total_amount || 0).toFixed(0)}`}</pre>
                </CardContent>
                <PieGraphRealMoney />
              </Card>*/}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
