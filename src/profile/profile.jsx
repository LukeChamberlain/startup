import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile.css';

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [addedSongs, setAddedSongs] = useState([]);

  useEffect(() => {
    const fetchUserSongs = async () => {
      try {
        const response = await axios.get('/api/profile/songs');
        setAddedSongs(response.data);
      } catch (error) {
        console.error('Error fetching user songs:', error);
      }
    };

    if (email) {
      fetchUserSongs();
    }
  }, [email]);

  return (
    <main className="container-fluid bg-light">
      <h1>Your Profile</h1>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Song Title</th>
              <th>Artist</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {addedSongs.length > 0 ? (
              addedSongs.map((song, index) => (
                <tr key={index}>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No songs added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
