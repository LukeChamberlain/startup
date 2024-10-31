import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import Login from './login/Login';
import CleanMusic from './cleanmusic/CleanMusic';
import Profile from './profile/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className='body bg-light text-dark'>
        <header className='container-fluid'>
          <nav className='navbar fixed-top navbar-light'>
            <menu className="navbar-nav ms-auto d-flex justify-content-start gap-3">
              <NavLink className="nav-link" to="/">Home</NavLink>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">Your Music</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cleanmusic">Clean Your Music</NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cleanmusic" element={<CleanMusic />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className='bg-light text-dark'>
          <div className='container-fluid'>
            <span className='text-reset'>Luke Chamberlain</span>
            <a className='text-reset' href="https://github.com/LukeChamberlain/startup">
              Github
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className='container-fluid bg-secondary text-center'>
      404: Return to sender. Address unknown.
    </main>
  );
}
