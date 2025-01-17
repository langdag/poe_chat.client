import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
  
    const handleLogin = () => {
      // Simulate login logic and redirect
      navigate('/connect');
    };
  
    return (
      <div className="App">
        <h2>Login Page</h2>
        <button onClick={handleLogin} className="btn">Login</button>
      </div>
    );
}

  export default Login;