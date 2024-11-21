import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import Login from './login/login';
import CleanMusic from './cleanmusic/CleanMusic';
import Profile from './profile/Profile';
import Filters from './filters/Filters';
import Database from './database/Database';
import { AuthState } from './login/authState';

export default function App() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [authState, setAuthState] = useState(userName ? AuthState.Authenticated : AuthState.Unauthenticated);

  const handleAuthChange = (userName, authState) => {
    setAuthState(authState);
    setUserName(userName);
    if (authState === AuthState.Authenticated) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
    }
  };

  // Scroll event handler with persistent lastScrollTop
  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHideNavbar(scrollTop > lastScrollTop);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className="body bg-light text-dark">
        <header className={`container-fluid ${hideNavbar ? 'hidden' : ''}`}>
          <nav className="navbar navbar-light w-100 justify-content-center">
            <ul className="navbar-nav w-100 flex-row justify-content-center gap-3">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              {authState === AuthState.Authenticated && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">Your Music</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/cleanmusic">Clean Your Music</NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Login onAuthChange={handleAuthChange} />} />
            <Route path="/cleanmusic" element={<CleanMusic />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/database" element={<Database />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="container-fluid">
          <div>
            <span className="text-reset">Luke Chamberlain</span>
            <a className="text-reset float-end" href="https://github.com/LukeChamberlain/startup">
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
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
