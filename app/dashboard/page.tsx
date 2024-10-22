// @ts-nocheck
'use client'

import { useEffect, useState } from 'react';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useDataContext } from '@/lib/DataProvider';
import { useTranslations } from 'next-intl';

import { SalesBarGraph } from '@/components/charts/sales-bar-graph';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

import { ChargesTable } from '@/components/tables/charges-table/client';
import { CustomersClient } from '@/components/tables/customer-tables/client';
import { PurchaseHistory } from '@/components/tables/purchases-history/client';

import { RevenueLineGraph } from '@/components/charts/total-revenue-sales-graph';
import { PairingPerHourBarGraph } from '@/components/charts/pairing-per-hour-bar-graph';
import { PieGraphTotal } from '@/components/charts/pie-graph-total';
import { ProductPieCharts } from '@/components/charts/pie-graph-products';
import { PieGraphCmp } from '@/components/charts/pie-graph-cmp';
import { SalesByVendorGraph } from '@/components/charts/sales-by-vendor-column-graph';
import { VendorDropdown } from '@/components/ui/toggle-routing';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;
const isRTL = () => typeof document !== 'undefined' && document.dir === 'rtl';

const fetchReports = async (endpoint, vendorId = undefined, startDate = '2024-09-26', endDate = '2024-09-28') => {
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
  const searchParams = useSearchParams();
  
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    from: new Date(2024, 8, 26),  // Default to 2024-09-26 00:00:00
    to: new Date(2024, 8, 28), // Default to 2024-09-28 23:59:59
  });
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [realMoneyReport, setRealMoneyReport] = useState<any>(null);
  const [depositReportForPie, setDepositReportForPie] = useState<any>(null);
  const [creditsToRealMoney, setCreditsToRealMoney] = useState(0);
  const [fetchingData, setFetchingData] = useState(true);
  const [customersData, setCustomersData] = useState<any>(null);
  const [customersDataForPie, setCustomersDataForPie] = useState<any>(null);
  const [topCustomers, setTopCustomers] = useState<any>(null);
  const [salesDataPerHour, setSalesDataPerHour] = useState<any>(null);
  const [chargesData, setChargesData] = useState<any>([
    {
      details: "עמלת סליקה",
      agreement: "0.89", 
      total: "₪1,105.24", // (83000 + 23141) * 0.0089 = 944.65 * 1.17
    },
    {
      details: "עמלת מסוף",
      agreement: "טרנזקציה 10 אג + ₪150 לחודש",
      total: "₪397.21", // 150 + (0.1 * (546+261+1254+876+71+16)) = 189.5 + 150 = 339.5 * 1.17
    },
    {
      details: "התקנה",
      agreement: "₪350",
      total: "₪0",
    },
    {
      details: "עמלת שרות וטכנולוגיה",
      agreement: "5%",
      total: "₪8521.75", // 0.05 * 145671 = 7283.55 * 1.17
    },
    {
      details: "עלויות צמידים",
      agreement: "כמות צמידים * ₪5",
      total: "₪0",
    },
    {
      details: "נציגי שטח",
      agreement: "כמות נציגים * ₪80 לשעה",
      total: "₪0",
    },
    {
      details: "השכרת חומרה",
      agreement: "",
      total: "₪0",
    },
    {
      details: "עמלות נוספות",
      agreement: "הכחשות עסקה, זיכויים, תעריפון חברת האשראי",
      total: "₪252.65", 
    },
    {
      details: "סיכום עמלות והחזרים",
      agreement: "צפי הפקדה נטו",
      total: "₪95,866.79", // 145671 - 39530 - 250 - ((944.65 + 339.5 + 7283.55) * 1.17) = 137103.3
    },
  ]);
  
  useEffect(() => {
    const fetchAllReports = async () => {
      let totalDepositAmount =0;
      let totalWithoutPaymentAmount = 0;
      let totalPosDepositAmount = 0;
      let totalAmount = 0;
      let totalCredits = 1;
      let totalBonus = 0;

      const fromDate = selectedDateRange.from?.toLocaleDateString('en-CA');
      const toDate = selectedDateRange.to?.toLocaleDateString('en-CA');
      console.log(`Fetching reports at Dates ${selectedDateRange?.from} - ${selectedDateRange?.to}`);

      let vendorIdFinal = posUser?.vendorId;
      const queryVendorId = searchParams.get('vendorId');

      if (isSuperAdmin(posUser) && queryVendorId) {
        vendorIdFinal = queryVendorId;
      }
      console.log('Vendor ID:', vendorIdFinal);
      if(!vendorIdFinal) {
        const deposits = await fetchReports('deposits', undefined, fromDate, toDate);
        // real money 
        totalDepositAmount = parseFloat(deposits[0].total_amount);
        totalWithoutPaymentAmount = parseFloat(deposits[1].total_amount);
        totalPosDepositAmount = parseFloat(deposits[3].total_amount);
        totalAmount = totalDepositAmount + totalWithoutPaymentAmount + totalPosDepositAmount;

        // bonus
        const totalDepositBonus = parseFloat(deposits[0].total_bonus);
        const totalWithoutPaymentBonus = parseFloat(deposits[1].total_bonus);
        const totalPosDepositBonus = parseFloat(deposits[3].total_bonus);
        totalBonus = totalDepositBonus + totalWithoutPaymentBonus + totalPosDepositBonus;


        const chartData = [
          { type: 'Deposit', displayName: t('siteIncome'), total_amount: totalDepositAmount, fill: '#49E6A1' },
          { type: 'Without Payment', displayName: t('cacheIncome'), total_amount: totalWithoutPaymentAmount, fill: '#FDF956' },
          { type: 'POS Deposit', displayName: t('directIncome'), total_amount: totalPosDepositAmount, fill: '#F64894' }
        ];

        setDepositReportForPie(chartData);
      }

      const customersRes = await fetchReports('get-customer-data', vendorIdFinal, fromDate, toDate);
      setCustomersData(customersRes);

      const totalPurchase = customersRes.totalSalesSummery.reduce((acc, curr) => acc + parseFloat(curr.total_revenue), 0);
      totalCredits = totalPurchase + totalBonus;
      console.log(totalPurchase, totalCredits);

      setCreditsToRealMoney(parseFloat(totalPurchase / totalCredits).toFixed(3));
      if(!vendorIdFinal) {
        setRealMoneyReport({
          totalDepositAmount,
          totalWithoutPaymentAmount,
          totalPosDepositAmount,
          totalAmount,
          creditsNotSpent: totalCredits - totalPurchase
        });
      }

      const genderChartData = [
        { type: 'Male', displayName: t('males'), total_amount: customersRes?.customersData?.maleCount, fill: '#666666' },
        { type: 'Female', displayName: t('females'), total_amount: customersRes?.customersData?.femaleCount, fill: '#FDF956' },
        { type: 'Other', displayName: t('other'), total_amount: customersRes?.customersData?.otherCount + (customersRes?.customersData?.unknownGenderCount), fill: '#0A0A0A' }
      ];
      setCustomersDataForPie(genderChartData);
      setTopCustomers(customersRes?.topCustomers);

      
      const formattedData = customersRes.totalSalesPerHour.reduce((acc, item) => {
        const hour = item.hour;
        const vendorId = item.vendor_id;
        const existingEntry = acc.find((entry) => entry.hour === hour);
      
        if (existingEntry) {
          existingEntry[`vendor_${vendorId}_count`] = parseInt(item.transaction_count, 10);
          existingEntry[`vendor_${vendorId}_revenue`] = parseFloat(item.total_revenue);
        } else {
          const newEntry = {
            hour,
          };
          newEntry[`vendor_${vendorId}_count`] = parseInt(item.transaction_count, 10);
          newEntry[`vendor_${vendorId}_revenue`] = parseFloat(item.total_revenue);
          acc.push(newEntry);
        }
      
        return acc;
      }, []).sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime());
      
      setSalesDataPerHour(formattedData);
      setVendorId(vendorIdFinal);
      setFetchingData(false);
    };

    if(!loading && posUser) {
      fetchAllReports();
    }else if(!loading && !posUser) {
      router.push('/');
    }
    
  }, [loading, posUser, selectedDateRange, searchParams, router, t]);

  const isSuperAdmin = (user) => {
    return user?.role === 'owner' || user?.role === 'super_admin';
  }

  if(fetchingData) {
    return <div>{t('loading')}</div>
  }

  return (
    <PageContainer scrollable={true}>
        <div className="sticky top-0 z-10 bg-white shadow-md px-2 py-2">
          <div className="flex-1 text-right text-lg font-bold">
            היי {posUser?.firstName}
          </div>
          <div className="flex">
            <div className="flex-1">
              {customersData?.totalSalesSummery && <VendorDropdown vendors={customersData.totalSalesSummery} initialVendorId={vendorId} /> }
            </div>
            <CalendarDateRangePicker className="flex-1" onDateChange={(range: DateRange | undefined) => {
              if(range && range.from && range.to) {
                console.log('Date Range Selected:', range);
                range.from.setHours(0, 0, 0, 0);
                range.to.setHours(23, 59, 59, 999);
                setSelectedDateRange(range);
              }
            }}/> 
          </div>
        </div>
        <div className="space-y-4">
          {/*<TabsList>
            <TabsTrigger value="overview"></TabsTrigger>
          </TabsList>*/}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {/* Total Deposits */}
              {isSuperAdmin(posUser) && realMoneyReport && !vendorId && 
                <div className="col-span-1 sm:order-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>
                        <div className="text-xl text-center">{`${t('totalIncome')} - ₪${formatNumber(realMoneyReport?.totalAmount)}`}</div>
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
                      {depositReportForPie && <PieGraphTotal chartData={depositReportForPie} title={t('totalIncome')} />}
                      <div className="text-center text-md font-medium">{`${t('creditToRealMoneyRatio')} ${creditsToRealMoney}`}</div>
                      <div className="text-center text-md font-medium">{`${t('creditsNotSpent')} ₪${formatNumber(realMoneyReport.creditsNotSpent)}`}</div>
                    </CardContent>
                    <CardFooter>
                      <Accordion
                        type="single"
                        collapsible
                      >
                        <AccordionItem value="item-1" className="!border-none">
                          <AccordionTrigger className="flex flex-row justify-between !no-underline">
                            <div className="flex-1 text-right text-lg font-bold">
                              {`טבלת רווח ומעקב הפקדות`}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ChargesTable data={chargesData} />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardFooter>
                  </Card>
                </div>
              }              

              {/* Customers Data */}
              {isSuperAdmin(posUser) && customersData?.customersData && 
                <div className="col-span-1 sm:order-1">
                  <Card className="h-full">
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
                </div>
              }

              {/* Pairing Data */}
              {isSuperAdmin(posUser) && customersData?.pairingByHour && 
                <div className="col-span-1 sm:order-3">
                  <PairingPerHourBarGraph data={customersData?.pairingByHour} title={t('pairingChartTitle')} />
                </div>
              }

              {/* 20 Top Customers */}
              {isSuperAdmin(posUser) && topCustomers && 
                <div className="col-span-1 sm:order-4">
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
                </div>
              }
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {/* Total Revenue Line Graph */}
              <div className="col-span-1">
                {customersData?.totalSalesPerHour && <RevenueLineGraph data={customersData.totalSalesPerHour} />}
                {/* customersData?.totalSalesSummery && <TotalSalesGraph data={customersData.totalSalesSummery} />*/}
              </div>
              {/* Sales Per Hour Bar Graph */}
              <div className="col-span-1">
                {salesDataPerHour && <SalesBarGraph
                              data={salesDataPerHour}
                              title="גרף מכירות לפי שעה"
                              // description="השוואת מספר העסקאות לפי שעה בין הספקים שונים"
                            />}
              </div>
              {/* Sales By Vendor Graph */}
              <div className="col-span-1">
                {customersData?.totalSalesSummery && customersData?.totalSalesSummery?.length > 1 && <SalesByVendorGraph data={customersData?.totalSalesSummery} />}
              </div>         
              {/* Products Sold Pie Charts */}
              <div className="col-span-1">
                {customersData?.totalSalesSummery?.length === 1 && customersData?.productsSold && <ProductPieCharts data={customersData.productsSold} />}
              </div>
              {/* Last Purchases Table */}
              <div className="col-span-1">
                {customersData?.lastPurchases && <PurchaseHistory data={customersData.lastPurchases} />}
              </div>
            </div>
          </div>
        </div>
    </PageContainer>
  );
}