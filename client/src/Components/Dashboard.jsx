import React, { useEffect, useState } from 'react';
import './dashboard.css'

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetched data:', result);
        setData(result.data);
        setLoading(false); 
      } else {
        console.error('Failed to fetch data');
        setError('Failed to fetch data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   console.log('Updated data:', data); 
  // }, [data]);

  return (
    <div className="profile">
      <h1 className="profile-center">Dashboard</h1>
      {loading ? (
        <div>Loading user data...</div>
      ) : error ? (
        <div>{error}</div>
      ) : data ? (
        <div className="profile-container">
          <h2>User Information</h2>
          <p>ID: {data.id}</p>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>

          <h2>Text Tests</h2>
          <p>Total Tests: {data.text_tests}</p>
          <p>Tests Today: {data.text_tests_today}</p>
          <p>Highest WPM Ever: {data.highest_text_wpm_ever}</p>

          <h2>Code Tests</h2>
          <p>Total Tests: {data.code_tests}</p>
          <p>Tests Today: {data.code_tests_today}</p>
          <p>Highest WPM Ever: {data.highest_code_wpm_ever}</p>
        </div>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default Dashboard;
