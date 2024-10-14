// @ts-nocheck
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

interface ChargesTableProps {
  data: any[]; // Define a type if you know the structure of your table rows
}

export const ChargesTable: React.FC<ChargesTableProps> = ({ data }) => {
  return (
    <DataTable columns={columns} data={data} />
  );
};
