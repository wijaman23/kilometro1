import { Link } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-background"></div>

        <Header />

        <section className="hero-content">
          <div className="hero-text">

            <p className="hero-subtitle">
              Comunidad runner
            </p>

            <h1 className="hero-title">
              <span>Somos</span>
              <span>Kilómetro1</span>
            </h1>

            <p className="hero-description">
              Corredores de todo el mundo persiguiendo la{" "}
              <strong>EXCELENCIA</strong> también en el{" "}
              <strong>RUNNING</strong>.
            </p>

            <div className="hero-actions">

              {/* =====================================================
                  COMUNIDAD KM1
                  ===================================================== */}
              <a
                href="https://www.instagram.com/equipokm1/?hl=es"
                target="_blank"
                rel="noreferrer"
                className="hero-community-btn"
              >
                Únete a la comunidad
              </a>

              {/* =====================================================
                  CROWN SPORT NUTRITION
                  ===================================================== */}
              <a
                href="https://club.crownsportnutrition.com/es/iniciar-sesion?back=my-account"
                target="_blank"
                rel="noreferrer"
                className="hero-sponsor-card"
              >
                <div className="hero-sponsor-top">
                  <span>Partner nutricional</span>
                </div>

                <div className="hero-sponsor-logo-container">
                  <img
                    src="/crown-logo-gold.avif"
                    alt="Crown Sport Nutrition"
                    className="hero-sponsor-logo hero-crown-logo"
                  />
                </div>

                <div className="hero-sponsor-bottom">
                  <span>Crown Sport Nutrition</span>
                </div>
              </a>

              {/* =====================================================
                  SIROKO
                  ===================================================== */}
              <a
                href="https://www.siroko.com/es/?utm_source=family&utm_medium=family&utm_campaign=pablocristobal&type=pablocristobal&sport=cycling"
                target="_blank"
                rel="noreferrer"
                className="hero-sponsor-card"
              >
                <div className="hero-sponsor-top">
                  <span>Partner KM1</span>

                  <span className="hero-sponsor-discount">
                    -15%
                  </span>
                </div>

                <div className="hero-sponsor-logo-container">
                  <img
                    src="/Siroko_logo_2024.png"
                    alt="Siroko"
                    className="hero-sponsor-logo hero-siroko-logo"
                  />
                </div>

                <div className="hero-sponsor-bottom">
                  <span>
                    Código: <strong>PABLOCRISTOBAL</strong>
                  </span>
                </div>
              </a>

            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;