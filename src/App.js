import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://scarlet-society-backend-3.vercel.app';

function App() {
  const [practices, setPractices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    segment: 'holiday_parade_2026'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/practices`);
      setPractices(response.data);
    } catch (error) {
      setMessage(`Error fetching practices: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date) {
      setMessage('Name and date are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/practices`, {
        name: formData.name,
        date: formData.date,
        segment: formData.segment
      });

      setPractices([...practices, response.data]);
      setFormData({ name: '', date: '', segment: 'holiday_parade_2026' });
      setMessage('Practice created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error creating practice: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Scarlet Society Admin</h1>
        <p className="subtitle">Create and manage practices</p>

        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Practice Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Saturday Morning Rehearsal"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="segment">Segment</label>
            <input
              type="text"
              id="segment"
              name="segment"
              value={formData.segment}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Practice'}
          </button>
        </form>

        <div className="practices-list">
          <h2>Upcoming Practices</h2>
          {loading && <p>Loading...</p>}
          {practices.length === 0 ? (
            <p className="empty">No practices yet</p>
          ) : (
            <ul>
              {practices.map(practice => (
                <li key={practice.id}>
                  <div className="practice-name">{practice.name}</div>
                  <div className="practice-date">{new Date(practice.date).toLocaleString()}</div>
                  {practice.segment && <div className="practice-segment">{practice.segment}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
