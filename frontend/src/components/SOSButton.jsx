import React, { useState } from 'react'
import { AlertCircle, CheckCircle, ShieldAlert, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const SOSButton = () => {
  const [status, setStatus] = useState('idle') // idle, confirming, sending, success, error

  const handleSOS = async () => {
    setStatus('sending')
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      })

      await axios.post('http://localhost:8000/api/sos/send', {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        contact_ids: ['emergency_services']
      })

      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <>
      <AnimatePresence>
        {status === 'confirming' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[5000] flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[3rem] p-10 text-center shadow-premium relative border border-white/20"
            >
              <button 
                onClick={() => setStatus('idle')}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary-100 dark:border-primary-900/30">
                <ShieldAlert className="text-primary-600" size={48} strokeWidth={2.5} />
              </div>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Critical SOS</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold leading-relaxed text-sm uppercase tracking-wide">
                Broadcasting your live location to 5 nearest trauma centers.
              </p>

              <div className="flex flex-col gap-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSOS}
                  className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-sm tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all uppercase"
                >
                  Confirm Broadcast
                </motion.button>
                <button 
                  onClick={() => setStatus('idle')}
                  className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[1.5rem] font-black text-sm tracking-[0.2em] uppercase transition-all"
                >
                  Stand Down
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-28 right-8 z-[1000]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => status === 'idle' && setStatus('confirming')}
          className={`w-20 h-20 rounded-[2rem] shadow-premium flex items-center justify-center text-white font-black text-xs relative overflow-hidden transition-all duration-500 border-4 border-white dark:border-slate-800 ${
            status === 'sending' ? 'bg-amber-500' : 
            status === 'success' ? 'bg-green-500' :
            status === 'error' ? 'bg-slate-900' : 'bg-primary'
          }`}
        >
          {status === 'idle' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white rounded-full"
              />
              <span className="relative z-10 tracking-[0.2em] font-black text-base">SOS</span>
            </>
          )}
          {status === 'sending' && <AlertCircle className="animate-spin" size={32} />}
          {status === 'success' && <CheckCircle size={32} />}
          {status === 'error' && <span className="text-[10px]">RETRY</span>}
        </motion.button>
      </div>
    </>
  )
}

export default SOSButton
