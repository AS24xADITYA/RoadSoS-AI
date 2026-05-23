import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, ArrowLeft, MoreVertical, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const ChatPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I am your AI Emergency Dispatcher. I can guide you through first-aid, trauma response, or triage until medical help arrives. What is the nature of your emergency?' }
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
      const res = await axios.post('http://localhost:8000/api/ai/chat', {
        message: currentInput,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer, sources: res.data.sources }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm experiencing high traffic or cloud disruption. IMMEDIATE ACTION: If there's severe bleeding, apply firm pressure with a clean cloth and elevate. Do not move the victim if a neck injury is suspected." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Premium Header */}
      <header className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between shadow-soft border-b border-slate-100 dark:border-dark-border z-[1000] sticky top-0">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft size={22} />
          </button>
          <div className="ml-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">AI Dispatch</h2>
              <div className="px-1.5 py-0.5 bg-primary/10 rounded-md">
                 <Sparkles className="text-primary" size={12} />
              </div>
            </div>
            <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest mt-0.5">Verified Medical Core</p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar pb-40">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative max-w-[85%] px-6 py-5 rounded-[2.5rem] shadow-soft ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-primary/20' 
                  : 'bg-white dark:bg-dark-card text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-dark-border'
              }`}>
                <p className="text-[15px] leading-relaxed font-bold tracking-tight">{msg.content}</p>
                {msg.sources && (
                  <div className={`mt-4 pt-3 border-t text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ${
                    msg.role === 'user' ? 'border-white/20' : 'border-slate-100 dark:border-dark-border'
                  }`}>
                    PROTOCOL: {msg.sources.join(' • ')}
                  </div>
                )}
                {/* Visual indicator for AI vs User */}
                <div className={`absolute top-0 ${msg.role === 'user' ? '-right-2' : '-left-2'} w-4 h-4 bg-inherit transform rotate-45 -z-10`} />
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
            <div className="bg-white dark:bg-dark-card px-6 py-5 rounded-[2.5rem] rounded-tl-none border border-slate-100 dark:border-dark-border flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* Premium Input Area */}
      <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl px-6 pt-6 pb-12 border-t border-slate-100 dark:border-dark-border z-[1000] fixed bottom-0 left-0 right-0">
        <form onSubmit={handleSend} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-[2.5rem] border border-slate-200 dark:border-dark-border max-w-2xl mx-auto shadow-inner">
          <button type="button" className="p-4 text-primary bg-white dark:bg-dark-card shadow-soft rounded-full active:scale-90 transition-all">
            <Mic size={24} strokeWidth={2.5} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the injury..."
            className="flex-1 bg-transparent py-4 px-2 text-slate-800 dark:text-white focus:outline-none font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className={`p-4 rounded-full transition-all active:scale-90 ${
              input.trim() ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
            }`}
          >
            <Send size={24} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage
