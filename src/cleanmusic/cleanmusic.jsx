import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cleanmusic.css';

export default function CleanMusic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the email from the location state
  const email = location.state?.email;

  const handleSearchChange = async (event) => {
    const term = event.target.value.trim().toLowerCase(); // Trim spaces before processing
    setSearchTerm(term);
  
    if (term.length < 2) {
      setError('Please enter at least 2 characters.');
      setFilteredSongs([]); // Clear previous results
      return; // Early return if the query is too short
    }
  
    try {
      setLoading(true); // Show loading spinner
      const response = await axios.get('/api/search', {
        params: { query: term, artist: term, song: term }
      });
  
      console.log("Response from API:", response.data);
  
      const songList = response.data
        .filter((song) => song.artist && song.title) // Ensure there are both artist and title
        .map((song) => ({
          artist: song.artist,
          title: song.title,
          songUrl: song.SongUrl,
          artistUrl: song.ArtistUrl,
        }));
  
      if (songList.length === 0) {
        setError('No songs found for your search');
      } else {
        setError(''); // Clear previous errors
      }
  
      setFilteredSongs(songList);
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching songs');
      setFilteredSongs([]);
    } finally {
      setLoading(false); // Hide loading spinner after fetching
    }
  };
  

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleNext = async () => {
    if (selectedSong) {
      const { artist, title } = selectedSong;

      try {
        setLoading(true);
        const response = await axios.get('/api/lyrics', {
          params: { artist, title },
        });
        const { lyrics } = response.data;

        navigate('/filters', { state: { song: `${artist} - ${title}`, lyrics } });
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        setError('Failed to fetch lyrics. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a song before proceeding.");
    }
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <h3>Logged in as: {email}</h3> {/* Display logged-in user's email */}
        <div className="search-container">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-wrapper">
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

        {loading && <p>Loading...</p>} {/* Show loading spinner */}
        {error && <p className="text-danger">{error}</p>} {/* Show error message */}

        <div className="song-list left-aligned">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`Song${index}`}
                  name="selectedSong"
                  value={`${song.artist} - ${song.title}`}
                  checked={selectedSong?.title === song.title && selectedSong?.artist === song.artist}
                  onChange={() => handleSongSelect(song)}
                />
                <label className="song" htmlFor={`Song${index}`}>
                  {song.artist} - {song.title}
                </label>
              </div>
            ))
          ) : (
            <p>No songs found</p>
          )}
        </div>

        <div className="next-button-container">
          <button
            className="next-button btn btn-primary"
            onClick={handleNext}
            disabled={!selectedSong || loading}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}