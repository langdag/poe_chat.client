import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Receive passed state from navigate("/chat", { state: { receiverId, receiverName } })
  const receiverId = location.state?.receiverId;
  const receiverName = location.state?.receiverName || "User";
  const myUserId = parseInt(localStorage.getItem("userID"), 10);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !receiverId) {
      navigate("/dashboard");
      return;
    }

    // Initialize WebSocket
    const ws = new WebSocket(`ws://localhost:8080/chat?token=${encodeURIComponent(token)}`);
    
    ws.onopen = () => {
      console.log("Connected to Chat WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // We expect data to have sender_id, receiver_id, message
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token, receiverId, navigate]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    const payload = {
      sender_id: myUserId,
      receiver_id: receiverId,
      message: newMessage,
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, payload]);
    
    socket.send(JSON.stringify(payload));
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          &larr; Back
        </button>
        <h2>Chatting with {receiverName}</h2>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMine = msg.sender_id === myUserId;
          return (
            <div key={index} className={`chat-message-wrapper ${isMine ? "mine" : "theirs"}`}>
              <div className={`chat-bubble ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">Send</button>
      </form>
    </div>
  );
}

export default Chat;
