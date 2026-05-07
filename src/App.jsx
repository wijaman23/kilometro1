import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

import Home from './pages/Home'
import Videos from './pages/Videos'

import './styles/global.css'
import './styles/home.css'
import './styles/videos.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </BrowserRouter>

      <Analytics />
    </>
  )
}

export default App