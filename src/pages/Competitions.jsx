import { useMemo, useState } from 'react'

import Header from '../components/Header'

import weekend20260516 from '../data/competitions/weekend-2026-05-16.json'
import weekend20260509 from '../data/competitions/weekend-2026-05-09.json'
import weekend20260426 from '../data/competitions/weekend-2026-04-26.json'
import weekend20260329 from '../data/competitions/weekend-2026-03-29.json'
import weekend20260322 from '../data/competitions/weekend-2026-03-22.json'
import weekend20260315 from '../data/competitions/weekend-2026-03-15.json'

const competitionWeeks = [
  weekend20260516,
  weekend20260509,
  weekend20260426,
  weekend20260329,
  weekend20260322,
  weekend20260315,
]

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatMonth(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })
}

function Competitions() {
  const sortedWeeks = useMemo(() => {
    return [...competitionWeeks].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )
  }, [])

  const [selectedDate, setSelectedDate] = useState(sortedWeeks[0]?.date)
  const [draftDate, setDraftDate] = useState(sortedWeeks[0]?.date)
  const [showFilters, setShowFilters] = useState(false)

  const currentWeek =
    sortedWeeks.find(week => week.date === selectedDate) || sortedWeeks[0]

  const draftMonth = formatMonth(draftDate)

  const months = useMemo(() => {
    return [...new Set(sortedWeeks.map(week => formatMonth(week.date)))]
  }, [sortedWeeks])

  const weeksByMonth = useMemo(() => {
    return sortedWeeks.filter(week => formatMonth(week.date) === draftMonth)
  }, [draftMonth, sortedWeeks])

  const openFilters = () => {
    setDraftDate(selectedDate)
    setShowFilters(true)
  }

  const closeFilters = () => {
    setDraftDate(selectedDate)
    setShowFilters(false)
  }

  const changeMonth = month => {
    const firstWeekOfMonth = sortedWeeks.find(
      week => formatMonth(week.date) === month,
    )

    if (firstWeekOfMonth) {
      setDraftDate(firstWeekOfMonth.date)
    }
  }

  const applyFilters = () => {
    setSelectedDate(draftDate)
    setShowFilters(false)
  }

  return (
    <main className="competitions-page">
      <Header />

      <section className="competitions-hero">
        <div className="competitions-hero-content">

          <h1>Valientes con dorsal</h1>

          <p className="competitions-lead">
            {currentWeek.subtitle}. {currentWeek.intro}
          </p>

          <div className="competitions-info-panel">
            <div className="date-card">
              <div>
                <strong>{formatDate(currentWeek.date)}</strong>
                <span>Fecha del finde</span>
              </div>

              <button
                type="button"
                className={showFilters ? 'date-filter-btn active' : 'date-filter-btn'}
                onClick={showFilters ? closeFilters : openFilters}
                aria-label="Abrir filtros"
              >
                ⌄
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="competition-filter-panel">
            <div className="competition-filter-head">
              <strong>Filtrar competiciones</strong>

              <div className="competition-filter-actions">
                <button type="button" className="filter-see-btn" onClick={applyFilters}>
                  Ver
                </button>

                <button type="button" className="filter-close-btn" onClick={closeFilters}>
                  ✕
                </button>
              </div>
            </div>

            <div className="competition-filter-grid">
              <label className="competition-select">
                <span>Mes</span>

                <select
                  value={draftMonth}
                  onChange={event => changeMonth(event.target.value)}
                >
                  {months.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>

              <label className="competition-select">
                <span>Semana</span>

                <select
                  value={draftDate}
                  onChange={event => setDraftDate(event.target.value)}
                >
                  {weeksByMonth.map(week => (
                    <option key={week.id} value={week.date}>
                      {formatDate(week.date)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
      </section>

      <section className="competitions-grid">
        {currentWeek.runners.map((runner, index) => (
          <article className="competition-card" key={`${runner.name}-${index}`}>
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
        <div>
          {currentWeek.closing.map(text => (
            <p key={text}>{text}</p>
          ))}

          <h2>¡Vamos a por ello equipo! 🔥</h2>
        </div>
      </section>
    </main>
  )
}

export default Competitions