import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import AchievementSlider from "./AchievementSlider";

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/achievements")
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ fontSize: 26 }}>🌿</span>
          <h2 className="m-0">Logros</h2>
        </div>

        {loading ? (
          <div className="text-muted">Cargando logros...</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No hay logros aún</div>
        ) : (
          <AchievementSlider achievements={items} />
        )}
      </div>
    </>
  );
}
