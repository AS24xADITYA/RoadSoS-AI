import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const ChatPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I am your AI emergency assistant. I can guide you through first-aid and medical emergencies. Tell me what is happening.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/ai/chat', {
        message: currentInput,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer, sources: res.data.sources }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the cloud. Stay calm. If there is bleeding, apply direct pressure with a clean cloth." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      {/* Premium Header */}
      <header className="bg-white px-4 py-4 flex items-center justify-between shadow-sm border-b border-slate-100 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="ml-2">
            <div className="flex items-center">
              <h2 className="font-extrabold text-slate-900 text-lg">RoadSoS <span className="text-red-600">AI</span></h2>
              <ShieldCheck className="text-blue-500 ml-1" size={16} />
            </div>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Verified Medical AI</p>
          </div>
        </div>
        <button className="p-2 text-slate-400">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none shadow-red-100' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="text-[15px] leading-relaxed font-medium">{msg.content}</p>
                {msg.sources && (
                  <div className={`mt-3 pt-2 border-t text-[9px] font-bold uppercase tracking-widest opacity-50 ${
                    msg.role === 'user' ? 'border-white/20' : 'border-slate-100'
                  }`}>
                    Ref: {msg.sources.join(' | ')}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-20" />
      </div>

      {/* Premium Input Area */}
      <div className="bg-white px-4 pt-4 pb-12 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSend} className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200">
          <button type="button" className="p-3 text-red-600 bg-white shadow-sm rounded-full active:scale-90 transition-all">
            <Mic size={22} strokeWidth={2.5} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent py-3 px-1 text-slate-800 focus:outline-none font-medium placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all active:scale-90 ${
              input.trim() ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send size={22} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage
