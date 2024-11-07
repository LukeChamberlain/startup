import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cleanmusic.css';

export default function CleanMusic(props) {
  const [songs, setSongs] = useState([
    'Song Title 1',
    'Song Title 2',
    'Song Title 3',
    'Another Song',
    'Different Song'
  ]); // List of all songs
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search input
  const [filteredSongs, setFilteredSongs] = useState(songs); // Songs to display based on search
  const navigate = useNavigate(); 

  useEffect(() => {
    // Initialize song list if necessary
    setFilteredSongs(songs);
  }, [songs]);

  // Handle profile navigation
  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  // Handle navigation to filters
  const handleNext = () => {
    navigate('/filters');
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    // Filter songs based on search term
    setFilteredSongs(songs.filter(song => song.toLowerCase().includes(term)));
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <button type="button" className="btn btn-secondary" onClick={handleProfileNavigation}>
          John 👤
        </button>

        <div className="search-container">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-wrapper">
              <label htmlFor="search-input"></label>
              <input
                type="search"
                id="search-input"
                name="q"
                placeholder="Search for Music"
                value={searchTerm}
                onChange={handleSearchChange} // Update search input
              />
            </div>
          </form>
        </div>

        <div className="song-list left-aligned">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => (
              <div key={index}>
                <input type="checkbox" id={`Song${index}`} name={`Song${index}`} value={song} />
                <label className='song' htmlFor={`Song${index}`}>{song}</label>
              </div>
            ))
          ) : (
            <p>No songs found</p> // Display message if no songs match the search
          )}
        </div>

        <div className="left-aligned">
          <button type="button" className="btn btn-secondary" onClick={handleNext}>Next</button>
        </div>
      </div>
    </main>
  );
}
