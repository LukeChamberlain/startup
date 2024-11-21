import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './filters.css';

export default function Filters() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSong = location.state?.song;
  const email = location.state?.email;

  const [filters, setFilters] = useState({
    swearWords: false,
    violentLanguage: false,
    raciallyAggressive: false,
    sexualInnuendo: false,
    suggestiveTopics: false,
  });

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: checked }));
  };

  const goToDatabase = () => {
    console.log("Navigating to Database with song:", selectedSong, "and filters:", filters); // Debug log
    navigate('/database', { state: { song: selectedSong, filters } });
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        {/* Display the email as text, styled like on cleanmusic page */}
        <div className="email-display">
          <span>{email}</span>
        </div>
      </div>

      <div className="song-list left-aligned">
        <h1>Select Your Filters</h1>
        <input type="checkbox" id="Filter1" name="swearWords" checked={filters.swearWords} onChange={handleFilterChange} />
        <label htmlFor="Filter1"> Swear Words</label><br />
        <input type="checkbox" id="Filter2" name="violentLanguage" checked={filters.violentLanguage} onChange={handleFilterChange} />
        <label htmlFor="Filter2"> Violent Language</label><br />
        <input type="checkbox" id="Filter3" name="raciallyAggressive" checked={filters.raciallyAggressive} onChange={handleFilterChange} />
        <label htmlFor="Filter3"> Racially Aggressive Language</label><br />
        <input type="checkbox" id="Filter4" name="sexualInnuendo" checked={filters.sexualInnuendo} onChange={handleFilterChange} />
        <label htmlFor="Filter4"> Sexual Innuendo</label><br />
        <input type="checkbox" id="Filter5" name="suggestiveTopics" checked={filters.suggestiveTopics} onChange={handleFilterChange} />
        <label htmlFor="Filter5"> Suggestive Topics</label><br />
        <hr />
      </div>

      <div className="song-list left-aligned">
        <h1>Select Preset Filters (Future Websocket Use)</h1>
        <input type="checkbox" id="PresetFilter1" name="Jeff Smith" />
        <label htmlFor="PresetFilter1"> Jeff Smith</label><br />
        <input type="checkbox" id="PresetFilter2" name="Luke Chamberlain" />
        <label htmlFor="PresetFilter2"> Luke Chamberlain</label><br />
        <hr />
      </div>

      <div className="left-aligned">
        <button type="button" className="btn btn-secondary" onClick={goToDatabase}>
          Next
        </button>
      </div>
    </main>
  );
}
