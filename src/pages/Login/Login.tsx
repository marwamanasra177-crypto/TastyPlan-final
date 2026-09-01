import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/Context/AuthContext";

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
    <div>

        <h1>Login</h1>

        <form onSubmit={handleLogin}>

            <div>
                <label>Email</label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />
            </div>

            <div>
                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />
            </div>

            {error && (
                <p>{error}</p>
            )}

            <button type="submit">
                Login
            </button>

        </form>

        <p>
            Don't have an account?
            <button
                type="button"
                onClick={() => navigate("/register")}
            >
                Register
            </button>
        </p>

    </div>
);

}

export default Login;
