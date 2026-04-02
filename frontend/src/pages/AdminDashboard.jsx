import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('grounds');
  const [grounds, setGrounds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groundForm, setGroundForm] = useState({
    name: '',
    sportType: '',
    location: '',
    description: '',
    pricePerHour: '',
    imageUrl: '',
    available: true
  });

  useEffect(() => {
    if (activeTab === 'grounds') fetchGrounds();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchGrounds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/grounds');
      setGrounds(response.data);
    } catch (error) {
      console.error('Error fetching grounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroundSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/grounds', {
        ...groundForm,
        pricePerHour: parseFloat(groundForm.pricePerHour)
      });
      setGroundForm({
        name: '',
        sportType: '',
        location: '',
        description: '',
        pricePerHour: '',
        imageUrl: '',
        available: true
      });
      fetchGrounds();
    } catch (error) {
      alert('Failed to add ground');
    }
  };

  const handleUserStatus = async (id, enabled) => {
    try {
      await api.patch(`/api/admin/users/${id}/status`, { enabled });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleBookingAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.patch(`/api/admin/bookings/${id}/approve`);
      } else {
        await api.patch(`/api/admin/bookings/${id}/reject`);
      }
      fetchBookings();
    } catch (error) {
      alert(`Failed to ${action} booking`);
    }
  };

  const sportTypes = ['CRICKET', 'FOOTBALL', 'BADMINTON', 'TENNIS', 'BASKETBALL'];

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'grounds' ? 'active' : ''}`}
            onClick={() => setActiveTab('grounds')}
          >
            Manage Grounds
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Manage Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
        </div>

        {activeTab === 'grounds' && (
          <div className="tab-content">
            <div className="add-ground-form card">
              <h2>Add New Ground</h2>
              <form onSubmit={handleGroundSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={groundForm.name}
                      onChange={(e) => setGroundForm({...groundForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sport Type</label>
                    <select
                      value={groundForm.sportType}
                      onChange={(e) => setGroundForm({...groundForm, sportType: e.target.value})}
                      required
                    >
                      <option value="">Select Sport</option>
                      {sportTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={groundForm.location}
                      onChange={(e) => setGroundForm({...groundForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price per Hour</label>
                    <input
                      type="number"
                      step="0.01"
                      value={groundForm.pricePerHour}
                      onChange={(e) => setGroundForm({...groundForm, pricePerHour: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={groundForm.description}
                    onChange={(e) => setGroundForm({...groundForm, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={groundForm.imageUrl}
                    onChange={(e) => setGroundForm({...groundForm, imageUrl: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Ground</button>
              </form>
            </div>

            <div className="grounds-list">
              <h2>Existing Grounds</h2>
              {loading ? <Loader /> : grounds.length === 0 ? (
                <EmptyState message="No grounds found" />
              ) : (
                <div className="grid grid-3">
                  {grounds.map(ground => (
                    <div key={ground.id} className="ground-admin-card card">
                      <img src={ground.imageUrl || '/placeholder.jpg'} alt={ground.name} />
                      <h3>{ground.name}</h3>
                      <p>{ground.location}</p>
                      <p>{ground.sportType}</p>
                      <p>${ground.pricePerHour}/hour</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="tab-content">
            <h2>Booking Management</h2>
            {loading ? <Loader /> : bookings.length === 0 ? (
              <EmptyState message="No bookings found" />
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ground</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.ground.name}</td>
                        <td>{booking.user.fullName}</td>
                        <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td>{booking.startTime} - {booking.endTime}</td>
                        <td>{booking.status}</td>
                        <td>
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'approve')}
                                className="btn btn-secondary btn-small"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'reject')}
                                className="btn btn-danger btn-small"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>User Management</h2>
            {loading ? <Loader /> : users.length === 0 ? (
              <EmptyState message="No users found" />
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.enabled ? 'Active' : 'Disabled'}</td>
                        <td>
                          <button
                            onClick={() => handleUserStatus(user.id, !user.enabled)}
                            className={`btn ${user.enabled ? 'btn-danger' : 'btn-secondary'} btn-small`}
                          >
                            {user.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;