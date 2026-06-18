import { useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  async function sendMessage() {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  }

  async function getMessages() {
    const res = await fetch(`${API_BASE_URL}/api/messages`);
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>Kubernetes Fullstack Exercise</h1>

      <p>
        Frontend calls HTTP server. HTTP server stores and reads messages from
        Redis.
      </p>

      <p>
        API URL: <code>{API_BASE_URL}</code>
      </p>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
        style={{
          padding: 8,
          width: 300,
          marginRight: 8,
        }}
      />

      <button onClick={sendMessage}>Send Message</button>

      <button onClick={getMessages} style={{ marginLeft: 8 }}>
        Get Messages
      </button>

      <pre
        style={{
          marginTop: 24,
          background: "#eee",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </pre>
    </main>
  );
}

export default App;
