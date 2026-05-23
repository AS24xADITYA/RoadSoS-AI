import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, ShieldAlert, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'HUB', path: '/' },
    { icon: MessageSquare, label: 'AI ASSIST', path: '/chat' },
    { icon: ShieldAlert, label: 'TRACKER', path: '/emergency' },
    { icon: Settings, label: 'SYSTEM', path: '/settings' },
  ]

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-lg">
      <nav className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 px-8 py-4 rounded-[2.5rem] flex justify-between items-center shadow-premium transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center group"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`transition-all duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <item.icon size={26} strokeWidth={isActive ? 3 : 2} />
              </motion.div>
              
              <span className={`text-[9px] font-black mt-1 transition-all duration-300 uppercase tracking-widest ${
                isActive ? 'opacity-100 text-primary' : 'opacity-0 scale-50'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNav
