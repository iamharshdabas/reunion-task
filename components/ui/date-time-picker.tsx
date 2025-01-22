"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  value?: Date;
  onChangeAction: (date: Date) => void;
  placeholder?: string;
  noPastDate?: boolean; // Added property
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChangeAction,
  placeholder = "DD/MM/YYYY HH:mm",
  noPastDate = false, // Default value
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value instanceof Date && !isNaN(value.getTime()) ? value : undefined,
  );

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const updatedDate = selectedDate || new Date();
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
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const updatedDate = new Date(selectedDate);
      if (type === "hour") {
        updatedDate.setHours(value);
      } else {
        updatedDate.setMinutes(value);
      }
      setSelectedDate(updatedDate);
      onChangeAction(updatedDate);
    }
  };

  const isDateDisabled = (date: Date) => {
    return noPastDate && date.getTime() < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full pl-3 text-left font-normal ${
            !selectedDate ? "text-muted-foreground" : ""
          }`}
        >
          {selectedDate ? (
            format(selectedDate, "dd/MM/yyyy HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            disabled={isDateDisabled}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:divide-x">
            <ScrollArea className="h-48 p-2">
              <div className="flex flex-col gap-1">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Button
                    key={hour}
                    variant={
                      selectedDate?.getHours() === hour ? "default" : "ghost"
                    }
                    onClick={() => handleTimeChange("hour", hour)}
                  >
                    {hour.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="h-48 p-2">
              <div className="flex flex-col gap-1">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    variant={
                      selectedDate?.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    onClick={() => handleTimeChange("minute", minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
