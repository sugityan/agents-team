"use client";

import { useState, useEffect, useRef } from "react";

interface TODO {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

function getInitialTodos(): TODO[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("todos");
  return stored ? JSON.parse(stored) : [];
}

export default function TODOApp() {
  const [todos, setTodos] = useState<TODO[]>(getInitialTodos);
  const [filter, setFilter] = useState<FilterType>("all");
  const [inputText, setInputText] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputText.trim()) return;
    const newTodo: TODO = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
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

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tasks</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filteredTodos.length === 0 ? (
          <li className="text-center text-gray-500 py-4">No tasks found</li>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500 rounded cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 text-sm text-gray-500">
        {todos.filter((t) => !t.completed).length} remaining task(s)
      </div>
    </div>
  );
}