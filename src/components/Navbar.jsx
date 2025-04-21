import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" className="nav-link">Home</Link>
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        </>
      ) : (
        <>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;