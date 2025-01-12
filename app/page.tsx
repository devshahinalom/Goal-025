'use client';

import { useState, useEffect } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { Todo, TodoList as TodoListType, Priority } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [todos, setTodos] = useState<TodoListType>({
    daily: [],
    weekly: [],
    yearly: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      Object.values(todos).flat().forEach((todo) => {
        if (todo.reminder && new Date(todo.reminder) <= now && !todo.completed) {
          toast({
            title: `${todo.priority === 'very-important' ? '🔥 Important Task!' : 'Reminder'}`,
            description: todo.title,
            className: cn(
              "border-2",
              todo.priority === 'very-important' ? 'border-purple-400 bg-purple-50' :
              todo.priority === 'important' ? 'border-blue-400 bg-blue-50' :
              'border-emerald-400 bg-emerald-50'
            )
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [todos, toast]);

  const addTodo = (
    title: string,
    dueDate: Date | undefined,
    reminder: Date | undefined,
    type: 'daily' | 'weekly' | 'yearly',
    priority: Priority,
    repeatDays?: string[]
  ) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      dueDate,
      reminder,
      type,
      priority,
      repeatDays,
    };

    setTodos((prev) => ({
      ...prev,
      [type]: [...prev[type], newTodo],
    }));

    toast({
      title: "Task Added",
      description: title,
      className: "border-2 border-green-400 bg-green-50"
    });
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      const newTodos = { ...prev };
      Object.keys(newTodos).forEach((key) => {
        newTodos[key as keyof TodoListType] = newTodos[key as keyof TodoListType].map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
      });
      return newTodos;
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => {
      const newTodos = { ...prev };
      Object.keys(newTodos).forEach((key) => {
        newTodos[key as keyof TodoListType] = newTodos[key as keyof TodoListType].filter(
          (todo) => todo.id !== id
        );
      });
      return newTodos;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-emerald-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Task Master
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <TodoInput onAdd={addTodo} />
          
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-white/50 backdrop-blur-sm rounded-xl">
              <TabsTrigger value="daily" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
                Daily Tasks
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
                Weekly Tasks
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
                Yearly Goals
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <TodoList
                todos={todos.daily}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                title="Daily Tasks"
              />
            </TabsContent>
            
            <TabsContent value="weekly">
              <TodoList
                todos={todos.weekly}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                title="Weekly Planner"
              />
            </TabsContent>
            
            <TabsContent value="yearly">
              <TodoList
                todos={todos.yearly}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                title="Yearly Goals"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}