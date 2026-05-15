import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Videos from './pages/Videos'
import Competitions from './pages/Competitions'
import './styles/global.css'
import './styles/home.css'
import './styles/videos.css'
import './styles/competitions.css'
import MeetupPopup from './components/MeetupPopup'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/competiciones" element={<Competitions />} />
      </Routes>

      <MeetupPopup />
    </>
  )
}

export default App
