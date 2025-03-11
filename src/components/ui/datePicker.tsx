import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { useState } from "react";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  /** Data mínima que pode ser selecionada */
  minDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  minDate,
}: Readonly<DatePickerProps>) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleOnSelect = (e: any) => {
    console.log(e);
  };

  console.log(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" onClick={(e) => e.stopPropagation()}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={minDate ? { before: minDate } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
