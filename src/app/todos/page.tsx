"use client";
import React, { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/todos";
console.log('API_URL - src/app/todos/page.tsx -=>', API_URL);

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const getTodos = async () => {
    setLoading(true);
    try {
      console.log('API_URL - src/app/todos/page.tsx - =>', API_URL);
      const res = await fetch(API_URL!);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : data.data || []);
    } catch {
      setError("Erro ao buscar todos");
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
      if (!res.ok) throw new Error("Erro ao adicionar todo");
      setTitle("");
      setDescription("");
      getTodos();
    } catch {
      setError("Erro ao adicionar todo");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow">Lista de Todos</h1>
        <form onSubmit={handleAddTodo} className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col gap-4 border border-blue-100">
          <input
            className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            placeholder="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={adding}
          />
          <textarea
            className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg min-h-[60px]"
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={adding}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={adding || !title.trim() || !description.trim()}
          >
            {adding ? "Adicionando..." : "Adicionar Todo"}
          </button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
        {loading ? (
          <div className="text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="grid gap-6">
            {todos.length === 0 && <div className="text-center text-gray-400">Nenhum todo cadastrado.</div>}
            {todos.map(todo => (
              <div key={todo.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between border-l-8 border-blue-400 hover:shadow-xl transition">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">{todo.title}</h2>
                  <p className="text-gray-600 mb-2">{todo.description}</p>
                </div>
                <span className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-bold ${todo.completed ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
                  {todo.completed ? "Concluído" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 