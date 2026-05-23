import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Navigation, ShieldAlert, PhoneCall, AlertTriangle, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Header Section */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-slate-400 text-sm font-medium tracking-wide">EMERGENCY ASSISTANT</h2>
            <h1 className="text-3xl font-extrabold text-slate-900">RoadSoS <span className="text-red-600">AI</span></h1>
          </div>
          <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
            <ShieldAlert className="text-red-600" size={28} />
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 rounded-3xl p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
          <span className="text-xs text-slate-400">GPS: Active</span>
        </div>
      </div>

      <div className="px-6 -mt-6">
        {/* Main Action - Voice */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/chat')}
          className="w-full bg-red-600 rounded-[2.5rem] p-8 shadow-2xl shadow-red-200 text-white mb-8 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-5 rounded-full mb-4 group-hover:bg-white/30 transition-colors">
              <Mic size={48} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Voice First-Aid</h3>
            <p className="text-red-100 text-sm opacity-80 mt-1">"Help, there is an accident!"</p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </motion.button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div 
            onClick={() => navigate('/emergency')}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-3 active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="bg-blue-50 p-3 rounded-2xl">
              <Navigation className="text-blue-600" size={28} />
            </div>
            <span className="font-bold text-slate-800">Hospital</span>
          </div>
          
          <div 
            onClick={() => window.location.href = 'tel:108'}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-3 active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="bg-green-50 p-3 rounded-2xl">
              <PhoneCall className="text-green-600" size={28} />
            </div>
            <span className="font-bold text-slate-800">Call 108</span>
          </div>
        </div>

        {/* Safety Tip of the Day */}
        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start space-x-4">
          <div className="bg-amber-200 p-2 rounded-xl">
            <AlertTriangle className="text-amber-700" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Pro Tip: Spinal Safety</h4>
            <p className="text-amber-800/70 text-xs mt-1 leading-relaxed">
              Never remove a helmet from an unconscious victim unless they aren't breathing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
