import "./EmptyState.css";

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        🍽️
      </div>

      <h2>{message}</h2>

    </div>
  );
}

export default EmptyState;