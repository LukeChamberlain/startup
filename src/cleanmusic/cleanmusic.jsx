import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import './cleanmusic.css';

export default function CleanMusic() {
  const navigate = useNavigate(); // Hook to navigate

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    navigate('/cleanmusic'); // Navigate to the cleanmusic route
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <form onSubmit={handleSubmit} className="left-aligned">
          <button type="submit" className="btn btn-secondary">John 👤</button>
        </form>

        <div className="search-container">
          <form className="search-form">
            <div className="search-wrapper">
              <label htmlFor="search-input"></label>
              <input type="search" id="search-input" name="q" placeholder="Search for Music" />
            </div>
            <button type="button" className="btn btn-secondary">Search</button>
          </form>
        </div>

        <div className="song-list left-aligned">
          <div>
            <input type="checkbox" id="Song1" name="Song1" value="Song1" />
            <label htmlFor="Song1"> Song 1</label>
          </div>
          <div>
            <input type="checkbox" id="Song2" name="Song2" value="Song2" />
            <label htmlFor="Song2"> Song 2</label>
          </div>
          <div>
            <input type="checkbox" id="Song3" name="Song3" value="Song3" />
            <label htmlFor="Song3"> Song 3</label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="left-aligned">
          <button type="submit" className="btn btn-secondary">Next</button>
        </form>
      </div>
    </main>
  );
}
