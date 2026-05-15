import { useEffect, useState } from 'react'
import '../styles/meetupPopup.css'

const races = [
  {
    id: 1,
    name: 'Bilbao Night Run Fest',
    city: 'Bilbao',
    date: '17 de octubre',
    distances: '10K / Media Maratón',
    votes: 10,
    link: 'https://www.google.com/search?q=Bilbao+Night+Run+Fest',
  },
  {
    id: 2,
    name: 'Maratón Ciudad de Logroño',
    city: 'Logroño',
    date: '4 de octubre',
    distances: '10K / Media Maratón / Maratón',
    votes: 14,
    link: 'https://www.google.com/search?q=Marat%C3%B3n+Ciudad+de+Logro%C3%B1o',
  },
  {
    id: 3,
    name: '10K Ponle Freno Madrid',
    city: 'Madrid',
    date: '15 de noviembre',
    distances: '5K / 10K',
    votes: 19,
    link: 'https://www.google.com/search?q=10K+Ponle+Freno+Madrid',
  },
]

function MeetupPopup() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const closed = localStorage.getItem('km1-meetup-popup-closed')

    if (!closed) {
      const timer = setTimeout(() => {
        setVisible(true)
      }, 900)

      return () => clearTimeout(timer)
    }
  }, [])

  const closePopup = () => {
    localStorage.setItem('km1-meetup-popup-closed', 'true')

    setMobileOpen(false)
    setVisible(false)
  }

  const totalVotes = races.reduce((total, race) => total + race.votes, 0)

  const leader = races.reduce((prev, current) =>
    current.votes > prev.votes ? current : prev
  )

  if (!visible) return null

  return (
    <>
      <button
        className={`meetup-mobile-trigger ${mobileOpen ? 'hidden' : ''}`}
        onClick={() => setMobileOpen(true)}
      >
        🔔 Quedada KM1 2026
      </button>

      <div
        className={`meetup-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <section
        className={`meetup-popup ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <button className="meetup-popup-close" onClick={closePopup}>
          ×
        </button>

        <div className="meetup-popup-kicker">
          Quedada KM1 2026
        </div>

        <h3>Estamos eligiendo destino 🍀</h3>

        <p>
          Resultado provisional a día de hoy. De momento va ganando{' '}
          <strong>{leader.name}</strong>.
        </p>

        <div className="meetup-popup-results">
          {races.map(race => {
            const percentage = Math.round(
              (race.votes / totalVotes) * 100
            )

            return (
              <a
                key={race.id}
                className="meetup-popup-option"
                href={race.link}
                target="_blank"
                rel="noreferrer"
              >
                <div className="meetup-popup-option-top">
                  <span>{race.name}</span>
                  <strong>{race.votes}</strong>
                </div>

                <div className="meetup-popup-bar">
                  <span style={{ width: `${percentage}%` }} />
                </div>

                <div className="meetup-popup-meta">
                  📍 {race.city} · 📅 {race.date} · 🏃 {race.distances}
                </div>
              </a>
            )
          })}
        </div>

        <div className="meetup-popup-footer">
          <span>{totalVotes} votos registrados</span>

          <button onClick={closePopup}>
            Entendido
          </button>
        </div>
      </section>
    </>
  )
}

export default MeetupPopup