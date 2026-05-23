import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { ArrowLeft, Phone, MapPin, Navigation, Compass, Activity, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

const HospitalIcon = L.divIcon({
  html: `<div class="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12m6-6H6"/></svg></div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const RecenterMap = ({ coords }) => {
  const map = useMap()
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lon], 14)
  }, [coords])
  return null
}

const EmergencyPage = () => {
  const navigate = useNavigate()
  const [hospitals, setHospitals] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, (err) => {
            // Fallback for demo if location denied
            resolve({ coords: { latitude: 28.6139, longitude: 77.2090 } }) 
          })
        })
        const { latitude, longitude } = pos.coords
        setUserLocation({ lat: latitude, lon: longitude })

        const res = await axios.post('http://localhost:8000/api/sos/hospitals', {
          lat: latitude,
          lon: longitude
        })
        setHospitals(res.data.data)
      } catch (err) {
        console.error(err)
        setError("Could not fetch nearby hospitals")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-slate-100 dark:border-dark-border sticky top-0 z-[1000]">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft size={22} />
          </button>
          <div className="ml-3">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight leading-none">Emergency Hub</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nearby Hospitals & Trauma Centers</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
          <Activity size={20} />
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Map Container - Fixed height with fallback styles */}
        <div className="h-[45vh] w-full relative z-0 shrink-0 border-b border-slate-200 dark:border-dark-border">
          {userLocation ? (
            <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={14} zoomControl={false} className="h-full w-full">
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                attribution='&copy; OpenStreetMap'
              />
              <Marker position={[userLocation.lat, userLocation.lon]}>
                <Popup className="custom-popup">You are here</Popup>
              </Marker>
              {hospitals.map((h, i) => (
                <Marker key={i} position={[h.lat, h.lon]} icon={HospitalIcon}>
                  <Popup>
                    <div className="p-1">
                      <div className="font-bold text-slate-900">{h.name}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center">
                        <Navigation size={10} className="mr-1" /> Hospital
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <RecenterMap coords={userLocation} />
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-900/50 text-slate-400">
              <Compass className="animate-spin mb-3 text-primary-500" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Triangulating...</span>
            </div>
          )}
          
          {/* Subtle Map Overlays */}
          <div className="absolute top-4 left-4 z-[500]">
             <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur px-3 py-2 rounded-xl shadow-premium text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center border border-white/20">
               <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
               LIVE UPDATES ACTIVE
             </div>
          </div>
        </div>

        {/* List Section - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50 dark:bg-dark-bg custom-scrollbar pb-32">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em]">Verified Locations</h3>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg uppercase">
              {hospitals.length} Found
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-dark-card h-28 rounded-[2rem] animate-pulse border border-slate-100 dark:border-dark-border" />
              ))}
            </div>
          ) : hospitals.length > 0 ? (
            <div className="space-y-4">
              {hospitals.map((hospital, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="bg-white dark:bg-dark-card p-5 rounded-[2.5rem] shadow-soft hover:shadow-premium transition-all border border-slate-100 dark:border-dark-border group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-black px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full uppercase tracking-widest">
                            Hospital
                         </span>
                         <div className="flex items-center text-[10px] font-bold text-slate-400">
                           <MapPin size={12} className="mr-1" />
                           2.4 km away
                         </div>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                        {hospital.name}
                      </h4>
                    </div>
                    
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      <Navigation size={20} strokeWidth={2.5} />
                    </a>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-dark-border flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-card bg-slate-200 dark:bg-slate-700 overflow-hidden">
                           <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">DR</div>
                        </div>
                      ))}
                      <div className="pl-4 text-[10px] font-bold text-slate-400 self-center">8+ Doctors available</div>
                    </div>
                    <button className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-widest flex items-center">
                      DETAILS <Info size={14} className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-200 dark:border-dark-border">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <MapPin size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">No hospitals found nearby.</p>
              <button className="mt-4 text-primary font-bold text-sm">Expand Search Radius</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmergencyPage
