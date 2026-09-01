import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>

        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>

            <div>
                <label>Name</label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    required
                />
            </div>

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
                Register
            </button>

        </form>

        <p>
            Already have an account?
            <button
                type="button"
                onClick={() => navigate("/login")}
            >
                Login
            </button>
        </p>

    </div>
);


}

export default Register;
