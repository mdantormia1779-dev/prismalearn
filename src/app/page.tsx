"use client";

import { useEffect, useState, useCallback } from "react";
import TodoItem from "./Components/TodoItem/TodoItem";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  // GET Todos API
  const getTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  }, []);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  // POST Todo API
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (res.ok) {
      setTitle("");
      getTodos(); // নতুন টোডো যোগ করার পর লিস্ট আপডেট হবে
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Prisma Todo App (CRUD)
      </h1>

      {/* Create Todo Form */}
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          required
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {/* Read Todo List */}
      <ul className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={getTodos} // এখানে onUpdate পাস করে দেওয়া হলো
            />
          ))
        )}
      </ul>
    </main>
  );
}