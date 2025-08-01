"use client";
import React, { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const getApiUrl = () => {
  if (typeof window !== "undefined" && (window as Window & { env?: { API_URL?: string } }).env?.API_URL) {
    return (window as Window & { env?: { API_URL?: string } }).env!.API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL;
};
const API_URL = getApiUrl() as string;
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const getTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : data.data || []);
    } catch {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setTitle("");
      setDescription("");
      getTodos();
    } catch {
      setError("Failed to add todo");
    } finally {
      setAdding(false);
    }
  };

  const statusColors = {
    Completed: "bg-green-100 text-green-700 border-green-300",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-2 animate-fade-in">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow animate-fade-in">Todo List</h1>
        <form onSubmit={handleAddTodo} className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col gap-4 border border-blue-100 animate-fade-in">
          <input
            className="border-2 border-blue-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg placeholder-gray-400 text-gray-900 transition-all duration-200 shadow-sm focus:scale-105"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={adding}
            autoComplete="off"
          />
          <textarea
            className="border-2 border-blue-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg min-h-[60px] placeholder-gray-400 text-gray-900 transition-all duration-200 shadow-sm focus:scale-105"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={adding}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
            disabled={adding || !title.trim() || !description.trim()}
          >
            {adding ? "Adding..." : "Add Todo"}
          </button>
          {error && <div className="text-red-500 text-sm text-center animate-pulse">{error}</div>}
        </form>
        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">Loading...</div>
        ) : (
          <div className="grid gap-6 animate-fade-in">
            {todos.length === 0 && <div className="text-center text-gray-400">No todos found.</div>}
            {todos.map(todo => {
              const status = todo.completed ? "Completed" : "Pending";
              return (
                <div key={todo.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between border-l-8 border-blue-400 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] animate-fade-in">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-900 mb-1">{todo.title}</h2>
                    <p className="text-gray-600 mb-2">{todo.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status]}`}>{status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
}
