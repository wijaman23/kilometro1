import { Link } from 'react-router-dom'

import '../styles/competitionCard.css'

function CompetitionCard({ runner, index }) {
  return (
    <Link
      to={`/competiciones/${runner.slug}`}
      className="competition-card"
      style={{ animationDelay: `${index * 0.035}s` }}
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

      <span className="competition-card-arrow">→</span>
    </Link>
  )
}

export default CompetitionCard