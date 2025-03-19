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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);

        // Show modal if Telegram or TikTok isn't connected
        if (!data.telegram_connected || !data.tiktok_connected) {
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
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <p>Email: {user?.email}</p>
      <p>Telegram Connected: {user?.telegram_connected ? "Yes" : "No"}</p>
      <p>TikTok Connected: {user?.tiktok_connected ? "Yes" : "No"}</p>

      {showModal && (
        <div className="modal">
          <h3>Connect Your Accounts</h3>
          <p>Unlock features like chat sync and analytics.</p>
          <button onClick={() => handleConnect("telegram")}>Connect Telegram</button>
          <button onClick={() => handleConnect("tiktok")}>Connect TikTok</button>
          <button onClick={() => setShowModal(false)}>Skip for Now</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;