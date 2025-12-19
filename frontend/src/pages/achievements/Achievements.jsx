//Achievements.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import AchievementSlider from "../../components/AchievementSlider";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    api.get("/achievements").then(res => setAchievements(res.data));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">🌿 Logros</h1>
      <AchievementSlider achievements={achievements} />
    </div>
  );
}
