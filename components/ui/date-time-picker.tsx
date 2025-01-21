"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  value?: Date;
  onChangeAction: (date: Date) => void;
  placeholder?: string;
  noPastDate?: boolean;
  noFutureDate?: boolean;
}

const getValidatedDate = (date?: Date): Date => {
  return date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChangeAction,
  placeholder = "DD/MM/YYYY HH:mm",
  noPastDate = false,
  noFutureDate = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const today = useMemo(() => new Date(), []);

  const isDisabledDate = (date: Date) => {
    if (noPastDate && date.getTime() < new Date(today).setHours(0, 0, 0, 0)) {
      return true;
    }
    if (
      noFutureDate &&
      date.getTime() > new Date(today).setHours(23, 59, 59, 999)
    ) {
      return true;
    }
    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDisabledDate(date)) {
      const updatedDate = getValidatedDate(selectedDate);
      updatedDate.setFullYear(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      setSelectedDate(updatedDate);
      onChangeAction(updatedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: number) => {
    if (selectedDate) {
      const updatedDate = getValidatedDate(selectedDate);
      if (type === "hour") {
        updatedDate.setHours(value);
      } else {
        updatedDate.setMinutes(value);
      }
      setSelectedDate(updatedDate);
      onChangeAction(updatedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal",
            !selectedDate && "text-muted-foreground",
          )}
        >
          {getValidatedDate(selectedDate) ? (
            format(getValidatedDate(selectedDate), "dd/MM/yyyy HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => isDisabledDate(date)}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      selectedDate instanceof Date &&
                      !isNaN(selectedDate.getTime()) &&
                      selectedDate.getHours() === hour
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour)}
                    disabled={
                      noPastDate &&
                      selectedDate &&
                      new Date(selectedDate).setHours(hour, 0, 0, 0) <
                        today.setHours(0, 0, 0, 0)
                    }
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      selectedDate instanceof Date &&
                      !isNaN(selectedDate.getTime()) &&
                      selectedDate.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
