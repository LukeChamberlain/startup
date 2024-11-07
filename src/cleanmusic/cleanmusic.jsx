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
  ]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredSongs, setFilteredSongs] = useState(songs); 
  const [selectedSong, setSelectedSong] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  const handleNext = () => {
    if (selectedSong) {
      console.log("Navigating to Filters with song:", selectedSong); // Debug log
      navigate('/filters', { state: { song: selectedSong } });
    } else {
      alert("Please select a song before proceeding.");
    }
  };
  

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSongs(songs.filter(song => song.toLowerCase().includes(term)));
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song); 
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
                onChange={handleSearchChange} 
              />
            </div>
          </form>
        </div>

        <div className="song-list left-aligned">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`Song${index}`}
                  name="selectedSong"
                  value={song}
                  checked={selectedSong === song}
                  onChange={() => handleSongSelect(song)}
                />
                <label className='song' htmlFor={`Song${index}`}>{song}</label>
              </div>
            ))
          ) : (
            <p>No songs found</p>
          )}
        </div>

        <div className="left-aligned">
          <button type="button" className="btn btn-secondary" onClick={handleNext}>Next</button>
        </div>
      </div>
    </main>
  );
}
