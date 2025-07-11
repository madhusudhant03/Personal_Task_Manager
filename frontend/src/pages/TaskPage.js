import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: token }
    });
    setTasks(res.data);
  };

  const createTask = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/tasks', { title }, {
      headers: { Authorization: token }
    });
    setTitle('');
    fetchTasks();
  };

  const saveUpdatedTask = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/tasks/${editId}`, { title }, {
      headers: { Authorization: token }
    });
    setTitle('');
    setEditMode(false);
    setEditId(null);
    fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed }, {
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setEditId(task._id);
    setEditMode(true);
  };

  useEffect(() => { fetchTasks(); }, []);



return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
    <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Your Tasks</h1>

      <div className="flex mb-6">
        <input
          className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder={editMode ? "Edit task" : "New task"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {editMode ? (
          <button
            onClick={saveUpdatedTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r"
          >
            Update
          </button>
        ) : (
          <button
            onClick={createTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r"
          >
            Add
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`flex justify-between items-center px-4 py-3 rounded-lg shadow-sm ${
              task.completed ? 'bg-gray-200' : 'bg-indigo-100'
            }`}
          >
            <span
              className={`flex-1 cursor-pointer ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}
              onClick={() => toggleComplete(task._id, task.completed)}
            >
              {task.title}
            </span>
            <div className="ml-2 flex gap-2">
              <button
                onClick={() => startEdit(task)}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)};


export default TaskPage;
