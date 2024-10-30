import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';


export default function App() {
  return (
    <div className='body bg-light text-dark'>
      <header className='container-fluid'>
        <nav className='navbar fixed-top navbar-light'>
          <menu class="navbar-nav ms-auto d-flex justify-content-start gap-3">
            <a class="nav-link active" href="index.html">Home</a>
            <li class="nav-item">
              <a class="nav-link" href="profile.html">Your Music</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="cleanmusic.html">Clean Your Music</a>
            </li>
          </menu>
        </nav>
      </header>

      <main>App components go here</main>

      <footer className='bg-light text-dark'>
        <div className='container-fluid'>
          <span className='text-reset'>Luke Chamberlain</span>
          <a className='text-reset' href="https://github.com/LukeChamberlain/startup">
            Github
          </a>
        </div>
      </footer>
    </div>
  );
}