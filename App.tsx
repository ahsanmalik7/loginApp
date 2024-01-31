// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginForm {
  username: string;
  password: string;
}

const fakeUser = {
  username: 'user',
  password: 'password',
};

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${data.username}:${data.password}`)}`,
        },
      });

      if (response.ok) {
        setLoggedIn(true);
        localStorage.setItem('username', data.username);
        toast.success('Login successful');
      } else {
        setError('password', {
          type: 'manual',
          message: 'Invalid username or password',
        });
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label htmlFor="username">Username</label>
                    <input {...register('username', { required: 'Username is required' })} />
                    {errors.username && <p>{errors.username.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <input type="pa
