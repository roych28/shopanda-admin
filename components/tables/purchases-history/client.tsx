'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

interface ChargesTableProps {
  data: any[]; 
}

export const PurchaseHistory: React.FC<ChargesTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">רשימת תשלומים</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
