import React, { useState } from 'react';
import { supabase } from './supabaseClient';  // make sure you import your Supabase client

const UserPreferencesForm = () => {
  const [name, setName] = useState('');
  const [subDom, setSubDom] = useState(false);
  const [roleplay, setRoleplay] = useState(false);
  const [pictures, setPictures] = useState(false);
  const [videos, setVideos] = useState(false);
  const [challenges, setChallenges] = useState(false);

  // States for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('name', name)
        .single();

      if (fetchError) {
        alert("Error fetching existing data");
        console.error(fetchError);
        return;
      }

      let response;

      if (existingData) {
        // Update user preferences
        response = await supabase
          .from('user_preferences')
          .update({
            sub_dom: subDom,
            roleplay: roleplay,
            pictures: pictures,
            videos: videos,
            challenges: challenges,
          })
          .eq('name', name);

        if (response.error) {
          alert("Error updating preferences");
          console.error(response.error);
          return;
        }

        alert(`Successfully updated preferences for ${name}`);
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .ilike('name', `%${searchQuery}%`); // Using ilike for case-insensitive search

      if (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        return;
      }

      setSearchResults(data);
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
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

        {/* The preference switches */}
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

      {/* Search Box */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name"
        />
        <button onClick={handleSearch}>Search</button>

        {/* Display Search Results */}
        {searchResults !== null && (
          <div>
            {searchResults?.length === 0 ? (
              <p>No results found</p>
            ) : (
              <ul>
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong>:<br />
                    <ul>
                      {/* Showing "Dom" if subDom is true, otherwise "Sub" */}
                      <li>Sub Dom: {user.sub_dom ? "Dom" : "Sub"}</li>
                      <li>Roleplay: {user.roleplay ? "True" : "False"}</li>
                      <li>Pictures: {user.pictures ? "True" : "False"}</li>
                      <li>Videos: {user.videos ? "True" : "False"}</li>
                      <li>Challenges: {user.challenges ? "True" : "False"}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

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
