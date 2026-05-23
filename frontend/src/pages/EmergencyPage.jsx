import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { ArrowLeft, Phone, MapPin, Navigation, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import L from 'leaflet'

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

const RecenterMap = ({ coords }) => {
  const map = useMap()
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lon], 13)
  }, [coords])
  return null
}

const EmergencyPage = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        const { latitude, longitude } = pos.coords
        setUserLocation({ lat: latitude, lon: longitude })

        const res = await axios.post('/api/emergency/nearby', {
          lat: latitude,
          lon: longitude,
          types: ['hospital', 'police', 'ambulance', 'towing'],
          radius_km: 10
        })
        setContacts(res.data.contacts)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-4 py-4 flex items-center shadow-sm sticky top-0 z-[1000]">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="ml-2 font-extrabold text-slate-900 text-lg tracking-tight">Nearby Services</h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Map Container */}
        <div className="h-[40vh] w-full relative">
          <div className="absolute inset-0 z-0">
            {userLocation ? (
              <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={13} zoomControl={false} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[userLocation.lat, userLocation.lon]}>
                  <Popup>Your Location</Popup>
                </Marker>
                {contacts.map((c, i) => (
                  <Marker key={i} position={[c.lat, c.lon]}>
                    <Popup>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-xs">{c.category}</div>
                    </Popup>
                  </Marker>
                ))}
                <RecenterMap coords={userLocation} />
              </MapContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-400">
                <Compass className="animate-spin mb-2" size={32} />
                <span className="text-xs font-bold uppercase tracking-widest">Locating...</span>
              </div>
            )}
          </div>
          {/* Map Overlay Shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f8fafc] to-transparent z-10" />
        </div>

        {/* List Section */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Dispatched Results</h3>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">Live Feed</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-24 rounded-[2rem] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : contacts.length > 0 ? (
            contacts.map((contact, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      contact.category === 'Hospital' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {contact.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{contact.distance} km</span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight mb-1">{contact.name}</h4>
                  <div className="flex items-center text-[10px] text-slate-500 font-medium">
                    <MapPin size={10} className="mr-1" />
                    {contact.address.split(',')[0]}
                  </div>
                </div>
                <a 
                  href={`tel:${contact.phone}`} 
                  className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 active:scale-90 transition-all"
                >
                  <Phone size={24} strokeWidth={2.5} />
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-sm">No nearby services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmergencyPage
