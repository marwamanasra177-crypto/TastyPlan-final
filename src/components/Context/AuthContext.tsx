import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AUTH_BASE_URL = "http://localhost:5000/api/auth";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (user: AuthUser, token: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // On first load, restore session from localStorage and
    // confirm it's still valid against the backend.
    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        const verifySession = async () => {

            try {

                const response = await fetch(
                    `${AUTH_BASE_URL}/me`,
                    {
                        credentials: "include",
                        headers: storedToken
                            ? { Authorization: `Bearer ${storedToken}` }
                            : {},
                    }
                );

                if (!response.ok) {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    return;
                }

                const data = await response.json();
                setUser(data.user);

            } catch (error) {
                console.error(
                    "Failed to verify session:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        verifySession();

    }, []);

    const login = (newUser: AuthUser, newToken: string) => {

        setUser(newUser);
        setToken(newToken);

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", newToken);
    };

    const logout = async () => {

        try {
            await fetch(`${AUTH_BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        }

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
