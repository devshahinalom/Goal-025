'use client';

import { Todo } from '../types';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Trash2, Bell, Star, CircleDot, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  title: string;
}

const priorityColors = {
  'very-important': 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200',
  'important': 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200',
  'normal': 'bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-200',
  'optional': 'bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200',
};

const priorityIcons = {
  'very-important': <Star className="h-4 w-4 text-purple-600 fill-purple-200" />,
  'important': <CircleDot className="h-4 w-4 text-blue-600" />,
  'normal': <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  'optional': null,
};

export function TodoList({ todos, onToggle, onDelete, title }: TodoListProps) {
  return (
    <div className="space-y-4 bg-white/30 backdrop-blur-sm p-6 rounded-xl">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        {title}
      </h2>
      {todos.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-sm",
                priorityColors[todo.priority]
              )}
            >
              <div className="flex items-start sm:items-center space-x-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                  className="mt-1 sm:mt-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {priorityIcons[todo.priority]}
                    <p className={cn(
                      "font-medium break-words",
                      todo.completed && "line-through text-muted-foreground"
                    )}>
                      {todo.title}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {todo.dueDate && (
                      <p>Due: {format(new Date(todo.dueDate), "PPP")}</p>
                    )}
                    {todo.reminder && (
                      <p>Reminder: {format(new Date(todo.reminder), "PPP 'at' p")}</p>
                    )}
                    {todo.repeatDays && todo.repeatDays.length > 0 && (
                      <p>Repeats on: {todo.repeatDays.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto mt-2 sm:mt-0">
                {todo.reminder && (
                  <Bell className="h-4 w-4 text-purple-500" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(todo.id)}
                  className="hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}