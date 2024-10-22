'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/utils';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'profilePicture',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Avatar className="h-8 w-8 flex-end">
          <AvatarImage
            src={row.original.customerProfileImage}
          />
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'שם הלקוח',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {`${row.original.customerFirstName} ${row.original.customerLastName}`}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'סכום',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        ₪{formatNumber(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'נוצר בתאריך',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {new Date(row.original.createdAt).toLocaleString('he-IL')}
      </div>
    ),
  },
  /*{
    accessorKey: 'vendorId',
    header: 'מזהה ספק',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {row.original.vendorId}
      </div>
    ),
  },*/
];
