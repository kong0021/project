"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Slider } from "@radix-ui/react-slider";

type TodoItem = {
  id: string;
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
};

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [counter, setCounter] = useState(1); // Sequential ID counter
  const [accessibility, setAccessibility] = useState(0);
  const [form, setForm] = useState<Omit<TodoItem, "id">>({
    activity: "",
    price: 0,
    type: "education",
    bookingRequired: false,
    accessibility: 0.5,
  });


  // Handle form input changes
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
      { ...form, id: String(counter), price: Number(form.price) }, // Sequential ID
    ]);
    setCounter((prev) => prev + 1); // Increment counter
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

  // Memoized count
  const totalItems = useMemo(() => todos.length, [todos]);

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
            name="accessibility"
            value={form.accessibility}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                accessibility: Number(e.target.value),
              }))
            }
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
          <li key={todo.id} className="flex justify-between p-2 border rounded">
            <span>
              {todo.activity} (${todo.price})
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-red-500"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
