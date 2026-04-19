import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username,
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(Object.values(errorData)[0]);
        setError(Object.values(errorData)[0]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      fetchUser().then(() => {
        setIsLoading(false);
        navigate("/dashboard");
      });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 text-white font-medium rounded-lg transition ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Register;
