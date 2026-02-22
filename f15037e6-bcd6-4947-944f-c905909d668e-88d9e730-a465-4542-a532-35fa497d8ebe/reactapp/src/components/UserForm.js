import React, { useState } from 'react';
import { createUser } from '../utils/api';

const UserForm = ({ onUserCreated }) => {
 const [username, setUsername] = useState('');
 const [email, setEmail] = useState('');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!username || !email) {
   setError('required');
   return;
  }
  if (!validateEmail(email)) {
   setError('invalid email');
   return;
  }
  try {
   const user = await createUser({ username, email });
   onUserCreated(user);
   setSuccess('User created');
   setUsername('');
   setEmail('');
   setError('');
  } catch (err) {
   setError('Failed to create user');
  }
 };

 return (
  <form onSubmit={handleSubmit}>
   <label htmlFor="username-input">username</label>
   <input id="username-input" data-testid="username-input" value={username} onChange={(e) => setUsername(e.target.value)} />
   <label htmlFor="email-input">email</label>
   <input id="email-input" data-testid="email-input" value={email} onChange={(e) => setEmail(e.target.value)} />
   <button type="submit">create user</button>
   {error && <div data-testid="form-error">{error}</div>}
   {success && <div data-testid="form-success">{success}</div>}
  </form>
 );
};

export default UserForm;

