import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile.css';

export default function Profile() {
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
        <section>
          <table>
            <thead>
              <tr>
                <th>Song Title</th>
                <th>Artist</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Baby</td>
                <td>Justin Bieber</td>
                <td>Clean</td>
              </tr>
              <tr>
                <td>18</td>
                <td>One Direction</td>
                <td>Clean</td>
              </tr>
              <tr>
                <td>Party Like a Rock Star</td>
                <td>SHOP BOYZ</td>
                <td>Explicit</td>
              </tr>
              <tr>
                <td>The Show Goes On</td>
                <td>Lupe Fiasco</td>
                <td>Explicit</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}