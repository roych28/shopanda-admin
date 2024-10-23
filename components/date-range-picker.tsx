import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (range: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  onDateChange
}: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 8, 26),
    to: addDays(new Date(2024, 8, 26), 2)
  });

  // Handle date change and trigger the callback
  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if (onDateChange) {
      onDateChange(range);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[210px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-1 h-3 w-3" />
            <div className="text-[0.7rem]">{date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange} // Use the new handler here
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
