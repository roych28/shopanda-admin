'use client';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'profilePicture',
    header: '',
    cell: ({ row }) => {
      // State for managing modal visibility
      const [isModalOpen, setIsModalOpen] = useState(false);
      
      // Function to open the modal
      const openModal = () => {
        setIsModalOpen(true);
      };

      // Function to close the modal
      const closeModal = () => {
        setIsModalOpen(false);
      };

      return (
        <>
          <div className="flex justify-center">
            <Avatar className="h-8 w-8 flex-end cursor-pointer" onClick={openModal}>
              <AvatarImage
                src={row.original.customerProfileImage}
              />
            </Avatar>
          </div>

          {/* Modal for displaying larger image */}
          {isModalOpen && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
              onClick={closeModal} // Close modal when clicking the background
            >
              <div 
                className="relative p-4 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <img
                  src={row.original.customerProfileImage}
                  alt="Customer Profile"
                  className="max-w-full h-auto"
                />
                {/* Close button */}
                <button 
                  className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </>
      );
    },
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
                <span className="text-customBlack font-medium">סה"כ</span>
                <span className="text-gray-500">₪{row.original.amount}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
  }
  
];
