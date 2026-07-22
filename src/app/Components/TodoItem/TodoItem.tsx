"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TodoItem({ 
  todo, 
  onUpdate 
}: { 
  todo: Todo; 
  onUpdate?: () => void 
}) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  // Helper function to trigger refresh
  const triggerRefresh = () => {
    if (onUpdate) {
      onUpdate();
    }
    router.refresh();
  };

  // Update Title
  async function updateTitle() {
    if (!newTitle.trim()) return;

    setLoading(true);

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setIsEditing(false);
      triggerRefresh();
    }
  }

  // Toggle Completed
  async function toggleCompleted() {
    setLoading(true);

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    setLoading(false);

    if (res.ok) {
      triggerRefresh();
    }
  }

  // Delete Todo
  async function deleteTodo() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (res.ok) {
      triggerRefresh();
    }
  }

  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg shadow-sm">
      <div className="flex items-center gap-3 flex-1">
        {/* Toggle */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleCompleted}
          disabled={loading}
          className="w-5 h-5 accent-blue-600 cursor-pointer"
        />

        {/* Edit / Show */}
        {isEditing ? (
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-black"
            />

            <button
              onClick={updateTitle}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setNewTitle(todo.title);
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span
            className={`flex-1 text-gray-800 ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex gap-3 ml-3">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>

          <button
            onClick={deleteTodo}
            disabled={loading}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}