"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput("");
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4 py-8">
      <main className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          TODO App
        </h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2 mb-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-2 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
          {filteredTodos.length === 0 && (
            <li className="text-center text-gray-500 py-4">
              {todos.length === 0
                ? "No todos yet. Add one above!"
                : "No todos match this filter."}
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {activeCount} item{activeCount !== 1 ? "s" : ""} left
          </span>
          <div className="flex gap-1">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}