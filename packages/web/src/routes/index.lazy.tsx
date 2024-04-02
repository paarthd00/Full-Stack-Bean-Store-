import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})
import { useState, useEffect } from 'react'

export default function Index() {
  const [message, setMessage] = useState("Hi 👋");

  useEffect(() => {
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
      <div className="bg-[#fff] px-3">
        <button onClick={onClick}>
          Message is "<i>{message}</i>"
        </button>
      </div>
    </div>
  );
}


