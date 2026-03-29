import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [churchSettings, setChurchSettings] = useState(null)
  const [homeData, setHomeData] = useState(null)
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/church/home').then(r => r.json()),
      fetch('/api/carousels/').then(r => r.json())
    ]).then(([homeJson, carouselJson]) => {
      if (homeJson.success) {
        setHomeData(homeJson.data)
        setChurchSettings(homeJson.data.church_settings)
      }
      if (carouselJson.success) {
        setCarousels(carouselJson.data.carousels || [])
      }
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppContext.Provider value={{ churchSettings, homeData, carousels, loading }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
