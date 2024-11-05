"use client";
import { useState, useEffect } from "react";

let webSocket: WebSocket;
if (typeof window !== "undefined") {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  webSocket = new WebSocket(`${protocol}//localhost:8000/ws/door-status`);
  setInterval(() => {
    if (webSocket.readyState !== webSocket.OPEN) {
      webSocket = new WebSocket(`${protocol}//localhost:8000/ws/door-status`);
      return;
    }

    webSocket.send(`{"event":"ping"}`);
  }, 29000);
}

const Index = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;
      console.log("THIS IS THE DATA RECEIVED FROM SERVER", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
  }, []);

  const sendMessage = () => {
    webSocket.send(newMessage);
    setNewMessage("");
  };

  return (
    <div>
      <h1>Home Link Dashboard</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        className="border border-gray-400 rounded p-2"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Index;
