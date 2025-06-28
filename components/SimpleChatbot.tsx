import { useState } from 'react'
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
const responses: { [key: string]: string } = {
  "hi": "Hello! How can I help you?",
  "hello": "Hi there! 😊",
  "help": "Sure! What do you need help with?",
  "bye": "Goodbye! Have a great day!",
  
}

export default function SimpleChatbot() {
  const [messages, setMessages] = useState<{ from: string, text: string }[]>([])
  const [input, setInput] = useState("")
    const router = useRouter();
   const { id } = router.query;
  const { list } = useSelector((state: RootState) => state.events);
const event = list.find((e) => String(e.id) === String(id));
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input }
    const botReply = responses[input.toLowerCase()] || "Sorry, I didn't understand that."

    setMessages([...messages, userMessage, { from: "bot", text: botReply }])
    setInput("")
  }

  return (
    <div className="w-[100%] m-[41px] p-4 bg-[rgb(220,239,255)] shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Chatbot</h2>
      <div className="h-[8rem] overflow-y-auto border p-2 mb-4 border-white" >
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-${msg.from === "bot" ? "blue" : "green"}-700 mb-1`}>
            <strong>{msg.from === "bot" ? "Bot" : "You"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-[rgb(39,66,109)]  text-white px-4 rounded-r" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}
