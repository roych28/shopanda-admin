// @ts-nocheck
'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { Customer } from '@/constants/data';

interface CustomersClientProps {
  data: Customer[]; // Change 'User' to 'Customer' to match the new data structure.
}

export const CustomersClient: React.FC<CustomersClientProps> = ({ data }) => {
  return (
    <div dir="rtl" className="rtl">

      <div className="flex items-start justify-between">
        {/*<Heading
          title={`${data.length} הלקוחות המובילים`}
          description=""
        />*/}
      </div>
      <Separator />
      <DataTable searchKey="customerName" columns={columns} data={data} />
    </div>
  );
};
