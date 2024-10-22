'use client';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatNumber } from '@/lib/utils';
import AvatarWithModal from '@/components/ui/avatar-with-modal';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'profilePicture',
    header: '',
    cell: ({ row }) => (
      <AvatarWithModal imageUrl={row.original.customerProfileImage} />
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
  {
    accessorKey: 'vendorName',
    header: 'ספק',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {row.original.vendorName}
      </div>
    ),
  },
  {
    accessorKey: 'products',
    header: 'פירוט',
    cell: ({ row }) => (
      <div className="text-customBlack relative"> {/* Set relative positioning for the parent */}
        <Accordion type="single" collapsible>
          <AccordionItem value={`item-${row.original.uid}`} className="border-none">
            <AccordionTrigger></AccordionTrigger>
            <AccordionContent className="absolute left-0 top-10 w-[80vw] max-w-none z-50 bg-white p-4 shadow-lg"> {/* Make it span the full screen width */}
              {row.original.products?.map((product: any, index: number) => (
                <div 
                  key={index} 
                  className="flex flex-row-reverse justify-between last:border-b-0"
                >
                  <span className="text-customBlack font-medium">{product.title}</span>
                  <span className="text-gray-500">{product.quantity}</span>
                  <span className="text-gray-500">₪{product.price}</span>
                </div>
              ))}
              <div className="flex flex-row-reverse justify-between last:border-b-0">
                <span className="text-customBlack font-medium">סכום</span>
                <span className="text-gray-500">₪{row.original.amount - row.original.tip}</span>
              </div>
              <div className="flex flex-row-reverse justify-between last:border-b-0">
                <span className="text-customBlack font-medium">טיפ</span>
                <span className="text-gray-500">₪{row.original.tip}</span>
              </div>
              <div className="flex flex-row-reverse justify-between last:border-b-0">
                <span className="text-customBlack font-medium">{`סה"כ`}</span>
                <span className="text-gray-500">₪{row.original.amount}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
  }
  
];
