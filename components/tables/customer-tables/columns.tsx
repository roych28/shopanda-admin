'use client';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/constants/data';
import Image from 'next/image';
import AvatarWithModal from '@/components/ui/avatar-with-modal';
import { formatNumber } from '@/lib/utils';

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'profilePicture',
    header: '',
    cell: ({ row }) => (
      <>
        <AvatarWithModal imageUrl={row.original.customerProfileImage} />
      </>
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
          {formatNumber(row.original.totalAmountSpent)}
        </span>
      </div>
    ),
  },
];
