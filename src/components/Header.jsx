import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/LOGO_2_BLANCO.svg'
import '../styles/header.css'

function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = path => location.pathname === path
  const closeMenu = () => setMenuOpen(false)

  const MobileMenu = (
    <>
      <button
        className={`mobile-menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-label="Cerrar menú"
      />

      <div className={`mobile-menu-panel ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          onClick={closeMenu}
          className={isActive('/') ? 'app-header-link active' : 'app-header-link'}
        >
          Inicio
        </Link>

        <Link
          to="/videos"
          onClick={closeMenu}
          className={isActive('/videos') ? 'app-header-link active' : 'app-header-link'}
        >
          Vídeos
        </Link>

        <Link
          to="/competiciones"
          onClick={closeMenu}
          className={
            isActive('/competiciones')
              ? 'app-header-link active'
              : 'app-header-link'
          }
        >
          Competiciones
        </Link>
      </div>
    </>
  )

  return (
    <>
      <nav className="app-header">
        <Link to="/" className="app-header-logo" onClick={closeMenu}>
          <img src={logo} alt="Kilómetro 1" />
        </Link>

        <button
          type="button"
          className={`app-header-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="app-header-menu">
          <Link
            to="/"
            className={isActive('/') ? 'app-header-link active' : 'app-header-link'}
          >
            Inicio
          </Link>

          <Link
            to="/videos"
            className={isActive('/videos') ? 'app-header-link active' : 'app-header-link'}
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

      {createPortal(MobileMenu, document.body)}
    </>
  )
}

export default Header