import "./LoadingSkeleton.css";

function LoadingSkeleton() {
  return (
    <div className="skeleton-grid">

      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-image"></div>
          <div className="skeleton-line title"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line small"></div>
        </div>
      ))}

    </div>
  );
}

export default LoadingSkeleton;