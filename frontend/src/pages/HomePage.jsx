import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Navigation, ShieldAlert, PhoneCall, AlertTriangle, ChevronRight, Activity, Zap, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const quickActions = [
    { title: 'Trauma Care', icon: <Navigation className="text-blue-600" size={26} />, color: 'bg-blue-50 dark:bg-blue-900/20', path: '/emergency' },
    { title: 'Ambulance', icon: <PhoneCall className="text-green-600" size={26} />, color: 'bg-green-50 dark:bg-green-900/20', call: '108' },
    { title: 'Incident Report', icon: <Activity className="text-purple-600" size={26} />, color: 'bg-purple-50 dark:bg-purple-900/20', path: '/chat' },
    { title: 'Police Assist', icon: <Zap className="text-amber-600" size={26} />, color: 'bg-amber-50 dark:bg-amber-900/20', call: '100' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Dynamic Header */}
      <div className="bg-white dark:bg-dark-card px-8 pt-16 pb-12 rounded-b-[3.5rem] shadow-soft dark:shadow-none border-b border-slate-100 dark:border-dark-border transition-all">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               <h2 className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Emergency Core Active</h2>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
               RoadSoS <span className="text-primary">AI</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-400 font-bold mt-2 text-sm">Hello, {user?.phone_number ? user.phone_number.slice(-4) : 'Responder'}</p>
          </div>
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-3xl border border-primary-100 dark:border-primary-900/30 text-primary transition-all shadow-sm"
          >
            <ShieldAlert size={32} strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* System Status Dashboard */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-5 text-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center gap-2 mb-2">
                 <Activity size={14} className="text-green-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Telemetry</span>
              </div>
              <div className="text-xl font-bold">Stable</div>
           </div>
           <div className="bg-primary rounded-3xl p-5 text-white shadow-xl shadow-primary/20">
              <div className="flex items-center gap-2 mb-2">
                 <Heart size={14} className="text-red-200" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-red-200/60">Guardian ID</span>
              </div>
              <div className="text-xl font-bold">Encrypted</div>
           </div>
        </div>
      </div>

      <div className="px-8 -mt-8">
        {/* Hero CTA - Voice Interaction */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/chat')}
          className="w-full bg-primary rounded-[3rem] p-10 shadow-2xl shadow-primary/30 text-white mb-10 relative overflow-hidden group border-4 border-white dark:border-slate-800"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 dark:bg-black/20 p-6 rounded-[2rem] mb-6 group-hover:bg-white/30 transition-all border border-white/20">
              <Mic size={54} strokeWidth={2.5} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">AI Voice Dispatcher</h3>
            <p className="text-primary-100 text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">Tap to start first-aid</p>
          </div>
          {/* Decorative Mesh Gradient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        </motion.button>

        {/* Grid Navigation */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          {quickActions.map((action, i) => (
            <motion.div 
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => action.call ? window.location.href = `tel:${action.call}` : navigate(action.path)}
              className="bg-white dark:bg-dark-card p-7 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-dark-border flex flex-col items-center justify-center gap-4 active:bg-slate-50 transition-all cursor-pointer group hover:border-primary/20"
            >
              <div className={`${action.color} p-4 rounded-[1.5rem] group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">{action.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Curated Health Tip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-dark-border shadow-soft flex items-start gap-5 mb-12"
        >
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-2">Life-Saving Protocol</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
              If a victim is bleeding profusely, apply firm, direct pressure with a clean cloth. Elevate the wound above heart level.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
