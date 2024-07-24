import React, { useEffect, useState } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    const getTodos = async () => {
      const todosFromServer = await fetchTodos();
      setTodos(todosFromServer.slice(0, 10)); // Fetch only first 10 for demo
    };
    getTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const newTodoItem = { title: newTodo, completed: false };
      const addedTodo = await addTodo(newTodoItem);
      setTodos([addedTodo, ...todos]);
      setNewTodo("");
    }
  };

  const handleUpdateTodo = async () => {
    if (currentTodo) {
      const updatedTodo = await updateTodo(currentTodo.id, {
        ...currentTodo,
        title: newTodo,
      });
      setTodos(
        todos.map((todo) => (todo.id === currentTodo.id ? updatedTodo : todo))
      );
      setNewTodo("");
      setIsEditing(false);
      setCurrentTodo(null);
    }
  };

  const handleCompleteTodo = async (id) => {
    const updatedTodo = await updateTodo(id, { completed: true });
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
  };

  const handleEditTodo = (todo) => {
    setNewTodo(todo.title);
    setIsEditing(true);
    setCurrentTodo(todo);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={isEditing ? handleUpdateTodo : handleAddTodo}>
          {isEditing ? "Update Todo" : "Add Todo"}
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span>{todo.title}</span>
            <div className="button-group">
              <button
                className="complete-btn"
                onClick={() => handleCompleteTodo(todo.id)}
              >
                Complete
              </button>
              <button className="edit-btn" onClick={() => handleEditTodo(todo)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
