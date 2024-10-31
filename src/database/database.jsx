import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './database.css';

export default function Database() {
  const navigate = useNavigate(); 
  
  const handleProfileNavigation = () => {
    navigate('/profile'); 
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <button type="button" className="btn btn-secondary" onClick={handleProfileNavigation}>
          John 👤
        </button>
        
        <h1>Certified Clean ✅</h1>
        
        <img src="/MrC_Wink.png" alt="Mr. Clean" width="200" height="225" />
        
        <section>
          <button type="button" className="btn btn-secondary" onClick={handleProfileNavigation}>
            Add to your music
          </button>
        </section>
      </div>
    </main>
  );
}
