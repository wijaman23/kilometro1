import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function Analytics() {
  const location = useLocation()

  useEffect(() => {
    if (!window.gtag) return

    window.gtag('config', 'G-Z6TPCMYD7', {
      page_path: location.pathname + location.search,
    })
  }, [location])

  return null
}

export default Analytics