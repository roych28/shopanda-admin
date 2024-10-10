'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer } from '@/constants/data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<Customer>[] = [
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
    // headerClassName: 'text-center',
  },
  {
    accessorKey: 'customerName',
    header: 'שם לקוח',
    cell: ({ row }) => (
      <div className="truncate text-right text-gray-700" >
        {`${row.original.customerFirstName} ${row.original.customerLastName}`}
      </div>
    ),
    //headerClassName: 'font-semibold text-gray-700',
    //cellClassName: 'text-gray-800',
  },
  /*{
    accessorKey: 'customerEmail',
    header: 'אימייל',
    cell: ({ row }) => (
      <div className="truncate text-left text-gray-700" style={{ maxWidth: '170px' }}>
        {row.original.customerEmail}
      </div>
    ),
    //headerClassName: 'text-right font-semibold text-gray-700',
    //cellClassName: 'text-right text-gray-800',
  },*/
  {
    accessorKey: 'totalAmountSpent',
    header: 'סה״כ הוצאות',
    cell: ({ row }) => (
      <div className="truncate text-right font-semibold text-gray-800" >
        ₪{row.original.totalAmountSpent}
      </div>
    ),
    //headerClassName: 'text-right font-semibold text-gray-700',
    //cellClassName: '',
  },
];
