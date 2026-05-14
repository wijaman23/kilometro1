import { useMemo, useState } from 'react'

import Header from '../components/Header'
import heroImage from '../assets/competitions-hero.jpg'

const competitionModules = import.meta.glob(
  '../data/competitions/*.json',
  { eager: true },
)

const competitionWeeks = Object.values(competitionModules).map(
  module => module.default,
)

function formatMonth(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })
}

function formatWeekendParts(date) {
  const start = new Date(date)
  const end = new Date(date)

  end.setDate(start.getDate() + 1)

  const startDay = start.toLocaleDateString('es-ES', { day: '2-digit' })
  const endDay = end.toLocaleDateString('es-ES', { day: '2-digit' })

  const month = end
    .toLocaleDateString('es-ES', { month: 'long' })
    .toUpperCase()

  const year = end.getFullYear()

  return {
    range: `${startDay}-${endDay}`,
    month,
    year,
    full: `FINDE DEL ${startDay}-${endDay} ${month} ${year}`,
  }
}

function Competitions() {
  const sortedWeeks = useMemo(() => {
    return [...competitionWeeks].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )
  }, [])

  const [selectedDate, setSelectedDate] = useState(sortedWeeks[0]?.date)
  const [showFilters, setShowFilters] = useState(false)

  const currentWeek =
    sortedWeeks.find(week => week.date === selectedDate) || sortedWeeks[0]

  const currentMonth = formatMonth(selectedDate)
  const currentWeekend = formatWeekendParts(currentWeek.date)

  const months = useMemo(() => {
    return [...new Set(sortedWeeks.map(week => formatMonth(week.date)))]
  }, [sortedWeeks])

  const weeksByMonth = useMemo(() => {
    return sortedWeeks.filter(week => formatMonth(week.date) === currentMonth)
  }, [currentMonth, sortedWeeks])

  const changeMonth = month => {
    const firstWeekOfMonth = sortedWeeks.find(
      week => formatMonth(week.date) === month,
    )

    if (firstWeekOfMonth) {
      setSelectedDate(firstWeekOfMonth.date)
    }
  }

  return (
    <main
      className="competitions-page"
      style={{ '--competitions-bg': `url(${heroImage})` }}
    >
      <Header />

      <section className="competitions-hero">
        <div className="competitions-hero-content">
          <h1>Valientes con dorsal</h1>

          <p>
            {currentWeek.subtitle}. {currentWeek.intro}
          </p>

          <div className="competitions-filter-area">
            <button
              type="button"
              className={
                showFilters
                  ? 'weekend-filter-button active'
                  : 'weekend-filter-button'
              }
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="weekend-filter-icon">▣</span>

              <strong>
                Finde del <em>{currentWeekend.range}</em>{' '}
                {currentWeekend.month} {currentWeekend.year}
              </strong>

              <span className="weekend-filter-arrow">⌄</span>
            </button>

            {showFilters && (
              <div className="competition-filter-panel">
                <div className="competition-filter-head">
                  <strong>Cambiar finde</strong>

                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    aria-label="Cerrar filtro"
                  >
                    ✕
                  </button>
                </div>

                <div className="filter-block">
                  <span>Mes</span>

                  <div className="filter-options">
                    {months.map(month => (
                      <button
                        type="button"
                        key={month}
                        className={
                          month === currentMonth
                            ? 'month-option active'
                            : 'month-option'
                        }
                        onClick={() => changeMonth(month)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <span>Semana</span>

                  <div className="week-options">
                    {weeksByMonth.map(week => {
                      const weekend = formatWeekendParts(week.date)

                      return (
                        <button
                          type="button"
                          key={week.id}
                          className={
                            week.date === selectedDate
                              ? 'week-option active'
                              : 'week-option'
                          }
                          onClick={() => {
                            setSelectedDate(week.date)
                            setShowFilters(false)
                          }}
                        >
                          <strong>{weekend.range}</strong>
                          <small>{weekend.month}</small>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="competitions-grid">
        {currentWeek.runners.map((runner, index) => (
          <article
            className="competition-card"
            key={`${runner.name}-${index}`}
          >
            <div className="competition-card-header">
              <span className="runner-status"></span>

              <div>
                <p>{runner.type}</p>
                <h2>{runner.name}</h2>
              </div>
            </div>

            <div className="competition-card-body">
              <div>
                <span>🏁</span>
                <p>{runner.race}</p>
              </div>

              <div>
                <span>🎯</span>
                <p>{runner.goal}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="competitions-closing">
        <div className="closing-km1-glow">KM1</div>

        <div className="closing-content">
          {currentWeek.closing.map(text => (
            <p key={text}>{text}</p>
          ))}

          <h2>¡Vamos a por ello equipo!</h2>
        </div>
      </section>
    </main>
  )
}

export default Competitions