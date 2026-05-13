import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/LOGO_2_BLANCO.svg'
import '../styles/header.css'

function Header() {
  const location = useLocation()

  const isActive = path => location.pathname === path

  return (
    <nav className="app-header">
      <Link to="/" className="app-header-logo">
        <img src={logo} alt="Kilómetro 1" />
      </Link>

      <div className="app-header-menu">
        <Link
          to="/"
          className={isActive('/') ? 'app-header-link active' : 'app-header-link'}
        >
          Inicio
        </Link>

        <Link
          to="/videos"
          className={
            isActive('/videos') ? 'app-header-link active' : 'app-header-link'
          }
        >
          Vídeos
        </Link>

        <Link
          to="/competiciones"
          className={
            isActive('/competiciones')
              ? 'app-header-link active'
              : 'app-header-link'
          }
        >
          Competiciones
        </Link>
      </div>
    </nav>
  )
}

export default Header