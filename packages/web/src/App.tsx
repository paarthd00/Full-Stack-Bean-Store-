import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [message, setMessage] = useState("Hi 👋");

  useEffect(() => {
    // Post request to chat endpoint
    (async () => {
      await fetch(import.meta.env.VITE_APP_API_URL+ "/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hi' }),
      })
      .then(async (response) => {
        const data = await response.json()
        console.log(data)
      }
      ) 

    })()


  }, []);

  function onClick() {
    fetch(import.meta.env.VITE_APP_API_URL)
      .then((response) => response.text())
      .then(setMessage);
  }

  return (
    <div className="App">
      <div className="card">
        <button onClick={onClick}>
          Message is "<i>{message}</i>"
        </button>
      </div>
    </div>
  );
}

export default App
