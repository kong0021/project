"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { FormItem } from "./types/type";

const TodoApp = () => {
  const [todos, setTodos] = useState<FormItem[]>([]);
  const [counter, setCounter] = useState(1);
  const [isClient, setIsClient] = useState(false); // Fix Next.js hydration issues

  const [form, setForm] = useState<Omit<FormItem, "id">>({
    activity: "",
    price: 0,
    type: "education",
    bookingRequired: false,
    accessibility: 0.5,
  });

  // Ensure Next.js hydration works correctly
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos");
      const savedCounter = localStorage.getItem("counter");
      const savedForm = localStorage.getItem("form");

      if (savedTodos) setTodos(JSON.parse(savedTodos));
      if (savedCounter) setCounter(Number(savedCounter));
      if (savedForm) setForm(JSON.parse(savedForm));

      console.log("Loaded from localStorage:", {
        savedTodos,
        savedCounter,
        savedForm,
      });
    }
  }, []);

  // Save to localStorage onChange of todos, counter, or form
  useEffect(() => {
    if (isClient) {
      console.log("Saving to localStorage", { todos, counter, form });

      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("counter", counter.toString());
      localStorage.setItem("form", JSON.stringify(form));
    }
  }, [todos, counter, form, isClient]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSliderChange = useCallback((value: number) => {
    setForm((prev) => ({ ...prev, accessibility: value }));
  }, []);

  const addTodo = useCallback(() => {
    if (!form.activity.trim()) return;
    setTodos((prev) => [
      ...prev,
      { ...form, id: String(counter), price: Number(form.price) },
    ]);
    setCounter((prev) => prev + 1);
    setForm({
      activity: "",
      price: 0,
      type: "education",
      bookingRequired: false,
      accessibility: 0.5,
    });
  }, [form, counter]);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const totalItems = useMemo(() => todos.length, [todos]);

  if (!isClient) {
    return <div>Loading...</div>; // Fixes hydration issues in Next.js
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">To-Do List</h2>

      {/* Summary */}
      <p className="mb-2">Total Items: {totalItems}</p>

      {/* Form */}
      <div className="space-y-3">
        <input
          type="text"
          name="activity"
          value={form.activity}
          onChange={handleChange}
          placeholder="Activity"
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          {[
            "education",
            "recreational",
            "social",
            "diy",
            "charity",
            "cooking",
            "relaxation",
            "music",
            "busywork",
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="bookingRequired"
            checked={form.bookingRequired}
            onChange={handleChange}
          />
          <span>Booking Required</span>
        </label>
        <div>
          <label htmlFor="accessibility" className="block mb-1">
            Accessibility: {form.accessibility.toFixed(1)}
          </label>
          <input
            type="range"
            id="accessibility"
            value={form.accessibility}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            min="0"
            max="1"
            step="0.1"
            className="w-full"
          />
        </div>
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="mt-4 space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="p-3 border rounded bg-gray-100">
            <p>
              <strong>Id:</strong> {todo.id}
            </p>
            <p>
              <strong>Activity:</strong> {todo.activity}
            </p>
            <p>
              <strong>Price:</strong> ${todo.price.toFixed(2)}
            </p>
            <p>
              <strong>Type:</strong> {todo.type}
            </p>
            <p>
              <strong>Booking:</strong>{" "}
              {todo.bookingRequired ? "Required" : "Not Required"}
            </p>
            <p>
              <strong>Accessibility:</strong> {todo.accessibility.toFixed(1)}
            </p>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-red-500 mt-2"
            >
              ✖ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
