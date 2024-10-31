import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './filters.css';

export default function Filters() {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile'); // Navigate to Profile page
  };

  const goToDatabase = () => {
    navigate('/database'); // Navigate to Database page
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <button type="button" className="btn btn-secondary" onClick={goToProfile}>
          John 👤
        </button>
      </div>

      <div className="song-list left-aligned">
        <h1>Select Your Filters</h1>
        <input type="checkbox" id="Filter1" name="Filter1" value="Filter1" />
        <label htmlFor="Filter1"> Swear Words</label><br />
        <input type="checkbox" id="Filter2" name="Filter2" value="Filter2" />
        <label htmlFor="Filter2"> Violent Language</label><br />
        <input type="checkbox" id="Filter3" name="Filter3" value="Filter3" />
        <label htmlFor="Filter3"> Racially Aggressive Language</label><br />
        <input type="checkbox" id="Filter4" name="Filter4" value="Filter4" />
        <label htmlFor="Filter4"> Sexual Innuendo</label><br />
        <input type="checkbox" id="Filter5" name="Filter5" value="Filter5" />
        <label htmlFor="Filter5"> Suggestive Topics</label><br />
        <hr />
        <h3>Presets by Other Users (future websocket use)</h3>
        <input type="checkbox" id="Preset1" name="Preset1" value="Preset1" />
        <label htmlFor="Preset1"> Charlie Smith</label><br />
        <input type="checkbox" id="Preset2" name="Preset2" value="Preset2" />
        <label htmlFor="Preset2"> Thomas Brown</label><br />
      </div>

      {/* "Next" button to go to Database */}
      <div className="left-aligned">
        <button type="button" className="btn btn-secondary" onClick={goToDatabase}>
          Next
        </button>
      </div>
    </main>
  );
}
