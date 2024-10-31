import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

export default function Login() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <div>
          <h1>Welcome to Clean Music Plus</h1>
          <form className="get" to="/cleanmusic">
            <div class="input-group mb-3">
              <span class="input-group-text">@</span>
              <input class="form-control" type="text" placeholder="your@email.com" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">🔒</span>
              <input class="form-control" type="password" placeholder="password" />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <button type="submit" class="btn btn-secondary">Create</button>
          </form>
        </div>
      </main>
  );
}