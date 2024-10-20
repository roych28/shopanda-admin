'use client';

import React,{useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Vendor {
  vendor_id: number;
  vendor_name: string;
}

interface VendorDropdownProps {
  vendors: Vendor[];
  initialVendorId?: number | null; // Optional prop to pass an initial selected vendor ID
}

export function VendorDropdown({ vendors, initialVendorId = null }: VendorDropdownProps) {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);

  useEffect(() => {
    // Update the selected vendor based on the query param
    const vendorId = initialVendorId;
    if (vendorId) {
      const vendor = vendors.find(vendor => vendor.vendor_id === Number(vendorId));
      setSelectedVendor(vendor || null);
    }
  }, [initialVendorId, vendors]);

  const handleVendorSelection = (vendor: Vendor | null) => {
    setSelectedVendor(vendor);
    const route = vendor ? `/dashboard?vendorId=${vendor.vendor_id}` : '/dashboard';
    router.push(route);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <div className="text-[0.875rem]">{selectedVendor ? selectedVendor.vendor_name : 'כל הסניפים'}</div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {vendors
          .filter((vendor) => vendor.vendor_id !== selectedVendor?.vendor_id) // Filter out the selected vendor
          .map((vendor) => (
            <DropdownMenuItem
              key={vendor.vendor_id}
              onClick={() => handleVendorSelection(vendor)}
            >
              {vendor.vendor_name}
            </DropdownMenuItem>
          ))}
        <DropdownMenuItem onClick={() => handleVendorSelection(null)}>
          כל הסניפים
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
