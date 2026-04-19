import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndContacts = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userID");
      if (!token) {
        navigate("/");
        return;
      }

      // Fetch user profile
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.ok) {
        const fetchedUserData = await response.json();
        setUser(fetchedUserData.data);

        if (!fetchedUserData.data.telegram_connected || !fetchedUserData.data.tiktok_connected) {
          setShowModal(true);
        }
      }

      // Fetch contacts
      const contactsResponse = await fetch(`http://localhost:8080/users/contacts`, {
        headers: { Authorization: `${token}` },
      });

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.data || []);
      }
    };

    fetchUserAndContacts();
  }, [navigate]);

  const handleConnect = async (platform) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userID");
    if (!token || !userId) return;

    try {
      const response = await fetch(`http://localhost:8080/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          connection_type: platform,
        }),
      });

      if (response.ok) {
        // Fetch contacts automatically
        const contactsResponse = await fetch(`http://localhost:8080/users/contacts`, {
          headers: { Authorization: `${token}` },
        });
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          setContacts(contactsData.data || []);
        }
        setShowModal(false);
      }
    } catch (err) {
      console.error("Failed to connect", err);
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', color: '#fff' }}>
      <div style={{ flex: 1 }}>
        <h2>Welcome, {user?.username}!</h2>
        <p>Email: {user?.email}</p>
        <p>Telegram Connected: {user?.telegram_connected ? "✅ Yes" : "❌ No"}</p>
        <p>TikTok Connected: {user?.tiktok_connected ? "✅ Yes" : "❌ No"}</p>

        {showModal && (
          <div className="modal" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <h3>Connect Your Accounts</h3>
            <p>Unlock features like chat sync and analytics.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => handleConnect("telegram")}
                style={{ padding: '0.5rem 1rem', background: '#0088cc', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Connect Telegram
              </button>
              <button
                onClick={() => handleConnect("tiktok")}
                style={{ padding: '0.5rem 1rem', background: '#000000', color: '#fff', border: '1px solid #fff', borderRadius: '8px', cursor: 'pointer' }}
              >
                Connect TikTok
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#ccc', border: 'none', cursor: 'pointer' }}
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3>Your Contacts</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Users with active social connections
        </p>

        {contacts.length === 0 ? (
          <p style={{ color: '#aaa' }}>No contacts found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {contacts.map(contact => (
              <li
                key={contact.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div>
                  <strong>{contact.username}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{contact.email}</div>
                </div>
                <button
                  onClick={() => navigate("/chat", { state: { receiverId: contact.id, receiverName: contact.username } })}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Chat
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;