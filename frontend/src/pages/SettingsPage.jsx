import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Phone, MapPin, Droplets, Activity, Plus, Trash2, Moon, Sun, LogOut, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout, getProfile, updateProfile } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  
  const [profile, setProfile] = useState({
    full_name: '',
    address: '',
    blood_group: '',
    medical_conditions: '',
    emergency_contacts: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'settings'

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile()
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          address: data.address || '',
          blood_group: data.blood_group || '',
          medical_conditions: data.medical_conditions || '',
          emergency_contacts: data.emergency_contacts || []
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(profile)
      // Show success (could add a toast here)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const addContact = () => {
    setProfile({
      ...profile,
      emergency_contacts: [...profile.emergency_contacts, { name: '', phone: '', relation: '' }]
    })
  }

  const removeContact = (index) => {
    const updated = [...profile.emergency_contacts]
    updated.splice(index, 1)
    setProfile({ ...profile, emergency_contacts: updated })
  }

  const updateContact = (index, field, value) => {
    const updated = [...profile.emergency_contacts]
    updated[index][field] = value
    setProfile({ ...profile, emergency_contacts: updated })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-slate-100 dark:border-dark-border sticky top-0 z-[1000]">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft size={22} />
          </button>
          <div className="ml-3">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight leading-none">Settings</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personalize your experience</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? '...' : <><Save size={16} /> SAVE</>}
        </button>
      </header>

      <div className="p-6 max-w-2xl mx-auto w-full">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-dark-border flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] flex items-center justify-center text-primary-600 ring-4 ring-white dark:ring-slate-800 shadow-sm">
            <User size={36} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">{profile.full_name || 'Guest User'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Member • {user?.phone_number}</p>
            <div className="flex gap-2 mt-3">
              <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight">Active Plan</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-dark-card text-primary shadow-sm' : 'text-slate-500'}`}
          >
            User Profile
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-dark-card text-primary shadow-sm' : 'text-slate-500'}`}
          >
            App Config
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Personal Info */}
              <div className="space-y-4">
                <h4 className="ml-4 font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em]">Medical Identity</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-slate-100 dark:border-dark-border shadow-soft">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                        <Droplets size={12} className="text-red-500" /> Blood Group
                      </label>
                      <input 
                        className="bg-transparent w-full font-bold text-slate-900 dark:text-white outline-none"
                        value={profile.blood_group}
                        onChange={e => setProfile({...profile, blood_group: e.target.value})}
                        placeholder="O+"
                      />
                   </div>
                   <div className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-slate-100 dark:border-dark-border shadow-soft">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                        <Activity size={12} className="text-blue-500" /> Conditions
                      </label>
                      <input 
                        className="bg-transparent w-full font-bold text-slate-900 dark:text-white outline-none"
                        value={profile.medical_conditions}
                        onChange={e => setProfile({...profile, medical_conditions: e.target.value})}
                        placeholder="None"
                      />
                   </div>
                </div>
                <div className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-dark-border shadow-soft">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <User size={12} className="text-primary-500" /> Full Name
                  </label>
                  <input 
                    className="bg-transparent w-full font-bold text-slate-900 dark:text-white text-lg outline-none"
                    value={profile.full_name}
                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-dark-border shadow-soft">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <MapPin size={12} className="text-amber-500" /> Home Address
                  </label>
                  <textarea 
                    rows={2}
                    className="bg-transparent w-full font-bold text-slate-900 dark:text-white outline-none resize-none"
                    value={profile.address}
                    onChange={e => setProfile({...profile, address: e.target.value})}
                    placeholder="123 Emergency Lane..."
                  />
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between ml-4">
                   <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em]">Trusted Responders</h4>
                   <button 
                    onClick={addContact}
                    className="p-2 bg-primary/10 text-primary-600 rounded-lg hover:bg-primary/20 transition-all"
                   >
                     <Plus size={18} />
                   </button>
                </div>
                {profile.emergency_contacts.length === 0 && (
                  <div className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-dark-border text-center">
                    <p className="text-slate-400 text-sm font-bold">Add emergency contacts who will be notified in case of an accident.</p>
                  </div>
                )}
                <div className="space-y-3">
                  {profile.emergency_contacts.map((contact, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index} 
                      className="bg-white dark:bg-dark-card p-5 rounded-[2rem] shadow-soft border border-slate-100 dark:border-dark-border"
                    >
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                           {index + 1}
                         </div>
                         <button onClick={() => removeContact(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                           <Trash2 size={18} />
                         </button>
                      </div>
                      <div className="space-y-3">
                        <input 
                          className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl font-bold text-slate-900 dark:text-white outline-none text-sm"
                          value={contact.name}
                          onChange={e => updateContact(index, 'name', e.target.value)}
                          placeholder="Contact Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl font-bold text-slate-900 dark:text-white outline-none text-sm"
                            value={contact.phone}
                            onChange={e => updateContact(index, 'phone', e.target.value)}
                            placeholder="Phone Number"
                          />
                          <input 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl font-bold text-slate-900 dark:text-white outline-none text-sm"
                            value={contact.relation}
                            onChange={e => updateContact(index, 'relation', e.target.value)}
                            placeholder="Relation"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h4 className="ml-4 font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em]">Appearance</h4>
              <div 
                onClick={toggleTheme}
                className="bg-white dark:bg-dark-card p-5 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-dark-border flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-indigo-900/20 text-indigo-400' : 'bg-amber-50 text-amber-500'}`}>
                      {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                   </div>
                   <div>
                     <h5 className="font-extrabold text-slate-900 dark:text-white">Dark Mode</h5>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {isDarkMode ? 'Night Vision Active' : 'Light Mode Active'}
                     </p>
                   </div>
                </div>
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}`}>
                   <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <h4 className="ml-4 pt-6 font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em]">Account Action</h4>
              <button 
                onClick={logout}
                className="w-full bg-white dark:bg-dark-card p-5 rounded-[2.5rem] shadow-soft border border-red-100 dark:border-red-900/20 flex items-center justify-between group hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                      <LogOut size={24} />
                   </div>
                   <div className="text-left">
                     <h5 className="font-extrabold text-red-600">Secure Logout</h5>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">End active session</p>
                   </div>
                </div>
              </button>

              <div className="text-center mt-12">
                <div className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  RoadSoS Core Engine v2.5.0
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  © 2026 RoadSoS Intelligence Systems.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SettingsPage
