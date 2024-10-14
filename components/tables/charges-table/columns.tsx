'use client';

import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'details',
    header: 'פירוט',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {row.original.details}
      </div>
    ),
  },
  {
    accessorKey: 'agreement',
    header: 'הסכם',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {row.original.agreement}
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: 'סה"כ',
    cell: ({ row }) => (
      <div className="text-right text-xs text-gray-400">
        {row.original.total}
      </div>
    ),
  },
  /*{
    accessorKey: 'notes',
    header: 'הערות',
    cell: ({ row }) => (
      <div className="text-right text-gray-700">
        {row.original.notes}
      </div>
    ),
  },*/
  
  
];
