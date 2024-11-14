import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './database.css';

export default function Database() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSong = location.state?.song;
  const filters = location.state?.filters;

  if (!selectedSong || !filters) {
    return (
      <main className="container-fluid bg-secondary text-center">
        <h1>Error: Missing Song or Filters</h1>
      </main>
    );
  }

  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/lyrics', {
          params: {
            song: selectedSong,
            artist: location.state?.artist,
          },
        });

        if (response.data) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data, "text/xml");
          const lyricText = xmlDoc.getElementsByTagName('Lyric')[0]?.textContent || '';
          setLyrics(lyricText);
        } else {
          setError('No response data from API.');
        }
      } catch (err) {
        console.error('Error fetching lyrics:', err);
        setError('Failed to fetch lyrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [selectedSong, location.state?.artist]);

  const filterConditions = {
    swearWords: /(?:\b(?:damn|hell|crap|bastard|ass|...)\b)/gi, // shortened for readability
    violentLanguage: /(?:\b(?:kill|murder|assault|...)\b)/gi,
    raciallyAggressive: /(?:\b(?:ape|bimbo|cotton picker|...)\b)/gi,
    sexualInnuendo: /(?:\b(?:sex|innuendo|explicit|...)\b)/gi,
    suggestiveTopics: /(?:\b(?:drug|alcohol|abuse|...)\b)/gi,
  };

  const hasOffensiveContent = Object.entries(filters).some(
    ([filterKey, isSelected]) =>
      isSelected && filterConditions[filterKey]?.test(lyrics)
  );

  const handleAddToProfile = () => {
    const songData = {
      title: selectedSong,
      artist: 'Unknown Artist',
      status: hasOffensiveContent ? 'Explicit' : 'Clean',
    };
    navigate('/profile');
  };

  return (
    <main className="container-fluid bg-secondary">
      <div>
        {!loading && !error && (
          <>
            <h1>{hasOffensiveContent ? 'Not Certified Clean ❌' : 'Certified Clean ✅'}</h1>
            <p>Song: {selectedSong}</p>
            <button className="btn btn-primary" onClick={handleAddToProfile}>Add to Profile</button>
          </>
        )}
      </div>
    </main>
  );
}
