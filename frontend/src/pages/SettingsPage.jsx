import React from 'react'
import { ArrowLeft, Database, Globe, Bell, Shield, ChevronRight, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SettingsPage = () => {
  const navigate = useNavigate()

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: <Globe size={20} />, color: 'bg-blue-50 text-blue-600', title: 'Language', value: 'English (US)', desc: 'Voice input and output language' },
        { icon: <Database size={20} />, color: 'bg-amber-50 text-amber-600', title: 'Offline Cache', value: 'Maharashtra', desc: 'Pre-cached emergency data' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: <Shield size={20} />, color: 'bg-green-50 text-green-600', title: 'Privacy Mode', value: 'Local Only', desc: 'How your data is handled' },
        { icon: <Bell size={20} />, color: 'bg-red-50 text-red-600', title: 'Alerts', value: 'Enabled', desc: 'Accident notification system' },
      ]
    }
  ]

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="ml-2 font-extrabold text-slate-900 text-lg tracking-tight">System Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <User size={32} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Test User</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Responder</p>
          </div>
        </div>

        {settingsGroups.map((group, gi) => (
          <div key={gi} className="mb-8">
            <h3 className="ml-4 mb-3 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">{group.title}</h3>
            <div className="space-y-3">
              {group.items.map((item, i) => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  key={i} 
                  className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className={`${item.color} p-3 rounded-2xl`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-500">{item.value}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full py-5 bg-white text-red-600 font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-sm border border-red-100 active:bg-red-50 transition-colors">
          Clear All Local Data
        </button>
        
        <div className="text-center mt-12 mb-8">
          <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
            RoadSoS Core Engine v1.0.0
          </div>
          <p className="text-slate-300 text-[10px] font-medium leading-relaxed">
            Built for High-Stakes Roadside Emergency Response.<br/>
            © 2026 RoadSoS Global.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
