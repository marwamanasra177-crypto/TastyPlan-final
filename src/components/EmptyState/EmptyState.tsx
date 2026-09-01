import "./EmptyState.css";
import emptyIcon from "../../assets/icons/dining.png";
interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-state">

      <div>
        <img  src={emptyIcon} alt="Empty state" className="empty-icon" />
      </div>

      <h2>{message}</h2>

    </div>
  );
}

export default EmptyState;