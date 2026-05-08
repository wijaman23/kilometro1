import { Link } from 'react-router-dom'

import logo from '../assets/LOGO_2_BLANCO.svg'

function Home() {
  return (
    <main className="home-page">
      <div className="hero-background"></div>

      <nav className="hero-navbar">
        <Link to="/" className="hero-logo-link">
          <img src={logo} alt="Kilómetro 1" className="hero-logo-img" />
        </Link>

        <Link to="/videos" className="hero-videos-btn">
          ▶ Ver vídeos
        </Link>
      </nav>

      <section className="hero-content">
        <div className="hero-text">
          <p className="hero-subtitle">Comunidad runner</p>

          <h1 className="hero-title">
            <span>Somos</span>
            <span>Kilometro1</span>
          </h1>

          <p className="hero-description">
            Corredores de todo el mundo persiguiendo la{' '}
            <strong>EXCELENCIA</strong> también en el <strong>RUNNING</strong>.
          </p>

          <div className="hero-actions">
            <a
              href="https://www.instagram.com/equipokm1/?hl=es"
              target="_blank"
              rel="noreferrer"
              className="hero-community-btn"
            >
              Únete a la comunidad
            </a>

            <a
              href="https://club.crownsportnutrition.com/es/iniciar-sesion?back=my-account"
              target="_blank"
              rel="noreferrer"
              className="hero-partner-link"
            >
              <span>Partner nutricional</span>
              <strong>Crown Sport Nutrition</strong>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home