import React, { useState } from 'react';
import { supabase } from './supabaseClient';  // make sure you import your Supabase client

const UserPreferencesForm = () => {
  const [name, setName] = useState(''); // or any unique identifier, like userID
  const [subDom, setSubDom] = useState(false);  // assuming these options are boolean
  const [roleplay, setRoleplay] = useState(false);
  const [pictures, setPictures] = useState(false);
  const [videos, setVideos] = useState(false);
  const [challenges, setChallenges] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      // Check if the user with the given 'name' exists in the DB
      const { data: existingData, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('name', name)
        .single();  // Expecting a single result

      if (fetchError) {
        alert("Error fetching existing data");
        console.error(fetchError);
        return;
      }

      let response;

      if (existingData) {
        // User exists, so update their preferences
        response = await supabase
          .from('user_preferences')
          .update({
            sub_dom: subDom,          // Setting subDom to true/false
            roleplay: roleplay,       // Setting roleplay to true/false
            pictures: pictures,       // Setting pictures to true/false
            videos: videos,           // Setting videos to true/false
            challenges: challenges,   // Setting challenges to true/false
          })
          .eq('name', name);  // You can also use an ID or another unique field

        if (response.error) {
          alert("Error updating preferences");
          console.error(response.error);
          return;
        }

        alert(`Successfully updated preferences for ${name}`);
      } else {
        // If the user doesn't exist in the DB, show an error message
        alert('User not found');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div>
      <h2>User Preferences</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="switch-container">
          <label>Sub Dom:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={subDom}
              onChange={() => setSubDom(!subDom)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="switch-container">
          <label>Roleplay:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={roleplay}
              onChange={() => setRoleplay(!roleplay)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="switch-container">
          <label>Pictures:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={pictures}
              onChange={() => setPictures(!pictures)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="switch-container">
          <label>Videos:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={videos}
              onChange={() => setVideos(!videos)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="switch-container">
          <label>Challenges:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={challenges}
              onChange={() => setChallenges(!challenges)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <button type="submit">Update Preferences</button>
      </form>

      <style jsx>{`
        .switch-container {
          margin: 10px 0;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 50px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 12px;
          width: 12px;
          border-radius: 50px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #4CAF50;
        }

        input:checked + .slider:before {
          transform: translateX(14px);
        }
      `}</style>
    </div>
  );
};

export default UserPreferencesForm;
