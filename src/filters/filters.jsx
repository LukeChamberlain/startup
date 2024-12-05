import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './filters.css';

export default function Filters() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [filters, setFilters] = useState({
    swearWords: false,
    violentLanguage: false,
    raciallyAggressive: false,
    sexualInnuendo: false,
    suggestiveTopics: false,
  });

  const [activeUsers, setActiveUsers] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`/api/filters?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setFilters(data.filters);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
  
    fetchFilters();
  
    // Initialize the WebSocket connection
    const socket = new WebSocket('ws://localhost:3000');
    setWs(socket);
  
    // WebSocket event handlers
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ type: 'username', username: email }));
    };
  
    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const message = JSON.parse(event.data);
      if (message.type === 'userList') {
        setActiveUsers(message.users);
      }
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [email]);
  

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
  };

  const goToDatabase = async () => {
    navigate('/database', { state: { filters } });
  };

  return (
    <main className="container-fluid bg-secondary text-center">

      <div className="song-list left-aligned">
        <h1>Select Your Filters</h1>
        <input
          type="checkbox"
          id="Filter1"
          name="swearWords"
          checked={filters.swearWords}
          onChange={handleFilterChange}
        />
        <label htmlFor="Filter1"> Swear Words</label>
        <br />
        <input
          type="checkbox"
          id="Filter2"
          name="violentLanguage"
          checked={filters.violentLanguage}
          onChange={handleFilterChange}
        />
        <label htmlFor="Filter2"> Violent Language</label>
        <br />
        <input
          type="checkbox"
          id="Filter3"
          name="raciallyAggressive"
          checked={filters.raciallyAggressive}
          onChange={handleFilterChange}
        />
        <label htmlFor="Filter3"> Racially Aggressive Language</label>
        <br />
        <input
          type="checkbox"
          id="Filter4"
          name="sexualInnuendo"
          checked={filters.sexualInnuendo}
          onChange={handleFilterChange}
        />
        <label htmlFor="Filter4"> Sexual Innuendo</label>
        <br />
        <input
          type="checkbox"
          id="Filter5"
          name="suggestiveTopics"
          checked={filters.suggestiveTopics}
          onChange={handleFilterChange}
        />
        <label htmlFor="Filter5"> Suggestive Topics</label>
        <br />
        <hr />
      </div>

      <div className="song-list left-aligned">
        <h1>Active Users</h1>
        <ul>
        <h3>{email}</h3> 
          {activeUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
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

