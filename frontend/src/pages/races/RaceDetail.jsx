import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { formatDate } from "../../utils/date"

export default function RaceDetail() {
  const { id } = useParams();
  const [race, setRace] = useState(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    api.get(`/races/${id}`).then((res) => {
      setRace(res.data);
    });
  }, [id]);

  const toggleFavorite = async () => {
    await api.post(`/races/${id}/favorite`);
    setFav(!fav);
  };

  if (!race) return null;

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="card shadow">
          {race.image && (
            <img
              src={race.image}
              alt={race.title}
              className="card-img-top"
              style={{ maxHeight: 350, objectFit: "cover" }}
            />
          )}

          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h3>{race.title}</h3>

              <button
                className="btn btn-outline-warning"
                onClick={toggleFavorite}
              >
                ⭐ Favorita
              </button>
            </div>

            <p className="text-muted">
              📍 {race.city} · 📅{" "}
               {formatDate(race.date)}
            </p>

            <div className="mb-3">
              {race.distances.map((d) => (
                <span
                  key={d}
                  className="badge bg-danger me-2"
                >
                  {d.label}
                </span>
              ))}
            </div>

            <p>{race.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
