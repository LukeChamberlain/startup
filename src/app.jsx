import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import Login from './login/Login';
import CleanMusic from './cleanmusic/CleanMusic';
import Profile from './profile/Profile';
import Filters from './filters/Filters';
import Database from './database/Database';

const AuthState = {
  Authenticated: 'authenticated',
  Unauthenticated: 'unauthenticated'
};

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

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

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(newUserName, newAuthState) => {
                  setAuthState(newAuthState);
                  setUserName(newUserName);
                }}
              />
            }
          />
          <Route path="/cleanmusic" element={<CleanMusic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/database" element={<Database />} />
        </Routes>

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
