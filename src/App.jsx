import React, { useState, useEffect } from "react";

const SOCKET_URL = "ws://127.0.0.1:6969";

const Chat = () => {
  const [user, setUser] = useState("Tarzan");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(new WebSocket(SOCKET_URL));

  const submitMessage = (usr, msg) => {
    const message = { user: usr, message: msg };
    ws.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  };

  function blobToString(b) {
    var u, x;
    console.log(b);
    u = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open("GET", u, false); // although sync, you're not fetching over internet
    x.send();
    URL.revokeObjectURL(u);
    return x.responseText;
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(blobToString(e.data));
      setMessages([message, ...messages]);
    };

    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(SOCKET_URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  return (
    <div>
      <label htmlFor="user">
        Name :
        <input
          type="text"
          id="user"
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </label>

      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <b>{message.user}</b>: <em>{message.message}</em>
          </li>
        ))}
      </ul>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage(user, message);
          setMessage([]);
        }}
      >
        <input
          type="text"
          placeholder={"Type a message ..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value={"Send"} />
      </form>
    </div>
  );
};

export default Chat;
