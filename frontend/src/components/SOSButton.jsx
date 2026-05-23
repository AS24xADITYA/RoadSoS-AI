import React, { useState } from 'react'
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react'
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

      await axios.post('/api/sos/send', {
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <ShieldAlert className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Emergency SOS</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                This will share your live location with the nearest emergency services. Are you sure?
              </p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={handleSOS}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
                >
                  YES, BROADCAST SOS
                </button>
                <button 
                  onClick={() => setStatus('idle')}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 right-6 z-[90]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => status === 'idle' && setStatus('confirming')}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white font-black text-xs relative overflow-hidden transition-colors duration-500 ${
            status === 'sending' ? 'bg-amber-500' : 
            status === 'success' ? 'bg-green-500' :
            status === 'error' ? 'bg-slate-900' : 'bg-red-600'
          }`}
        >
          {status === 'idle' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-red-400 rounded-full"
              />
              <span className="relative z-10 tracking-widest">SOS</span>
            </>
          )}
          {status === 'sending' && <AlertCircle className="animate-spin" size={28} />}
          {status === 'success' && <CheckCircle size={28} />}
          {status === 'error' && <span>ERROR</span>}
        </motion.button>
      </div>
    </>
  )
}

export default SOSButton
