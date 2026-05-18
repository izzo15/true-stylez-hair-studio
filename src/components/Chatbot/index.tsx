'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "What kind of cut are you looking for today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<{ id: string; name: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(setServices)
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
        }),
      })

      if (!res.ok) throw new Error('Chatbot error')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'No response.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Try again in a sec!" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
       <button
         onClick={() => {
           window.plausible?.('track', 'Chatbot Open');
           setIsOpen(true);
         }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
         aria-label="Open chat"
       >
        <span className="text-2xl">✂️</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 glass rounded-2xl overflow-hidden z-40 flex flex-col max-h-[70vh]"
          >
            <div className="bg-accent p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">The Apprentice</h3>
                <p className="text-sm opacity-80">Your barber assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-80"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3 flex-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm ${
                    msg.role === 'assistant' ? 'text-gray-200 bg-primary-800/50 rounded-xl p-2 mr-8' : 'text-white bg-accent/70 rounded-xl p-2 ml-auto max-w-[80%]'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="text-sm text-gray-400 italic">Typing…</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question…"
                className="flex-1 bg-primary-800 rounded px-3 py-2 text-sm border border-gray-700 focus:border-accent outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="px-3 text-accent font-bold hover:opacity-80"
                aria-label="Send"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
