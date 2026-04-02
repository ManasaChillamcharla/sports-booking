import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      // api.js already has baseURL = http://localhost:8081/api
      // so do NOT add /api again here
      const response = await api.get('/user/bookings/my');

      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      await api.patch(`/user/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>My Bookings</h1>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '10px 16px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        Back
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <h3>{booking.groundName || 'Ground Booking'}</h3>
            <p><strong>Date:</strong> {booking.bookingDate || 'N/A'}</p>
            <p><strong>Start Time:</strong> {booking.startTime || 'N/A'}</p>
            <p><strong>End Time:</strong> {booking.endTime || 'N/A'}</p>
            <p><strong>Status:</strong> {booking.status || 'N/A'}</p>

            {booking.status !== 'CANCELLED' && (
              <button
                onClick={() => handleCancel(booking.id)}
                style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;