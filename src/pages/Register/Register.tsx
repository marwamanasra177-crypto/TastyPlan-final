import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();
const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            }
        );
        const data = await response.json();
        if (!response.ok) {
            setError(data.message || "Registration failed");
            return;
        }
        navigate("/login");
    } catch (error) {
        console.error(error);
        setError("Unable to connect to the server");
    }
};
return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-logo">🍲</div>
            <h1>Create Account</h1>
            <p className="auth-subtitle">
                Join TastyPlan and start planning your meals
            </p>
            <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Your name"
                        required
                    />
                </div>
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
                    Register
                </button>
            </form>
            <p className="auth-footer">
                Already have an account?
                <button
                    type="button"
                    className="auth-link-button"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </p>
        </div>
    </div>
);
}
export default Register;
