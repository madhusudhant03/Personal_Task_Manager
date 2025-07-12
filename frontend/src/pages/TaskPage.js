import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'; // You need lucide-react (or use emojis/icons)

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: token },
    });
    setTasks(res.data);
  };

  const createTask = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/tasks',
      { title },
      { headers: { Authorization: token } }
    );
    setTitle('');
    fetchTasks();
  };

  const saveUpdatedTask = async () => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/tasks/${editId}`,
      { title },
      { headers: { Authorization: token } }
    );
    setTitle('');
    setEditMode(false);
    setEditId(null);
    fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { completed: !completed },
      { headers: { Authorization: token } }
    );
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: token },
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setEditId(task._id);
    setEditMode(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      {/* Left panel */}
      <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-lg mb-6 md:mb-0 md:mr-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">Task Manager</h2>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder={editMode ? 'Edit task' : 'Add new task'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={editMode ? saveUpdatedTask : createTask}
          className={`w-full px-4 py-2 rounded-md font-semibold ${
            editMode
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition`}
        >
          {editMode ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Right panel */}
      <div className="md:flex-1 bg-white p-6 rounded-xl shadow-lg overflow-y-auto">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available. Add one!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`p-4 rounded-md flex justify-between items-center transition shadow-sm border-l-4 ${
                  task.completed
                    ? 'bg-green-50 border-green-500'
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div>
                  <h4
                    className={`font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        task.completed ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(task._id, task.completed)}
                    className={`text-sm px-2 py-1 rounded-md transition flex items-center gap-1 ${
                      task.completed
                        ? 'bg-gray-300 hover:bg-gray-400 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {task.completed ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
