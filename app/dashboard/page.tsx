// @ts-nocheck
'use client'

import { useEffect, useState } from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraphTotal } from '@/components/charts/pie-graph-total';
import { ProductPieCharts } from '@/components/charts/pie-graph-products';
import { PieGraphCmp } from '@/components/charts/pie-graph-cmp';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataContext } from '@/lib/DataProvider';
import { useTranslations } from 'next-intl';
import { CustomersClient } from '@/components/tables/customer-tables/client';
import { SalesBarGraph } from '@/components/charts/sales-bar-graph';
import { TotalSalesGraph } from '@/components/charts/total-sales-bar-graph';
import { ProductSalesByHour } from '@/components/charts/sales-by-hour-bar-graph';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;
const isRTL = () => typeof document !== 'undefined' && document.dir === 'rtl';

const fetchReports = async (endpoint, startDate = '2024-09-26', endDate = '2024-09-28', vendorId = undefined) => {
  try {
    const reportUrl = vendorId ? `${SERVER_API_BASE_URL}/pos/reports/${endpoint}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&vendorId=${vendorId}` : 
    `${SERVER_API_BASE_URL}/pos/reports/${endpoint}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    
    const response = await fetch(reportUrl,
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
  const { posUser, loading } = useDataContext();
  const t = useTranslations();
  const router = useRouter();

  const [realMoneyReport, setRealMoneyReport] = useState<any>(null);
  const [depositReportForPie, setDepositReportForPie] = useState<any>(null);
  const [creditsToRealMoney, setCreditsToRealMoney] = useState(0);
  const [fetchingData, setFetchingData] = useState(true);
  const [customersData, setCustomersData] = useState<any>(null);
  const [customersDataForPie, setCustomersDataForPie] = useState<any>(null);
  const [topCustomers, setTopCustomers] = useState<any>(null);
  const [salesDataPerHour, setSalesDataPerHour] = useState<any>(null);
  // Fetch all reports when the page loads
  useEffect(() => {
    const fetchAllReports = async () => {
      const deposits = await fetchReports('deposits');

      // real money 
      const totalDepositAmount = parseFloat(deposits[0].total_amount);
      const totalWithoutPaymentAmount = parseFloat(deposits[1].total_amount);
      const totalPosDepositAmount = parseFloat(deposits[3].total_amount);
      const totalAmount = totalDepositAmount + totalWithoutPaymentAmount + totalPosDepositAmount;

      // bonus
      const totalDepositBonus = parseFloat(deposits[0].total_bonus);
      const totalWithoutPaymentBonus = parseFloat(deposits[1].total_bonus);
      const totalPosDepositBonus = parseFloat(deposits[3].total_bonus);
      const totalBonus = totalDepositBonus + totalWithoutPaymentBonus + totalPosDepositBonus;
      
      const totalCredits = totalAmount + totalBonus;
      console.log(totalAmount, totalCredits);

      
      setCreditsToRealMoney(parseFloat(totalAmount / totalCredits).toFixed(2));

      const chartData = [
        { type: 'Deposit', displayName: t('siteIncome'), total_amount: totalDepositAmount, fill: '#49E6A1' },
        { type: 'Without Payment', displayName: t('cacheIncome'), total_amount: totalWithoutPaymentAmount, fill: '#FDF956' },
        { type: 'POS Deposit', displayName: t('directIncome'), total_amount: totalPosDepositAmount, fill: '#F64894' }
      ];

      setDepositReportForPie(chartData);

      const customersRes = await fetchReports('get-customer-data');
      console.log(customersRes);
      setCustomersData(customersRes);

      const totalPurchase = customersRes.totalSalesSummery.reduce((acc, curr) => acc + parseFloat(curr.total_revenue), 0);
      setRealMoneyReport({
        totalDepositAmount,
        totalWithoutPaymentAmount,
        totalPosDepositAmount,
        totalAmount,
        creditsNotSpent: totalCredits - totalPurchase
      });

      const genderChartData = [
        { type: 'Male', displayName: t('males'), total_amount: customersRes?.customersData?.maleCount, fill: '#666666' },
        { type: 'Female', displayName: t('females'), total_amount: customersRes?.customersData?.femaleCount, fill: '#FDF956' },
        { type: 'Other', displayName: t('other'), total_amount: customersRes?.customersData?.otherCount + (customersRes?.customersData?.unknownGenderCount), fill: '#0A0A0A' }
      ];
      setCustomersDataForPie(genderChartData);
      setTopCustomers(customersRes?.topCustomers);

      const formattedData = customersRes.totalSalesPerHour
        .reduce((acc, item) => {
          const hour = item.hour;
          const existingEntry = acc.find((entry) => entry.hour === hour);
        
          if (existingEntry) {
            if (item.vendor_name.trim() === 'המזנון') {
              existingEntry.vendorA_count = parseInt(item.transaction_count, 10);
              existingEntry.vendorA_revenue = parseFloat(item.total_revenue);
            } else if (item.vendor_name.trim() === "צ'אי שופ / הבר") {
              existingEntry.vendorB_count = parseInt(item.transaction_count, 10);
              existingEntry.vendorB_revenue = parseFloat(item.total_revenue);
            }
          } else {
            acc.push({
              hour: item.hour,
              vendorA_count: item.vendor_name.trim() === 'המזנון' ? parseInt(item.transaction_count, 10) : 0,
              vendorB_count: item.vendor_name.trim() === "צ'אי שופ / הבר" ? parseInt(item.transaction_count, 10) : 0,
              vendorA_revenue: item.vendor_name.trim() === 'המזנון' ? parseFloat(item.total_revenue) : 0,
              vendorB_revenue: item.vendor_name.trim() === "צ'אי שופ / הבר" ? parseFloat(item.total_revenue) : 0,
            });
          }
        
          return acc;
        }, [])
        .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime());

      setSalesDataPerHour(formattedData);

      setFetchingData(false);

    };

    if(!loading && posUser) {
      fetchAllReports();
    }else if(!loading && !posUser) {
      router.push('/');
    }
    
  }, [loading, posUser]);

  if(fetchingData) {
    return <div>{t('loading')}</div>
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="text-right">
          <div className="text-2xl font-bold">
          היי {posUser?.firstName} 
          </div>
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
                    <div className="text-xl text-center">{`${t('totalIncome')} - ₪${formatNumber(realMoneyReport.totalAmount)}`}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-right text-lg mb-4">{`${t('perChannelIncome')}`}</div>
                  <table className="w-full text-right">
                    <tbody>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`₪${formatNumber(realMoneyReport.totalDepositAmount)}`}</td>
                        <td className="px-2">{`${t('siteIncome')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieOne"></div>
                        </td>
                      </tr>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`₪${formatNumber(realMoneyReport.totalWithoutPaymentAmount)}`}</td>
                        <td className="px-2">{`${t('cacheIncome')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieTwo"></div>
                        </td>        
                      </tr>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`₪${formatNumber(realMoneyReport.totalPosDepositAmount)}`}</td>
                        <td className="px-2">{`${t('directIncome')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieThree"></div>
                        </td>          
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
                {depositReportForPie && <PieGraphTotal chartData={depositReportForPie} title={t('totalIncome')} />}
                <div className="text-center text-xl font-medium mb-4">{`${t('creditToRealMoneyRatio')} ${creditsToRealMoney}`}</div>
                <div className="text-center text-xl font-medium mb-4">{`${t('creditsNotSpent')} ₪${formatNumber(realMoneyReport.creditsNotSpent)}`}</div>
              </Card>
              {/* Customers Data */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="text-xl text-center">{`${t('customersData')}`}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-right">
                    <tbody>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`${formatNumber(customersData?.customersData?.customersRegistered)}`}</td>
                        <td className="px-2">{`${t('registeredCustomers')}`}</td>
                        <td className="px-2 w-3" />
                      </tr>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`${formatNumber(customersData?.customersData?.maleCount)}`}</td>
                        <td className="px-2">{`${t('males')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieFive"></div>
                        </td>
                      </tr>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`${formatNumber(customersData?.customersData?.femaleCount)}`}</td>
                        <td className="px-2">{`${t('females')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieSeven"></div>
                        </td>
                      </tr>
                      <tr className={`${isRTL() ? 'flex-row-reverse' : ''}`}>
                        <td className="px-2">{`${formatNumber(customersData?.customersData?.otherCount + customersData?.customersData?.unknownGenderCount)}`}</td>
                        <td className="px-2">{`${t('other')}`}</td>
                        <td className="px-2 w-3">
                          <div className="w-3 h-3 rounded-full bg-pieSix"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
                {customersData && <PieGraphCmp chartData={customersDataForPie} title={t('customers')} />}
                <div className="text-center text-xl font-medium mb-4">{`${t('CustomersWithNfc')} ${formatNumber(customersData?.customersData?.customersWithNfc)}`}</div>
              </Card>


              {/* Pairing Data */}
              {customersData?.pairingByHour && <BarGraph data={customersData?.pairingByHour} title={t('pairingChartTitle')} />}

              {/* 20 Top Customers */}
              {topCustomers && 
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div>{`הלקוחות המובילים בקניות`}</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="m-0 p-0">
                    <CustomersClient data={topCustomers} />
                  </CardContent>    
                </Card>
              }
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                { customersData?.totalSalesSummery && <TotalSalesGraph data={customersData.totalSalesSummery} />}
              </div>
              <div className="col-span-4">
                {salesDataPerHour && <SalesBarGraph
                                        data={salesDataPerHour}
                                        title="גרף מכירות לפי שעה"
                                        description="השוואת מספר העסקאות לפי שעה בין הספקים שונים"
                                      />}
              </div>
              <div className="col-span-4">
                { customersData?.productsSold && <ProductPieCharts data={customersData.productsSold} />}
              </div>
              <div className="col-span-4">
                { customersData?.productsSalesByHour && <ProductSalesByHour data={customersData.productsSalesByHour} />}
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}