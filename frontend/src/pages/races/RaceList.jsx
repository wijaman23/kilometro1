import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { formatDate } from "../../utils/date"

export default function RaceList() {
  const [races, setRaces] = useState([]);
  const [tab, setTab] = useState("upcoming");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [distance, setDistance] = useState("");

  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const endpoint =
      tab === "upcoming"
        ? "/races/upcoming"
        : tab === "past"
        ? "/races/past"
        : "/races/favorites";

    api.get(endpoint).then((res) => {
      setRaces(res.data);
      setPage(1);
    });
  }, [tab]);

  const filtered = races.filter((r) => {
    const d = new Date(r.date);

    if (year && d.getFullYear().toString() !== year) return false;
    if (month && d.getMonth() + 1 !== Number(month)) return false;
    if (
      distance &&
      !r.distances.some((d) =>
        distance === "other" ? d.label === "OTROS" : d.km === Number(distance)
      )
    ) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-3">🏁 Carreras</h2>

        {/* TABS */}
        <div className="btn-group mb-4">
          {[
            ["upcoming", "Próximas"],
            ["past", "Antiguas"],
            ["favorites", "⭐ Favoritas"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`btn ${
                tab === key ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* FILTROS */}
        <div className="row g-2 mb-4">
          <div className="col-md-3">
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Año</option>
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Mes</option>
              {[
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="">Distancia</option>
              <option value="5">5K</option>
              <option value="10">10K</option>
              <option value="21">21K</option>
              <option value="42">42K</option>
              <option value="other">Otros</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setYear("");
                setMonth("");
                setDistance("");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {visible.map((race) => (
            <div key={race._id} className="col">
              <div className="card h-100 shadow-sm">
                {race.image && (
                  <img
                    src={race.image}
                    alt={race.title}
                    className="card-img-top"
                    style={{ height: 160, objectFit: "cover" }}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{race.title}</h6>

                  <div className="text-muted small mb-1">📍 {race.city}</div>

                  <div className="text-muted small mb-2">
                    📅 {formatDate(race.date)}
                  </div>

                  <div className="mb-3">
                    {race.distances.map((d) => (
                      <span key={d} className="badge bg-secondary me-1">
                        {d.label}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/races/${race._id}`}
                    className="btn btn-danger mt-auto"
                  >
                    Ver carrera
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${
                  page === i + 1 ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
