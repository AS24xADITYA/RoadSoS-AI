import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    // Mock API call
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 800);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(phone, otp);
      navigate('/');
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-dark-card rounded-[2.5rem] p-10 shadow-premium border border-white dark:border-dark-border"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">RoadSoS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center">Your life-saving companion on the road.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Get OTP'}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Verify OTP (123456)</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-center text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-slate-500 dark:text-slate-400 text-sm font-medium"
            >
              Change phone number
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
