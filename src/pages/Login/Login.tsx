import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/Context/AuthContext";
import "./Login.css";

function Login() {


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();
const { login } = useAuth();

const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Login failed");
            return;
        }

        login(data.user, data.token);

        if (data.user.role === "admin") {

            window.location.href =
                "http://localhost:5000/dashboard";

        } else {

            navigate("/");

        }

    } catch (error) {

        console.error(error);
        setError("Unable to connect to the server");

    }
};

return (
    <div className="auth-page">

        <div className="auth-card">

            <div className="auth-logo">🍲</div>

            <h1>Welcome Back</h1>
            <p className="auth-subtitle">
                Log in to your TastyPlan account
            </p>

            <form className="auth-form" onSubmit={handleLogin}>

                <div className="auth-field">
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="auth-field">
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <p className="auth-error">{error}</p>
                )}

                <button className="auth-submit" type="submit">
                    Login
                </button>

            </form>

            <p className="auth-footer">
                Don't have an account?
                <button
                    type="button"
                    className="auth-link-button"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </p>

        </div>

    </div>
);

}

export default Login;
