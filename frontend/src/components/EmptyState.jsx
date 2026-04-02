const EmptyState = ({ message, icon }) => {
  return (
    <div className="empty-state text-center">
      <div className="empty-icon">{icon || '📭'}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default EmptyState;