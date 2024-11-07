import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileSongs, setProfileSongs] = useState([]);

  const addSongToProfile = (songData) => {
    setProfileSongs((prevSongs) => [...prevSongs, songData]);
  };

  return (
    <ProfileContext.Provider value={{ profileSongs, addSongToProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
