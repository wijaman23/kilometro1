import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import heroImage from '../assets/competitions-hero.jpg'
import logoWhite from '../assets/LOGO_2_BLANCO.svg'

const competitionModules = import.meta.glob('../data/competitions/*.json', {
  eager: true,
})

const competitionWeeks = Object.values(competitionModules).map(
  module => module.default,
)

function CompetitionDetail() {
  const { slug } = useParams()
  const [openPanel, setOpenPanel] = useState(null)
  const [routeError, setRouteError] = useState(false)

  const allRunners = competitionWeeks.flatMap(week => week.runners || [])
  const runner = allRunners.find(item => item.slug === slug)

  if (!runner) {
    return (
      <main className="competition-detail-page">
        <section className="competition-detail-empty">
          <h1>Competición no encontrada</h1>
          <Link to="/competiciones">Volver a competiciones</Link>
        </section>
      </main>
    )
  }

  const details = runner.details || {}
  const routeImage = details.routeImage
  const hasRoute = routeImage && !routeError

  const raceInfo =
    details.raceInfo ||
    'Información ampliada próximamente. Dorsal listo, objetivo claro y toda la fuerza KM1 para afrontar este reto.'

  const togglePanel = panel => {
    setOpenPanel(openPanel === panel ? null : panel)
  }

  return (
    <main className="competition-detail-page">
      <section className="competition-detail-card">
        <Link to="/competiciones" className="competition-detail-back">
          ← Volver a competiciones
        </Link>

        <section
          className={`competition-detail-hero ${openPanel ? 'expanded' : ''}`}
          style={{ '--detail-hero-bg': `url(${heroImage})` }}
        >
          <div className="competition-detail-logo">
            <img src={logoWhite} alt="Kilómetro 1" />
          </div>

          <div className="competition-detail-hero-bg">KM1</div>

          <div className="competition-detail-hero-content">
            <span className="competition-detail-kicker">{runner.name}</span>

            <h1>{runner.race}</h1>

            <div className="competition-detail-data">
              <div>
                <strong>{details.distance || runner.type}</strong>
                <span>Distancia</span>
              </div>

              <div>
                <strong>{details.location || 'KM1'}</strong>
                <span>Lugar</span>
              </div>

              {details.time && (
                <div>
                  <strong>{details.time}</strong>
                  <span>Hora</span>
                </div>
              )}
            </div>

            <div className="competition-detail-objective">
              <small>Objetivo KM1</small>
              <p>{runner.goal}</p>
            </div>

            <div className="competition-detail-actions">
              {details.website && (
                <a href={details.website} target="_blank" rel="noreferrer">
                  Web oficial
                </a>
              )}

              <button
                type="button"
                className={openPanel === 'info' ? 'active' : ''}
                onClick={() => togglePanel('info')}
              >
                {openPanel === 'info' ? 'Ocultar info' : 'Más info'}
              </button>

              {hasRoute && (
                <button
                  type="button"
                  className={openPanel === 'route' ? 'active' : ''}
                  onClick={() => togglePanel('route')}
                >
                  {openPanel === 'route'
                    ? 'Ocultar recorrido'
                    : 'Ver recorrido'}
                </button>
              )}
            </div>

            {openPanel === 'info' && (
              <div className="competition-detail-inline-panel">
                <small>Info de carrera</small>
                <p>{raceInfo}</p>
              </div>
            )}

            {openPanel === 'route' && hasRoute && (
              <div className="competition-detail-inline-panel route">
                <div className="competition-detail-inline-head">
                  <div>
                    <small>Recorrido</small>
                    <strong>Mapa de carrera</strong>
                  </div>

                  <a href={routeImage} target="_blank" rel="noreferrer">
                    Abrir
                  </a>
                </div>

                <img
                  src={routeImage}
                  alt={`Recorrido ${runner.race}`}
                  onError={() => setRouteError(true)}
                />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default CompetitionDetail