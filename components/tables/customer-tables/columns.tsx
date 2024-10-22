'use client';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/constants/data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/utils';

export const columns: ColumnDef<Customer>[] = [
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
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-3000 ease-in-out"
              onClick={closeModal} // Close modal when clicking the background
            >
              <div 
                className="relative p-4 bg-white rounded-lg shadow-lg transform transition-transform duration-3000 ease-in-out scale-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <img
                  src={row.original.customerProfileImage}
                  alt=""
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
