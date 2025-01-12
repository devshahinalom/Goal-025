'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Priority } from '../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoInputProps {
  onAdd: (title: string, dueDate: Date | undefined, reminder: Date | undefined, type: 'daily' | 'weekly' | 'yearly', priority: Priority, repeatDays?: string[]) => void;
}

const priorityColors = {
  'very-important': 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
  'important': 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
  'normal': 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200',
  'optional': 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
};

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [reminder, setReminder] = useState<Date>();
  const [reminderTime, setReminderTime] = useState('12:00');
  const [type, setType] = useState<'daily' | 'weekly' | 'yearly'>('daily');
  const [priority, setPriority] = useState<Priority>('normal');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [showRepeatDays, setShowRepeatDays] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (reminder) {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const reminderDateTime = new Date(reminder);
        reminderDateTime.setHours(hours, minutes);
        onAdd(title, dueDate, reminderDateTime, type, priority, repeatDays.length > 0 ? repeatDays : undefined);
      } else {
        onAdd(title, dueDate, reminder, type, priority, repeatDays.length > 0 ? repeatDays : undefined);
      }
      setTitle('');
      setDueDate(undefined);
      setReminder(undefined);
      setRepeatDays([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border-2 focus:border-purple-400"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as 'daily' | 'weekly' | 'yearly');
            setShowRepeatDays(e.target.value === 'daily');
          }}
          className="px-3 py-2 rounded-md border-2 border-purple-200 bg-white/75 w-full sm:w-auto focus:border-purple-400 outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={cn(
            "px-3 py-2 rounded-md border-2 w-full sm:w-auto transition-all duration-200",
            priorityColors[priority]
          )}
        >
          <option value="very-important">Very Important</option>
          <option value="important">Important</option>
          <option value="normal">Normal</option>
          <option value="optional">Optional</option>
        </select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto justify-start text-left font-normal border-2",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Set due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal border-2",
                  !reminder && "text-muted-foreground"
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                {reminder ? format(reminder, "PPP") : "Set reminder"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={reminder}
                onSelect={setReminder}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {reminder && (
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full sm:w-auto border-2"
            />
          )}
        </div>
      </div>

      {showRepeatDays && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Repeat on days:</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center space-x-2 bg-white/75 p-2 rounded-md border border-purple-100">
                <Checkbox
                  checked={repeatDays.includes(day)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRepeatDays([...repeatDays, day]);
                    } else {
                      setRepeatDays(repeatDays.filter(d => d !== day));
                    }
                  }}
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
      >
        Add Task
      </Button>
    </form>
  );
}