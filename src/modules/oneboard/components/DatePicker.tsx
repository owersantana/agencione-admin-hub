
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date?: string;
  reminder?: string;
  onDateChange: (date: string | undefined) => void;
  onReminderChange?: (reminder: string | undefined) => void;
}

export function DatePicker({ date, reminder, onDateChange, onReminderChange }: DatePickerProps) {
  const [showReminder, setShowReminder] = useState(false);
  const selectedDate = date ? new Date(date) : undefined;

  const reminderOptions = [
    { value: '0', label: 'No momento' },
    { value: '15', label: '15 minutos antes' },
    { value: '30', label: '30 minutos antes' },
    { value: '60', label: '1 hora antes' },
    { value: '1440', label: '1 dia antes' },
    { value: '10080', label: '1 semana antes' },
  ];

  const handleDateSelect = (newDate: Date | undefined) => {
    onDateChange(newDate?.toISOString());
    if (newDate && onReminderChange) {
      setShowReminder(true);
    }
  };

  const handleReminderChange = (value: string) => {
    if (onReminderChange) {
      onReminderChange(value);
    }
  };

  const removeReminder = () => {
    if (onReminderChange) {
      onReminderChange(undefined);
    }
    setShowReminder(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {selectedDate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(undefined)}
            className="px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedDate && (showReminder || reminder) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Lembrete
          </Label>
          <div className="flex gap-2">
            <Select value={reminder || ''} onValueChange={handleReminderChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecionar lembrete" />
              </SelectTrigger>
              <SelectContent>
                {reminderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={removeReminder}
              className="px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedDate && !showReminder && !reminder && onReminderChange && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReminder(true)}
          className="w-full justify-start text-muted-foreground"
        >
          <Bell className="h-4 w-4 mr-2" />
          Adicionar lembrete
        </Button>
      )}
    </div>
  );
}
