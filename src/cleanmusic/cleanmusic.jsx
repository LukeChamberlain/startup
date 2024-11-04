import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cleanmusic.css';

export default function CleanMusic(props) {
  const [song, setSong] = React.useState('Loading...')
  const navigate = useNavigate(); 

  React.useEffect(() => {
    setSong('Song Title');
  }, []);

  const handleProfileNavigation = () => {
    navigate('/profile'); // Navigates to profile page
  };

  const handleNext = () => {
    navigate('/filters'); // Navigates to filters page
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <button type="button" className="btn btn-secondary" onClick={handleProfileNavigation}>
          John 👤
        </button>

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
            <label className='song'>{song}</label>
          </div>
          <div>
            <input type="checkbox" id="Song2" name="Song2" value="Song2" />
            <label className='song'>{song}</label>
          </div>
          <div>
            <input type="checkbox" id="Song3" name="Song3" value="Song3" />
            <label className='song'>{song}</label>
          </div>
        </div>

        {/* Next button to go to Filters */}
        <div className="left-aligned">
          <button type="button" className="btn btn-secondary" onClick={handleNext}>Next</button>
        </div>
      </div>
    </main>
  );
}
