export type Priority = 'very-important' | 'important' | 'normal' | 'optional';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  type: 'daily' | 'weekly' | 'yearly';
  reminder?: Date;
  priority: Priority;
  repeatDays?: string[];
}