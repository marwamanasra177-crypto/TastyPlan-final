import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";

function PublicOnlyRoute({ children }: { children: ReactNode }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="protected-route-loading">
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default PublicOnlyRoute;
