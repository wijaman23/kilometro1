import { Link } from 'react-router-dom'
import trainer from '../assets/trainer.png'
import logo from '../assets/LOGO_2_BLANCO.svg'

function Home() {
  return (
    <main className="home-page">
      <nav className="top-nav">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Kilómetro 1" className="logo-img" />
        </Link>

        <Link to="/videos" className="top-video-btn">
          ▶ Ver vídeos
        </Link>
      </nav>

      <section className="hero">
        <img src={trainer} alt="Entrenadores Kilómetro 1" className="hero-img" />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="eyebrow">Comunidad runner</p>

          <h1>
            Somos <br />
            <span>Kilometro1</span>
          </h1>

          <p className="hero-text">
            Corredores de todo el mundo persiguiendo la{' '}
            <strong>EXCELENCIA</strong> también en el <strong>RUNNING</strong>.
          </p>

          <div className="hero-actions">
            <a
              href="https://www.instagram.com/equipokm1/?hl=es"
              target="_blank"
              rel="noreferrer"
              className="btn-primary-km"
            >
              Únete a la comunidad
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home