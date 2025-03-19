import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(null);

      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(Object.values(errorData)[0]);
          setError(Object.values(errorData)[0]);
          return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);

        fetchUser().then(() => {
          navigate("/dashboard");
        });
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await fetch("http://localhost:8080/me", {
        headers: { Authorization: `${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userID", userData.data.id);
      }
    };

    return (
      <div className="App">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
}

  export default Login;