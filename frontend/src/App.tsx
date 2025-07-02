import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (e) => {
      console.log('Received from server:', e.data);
      setMessages((prev) => [...prev, `Server: ${e.data}`]);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected.');
      return;
    }

    const input = inputRef.current;
    if (input && input.value.trim()) {
      socket.send(input.value.trim());
      setMessages((prev) => [...prev, `You: ${input.value.trim()}`]);
      input.value = '';
    }
  };

  return (
    <div className="App p-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message"
        className="bg-amber-50 text-black p-2 rounded border"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>

      <div className="mt-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm bg-gray-100 text-black p-2 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
