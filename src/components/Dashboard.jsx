import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userID");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.ok) {
        const fetchedUserData = await response.json();
        setUser(fetchedUserData.data);

        // Show modal if Telegram or TikTok isn't connected
        if (!fetchedUserData.data.telegram_connected || !fetchedUserData.data.tiktok_connected) {
          setShowModal(true);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // const handleConnect = (platform) => {
  //   const authUrls = {
  //     telegram: "https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&scope=contacts",
  //     tiktok: "https://www.tiktok.com/auth/authorize?client_key=YOUR_CLIENT_KEY&scope=user.info.basic",
  //   };
  //   window.location.href = authUrls[platform];
  // };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.username}!</h2>
      </div>
      <div className="dashboard-info">
        <p>Email: <span className="info-value">{user?.email}</span></p>
        <p>Telegram Connected: <span className={`connection-status ${user?.telegram_connected ? 'connected' : 'disconnected'}`}>{user?.telegram_connected ? "Yes" : "No"}</span>
          {!user?.telegram_connected && (
            <button onClick={() => handleConnect("telegram")} className="connect-button telegram-inline">Connect</button>
          )}
        </p>
        <p>TikTok Connected: <span className={`connection-status ${user?.tiktok_connected ? 'connected' : 'disconnected'}`}>{user?.tiktok_connected ? "Yes" : "No"}</span>
          {!user?.tiktok_connected && (
            <button onClick={() => handleConnect("tiktok")} className="connect-button tiktok-inline">Connect</button>
          )}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;