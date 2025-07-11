import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    await axios.post('http://localhost:5000/api/auth/register', { username, password });
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <input className="border p-2 m-2" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input className="border p-2 m-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
