import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroundCard from '../components/GroundCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [grounds, setGrounds] = useState([]);
  const [filteredGrounds, setFilteredGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportType, setSportType] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchGrounds();
  }, []);

  useEffect(() => {
    filterGrounds();
  }, [grounds, searchTerm, sportType]);

  const fetchGrounds = async () => {
    setLoading(true);

    const sampleGrounds = [
      { id: 1, name: 'Cricket Arena', location: 'Hyderabad', sportType: 'CRICKET', pricePerHour: 800, available: true },
      { id: 2, name: 'Royal Cricket Ground', location: 'Vijayawada', sportType: 'CRICKET', pricePerHour: 750, available: true },
      { id: 3, name: 'Champions Cricket Turf', location: 'Guntur', sportType: 'CRICKET', pricePerHour: 700, available: true },

      { id: 4, name: 'City Football Turf', location: 'Hyderabad', sportType: 'FOOTBALL', pricePerHour: 900, available: true },
      { id: 5, name: 'Victory Football Arena', location: 'Warangal', sportType: 'FOOTBALL', pricePerHour: 850, available: true },
      { id: 6, name: 'Green Field Stadium', location: 'Visakhapatnam', sportType: 'FOOTBALL', pricePerHour: 950, available: true },

      { id: 7, name: 'Smash Badminton Court', location: 'Hyderabad', sportType: 'BADMINTON', pricePerHour: 500, available: true },
      { id: 8, name: 'Ace Badminton Hall', location: 'Vijayawada', sportType: 'BADMINTON', pricePerHour: 450, available: true },
      { id: 9, name: 'Pro Shuttle Arena', location: 'Guntur', sportType: 'BADMINTON', pricePerHour: 550, available: true },

      { id: 10, name: 'Grand Tennis Court', location: 'Hyderabad', sportType: 'TENNIS', pricePerHour: 600, available: true },
      { id: 11, name: 'Elite Tennis Club', location: 'Warangal', sportType: 'TENNIS', pricePerHour: 650, available: true },
      { id: 12, name: 'Champ Tennis Point', location: 'Visakhapatnam', sportType: 'TENNIS', pricePerHour: 620, available: true },

      { id: 13, name: 'Hoops Basketball Arena', location: 'Hyderabad', sportType: 'BASKETBALL', pricePerHour: 700, available: true },
      { id: 14, name: 'Sky Dunk Court', location: 'Vijayawada', sportType: 'BASKETBALL', pricePerHour: 680, available: true },
      { id: 15, name: 'Fast Break Stadium', location: 'Guntur', sportType: 'BASKETBALL', pricePerHour: 720, available: true }
    ];

    setGrounds(sampleGrounds);
    setLoading(false);
  };

  const filterGrounds = () => {
    let filtered = grounds;

    if (searchTerm) {
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sportType) {
      filtered = filtered.filter(
        (g) => g.sportType.toLowerCase() === sportType.toLowerCase()
      );
    }

    setFilteredGrounds(filtered);
  };

  const sportTypes = [...new Set(grounds.map((g) => g.sportType))];

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <Navbar />

      <div className="hero">
        <div className="container">
          <h1 className="hero-title">🏟️ Book Your Perfect Sports Ground</h1>
          <p className="hero-subtitle">
            Find and reserve premium sports facilities near you
          </p>
        </div>
      </div>

      <div className="container">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            className="sport-select"
          >
            <option value="">All Sports</option>
            {sportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="user-actions">
          <Link to="/my-bookings" className="btn btn-primary">
            My Bookings
          </Link>
        </div>

        <div className="grounds-section">
          {filteredGrounds.length === 0 ? (
            <EmptyState message="No grounds found matching your criteria" />
          ) : (
            <div className="grid grid-3">
              {filteredGrounds.map((ground) => (
                <GroundCard key={ground.id} ground={ground} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;