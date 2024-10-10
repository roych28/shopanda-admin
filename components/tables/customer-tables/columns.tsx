'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'customerName',
    header: 'שם לקוח',
    cell: ({ row }) => (
      <div className="truncate text-right" style={{ maxWidth: '100px' }}>
        {`${row.original.customerFirstName} ${row.original.customerLastName}`}
      </div>
    ),
    headerClassName: 'font-semibold text-gray-700',
    cellClassName: 'text-gray-800',
  },
  {
    accessorKey: 'customerEmail',
    header: 'אימייל',
    cell: ({ row }) => (
      <div className="truncate" style={{ maxWidth: '150px' }}>
        {row.original.customerEmail}
      </div>
    ),
    headerClassName: 'text-right font-semibold text-gray-700',
    cellClassName: 'text-right text-gray-800',
  },
  {
    accessorKey: 'totalAmountSpent',
    header: 'סה״כ הוצאות',
    cell: ({ row }) => (
      <div className="truncate text-right text-gray-800" style={{ maxWidth: '70px' }}>
        ₪{row.original.totalAmountSpent}
      </div>
    ),
    headerClassName: 'text-right font-semibold text-gray-700',
    cellClassName: '',
  },
];
