import { Link } from "react-router-dom";

import logo from "../assets/logo.png";
import crownLogo from "../assets/crown.png";

import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-background"></div>

      <header className="hero-navbar">
        <Link to="/" className="hero-logo-link">
          <img src={logo} alt="Kilómetro1" className="hero-logo-img" />
        </Link>

        <Link to="/videos" className="hero-videos-btn">
          ▶ VER VÍDEOS
        </Link>
      </header>

      <main className="hero-content">
        <div className="hero-text">
          <p className="hero-subtitle">COMUNIDAD RUNNER</p>

          <h1 className="hero-title">
            <span>SOMOS</span>
            <span>KILOMETRO1</span>
          </h1>

          <p className="hero-description">
            Corredores de todo el mundo persiguiendo la{" "}
            <strong>EXCELENCIA</strong> también en el{" "}
            <strong>RUNNING.</strong>
          </p>

          <div className="hero-actions">
            <a
              href="https://www.instagram.com/equipokm1/?hl=es"
              target="_blank"
              rel="noreferrer"
              className="hero-community-btn"
            >
              ÚNETE A LA COMUNIDAD
            </a>
          </div>
        </div>
      </main>

      <a
        href="https://club.crownsportnutrition.com/es/iniciar-sesion?back=my-account"
        target="_blank"
        rel="noreferrer"
        className="crown-partner"
      >
        <span>Partner nutricional</span>

        <img src={crownLogo} alt="Crown Sport Nutrition" />
      </a>
    </div>
  );
}