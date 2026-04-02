import { Link } from 'react-router-dom';
import '../styles/card.css';

const getSportIcon = (sport) => {
  switch (sport?.toUpperCase()) {
    case 'CRICKET': return '🏏';
    case 'FOOTBALL': return '⚽';
    case 'BADMINTON': return '🏸';
    case 'TENNIS': return '🎾';
    case 'BASKETBALL': return '🏀';
    default: return '🏟️';
  }
};

const GroundCard = ({ ground }) => {
  return (
    <div className="ground-card card">

      {/* 🔥 Clean Header (NO EMPTY SPACE) */}
      <div className="card-top">
        <div className="sport-icon">
          {getSportIcon(ground.sportType)}
        </div>

        <div className={`badge ${ground.available ? 'badge-available' : 'badge-unavailable'}`}>
          {ground.available ? 'Available' : 'Unavailable'}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{ground.name}</h3>
        <p className="card-location">📍 {ground.location}</p>
        <p className="card-sport">🏷 {ground.sportType}</p>
        <p className="card-price">₹{ground.pricePerHour}/hour</p>

        {ground.available && (
          <Link to={`/book/${ground.id}`} className="btn btn-primary card-btn">
            Book Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default GroundCard;