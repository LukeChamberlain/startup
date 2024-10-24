import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Database } from './database/database';
import { CleanMusic } from './cleanmusic/cleanmusic';
import { Profile } from './profile/profile';
import { Filters } from './filters/filters';

export default function App() {
  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='bg-light text-dark'>
          <nav className='navbar fixed-top navbar-dark'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link active' to='/login'>Home</NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/profile'>Your Music</NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/cleanmusic'>Clean Your Music</NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <main className="container">
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/cleanmusic' element={<CleanMusic />} />
            <Route path='/database' element={<Database />} />
            <Route path='/filters' element={<Filters />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-light text-dark">
          <div className="container-fluid">
            <span className='text-reset'>Luke Chamberlain</span>
            <a className='text-reset' href="https://github.com/LukeChamberlain/startup">Github</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
