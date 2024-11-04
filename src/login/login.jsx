import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

export default function Login() {
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/cleanmusic'); 
  };

  return (
    <main className="container-fluid bg-secondary text-center d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-form">
        <h1>Welcome to Clean Music Plus</h1>
        <form onSubmit={handleSubmit} className="get">
          <div className="input-group mb-3">
            <span className="input-group-text">@</span>
            <input className="form-control" type="text" placeholder="your@email.com" required />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">🔒</span>
            <input className="form-control" type="password" placeholder="password" required />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/cleanmusic')}>Create</button>
        </form>
      </div>
    </main>
  );
}
