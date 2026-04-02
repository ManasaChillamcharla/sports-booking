import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchGround();
  }, [id]);

  const fetchGround = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/grounds/${id}`);
      setGround(response.data);
    } catch (err) {
      console.error('Error fetching ground:', err);
      setError('Failed to load ground details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotalPrice = () => {
    if (!ground || !formData.startTime || !formData.endTime) return 0;

    const start = new Date(`1970-01-01T${formData.startTime}`);
    const end = new Date(`1970-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    return hours > 0 ? hours * (ground.pricePerHour || 0) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.bookingDate || !formData.startTime || !formData.endTime) {
      setError('Please fill all fields');
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError('End time must be greater than start time');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/user/bookings', {
        groundId: Number(id),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      setSuccess('Booking created successfully');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-status-box">Loading...</div>
      </div>
    );
  }

  if (error && !ground) {
    return (
      <div className="booking-page">
        <div className="booking-status-box">
          <h2>{error}</h2>
          <button className="booking-btn back-btn" onClick={() => navigate('/dashboard')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="booking-page">
        <div className="booking-status-box">
          <h2>Ground not found</h2>
          <button className="booking-btn back-btn" onClick={() => navigate('/dashboard')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <div className="booking-hero-inner">
          <h1>Book Your Ground</h1>
          <p>Reserve your sports facility quickly and easily</p>
        </div>
      </section>

      <div className="booking-container">
        <div className="booking-layout">
          <div className="booking-card ground-summary">
            <h2>Ground Details</h2>

            <div className="ground-info">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{ground.name || 'N/A'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{ground.location || 'N/A'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Sport</span>
                <span className="detail-value">{ground.sportType || 'N/A'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Price / Hour</span>
                <span className="detail-value">₹{ground.pricePerHour || 0}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Available</span>
                <span className={`detail-value ${ground.available ? 'available' : 'not-available'}`}>
                  {ground.available ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="booking-card booking-form">
            <h2>Booking Form</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bookingDate">Booking Date</label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.startTime && formData.endTime && (
                <div className="price-summary">
                  <p>Total Price: ₹{calculateTotalPrice().toFixed(2)}</p>
                </div>
              )}

              {error && <div className="message error-message">{error}</div>}
              {success && <div className="message success-message">{success}</div>}

              <div className="button-group">
                <button
                  type="submit"
                  className="booking-btn confirm-btn"
                  disabled={submitting || !ground.available}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>

                <button
                  type="button"
                  className="booking-btn back-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;