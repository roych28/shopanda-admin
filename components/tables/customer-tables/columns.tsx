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
  },
  {
    accessorKey: 'customerName',
    header: 'שם לקוח',
    cell: ({ row }) => (
      <div className="truncate text-right text-gray-700" >
        {`${row.original.customerFirstName} ${row.original.customerLastName}`}
      </div>
    ),
  },
  {
    accessorKey: 'totalAmountSpent',
    header: 'סה״כ הוצאות בקרדיטים',
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <Image
          src="/panda_coin.png"
          alt="Panda Coin"
          width={16}
          height={16}
          className="rounded-full"
        />
        <span className="truncate font-semibold text-gray-800 ml-1">
          {row.original.totalAmountSpent}
        </span>
      </div>
    ),
  },
];
