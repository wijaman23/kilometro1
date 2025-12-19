import { useEffect, useState } from "react";
import "./AchievementSlider.css";

export default function AchievementSlider({ achievements }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!achievements.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % achievements.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [achievements]);

  if (!achievements.length) {
    return <p className="text-center text-muted">No hay logros aún</p>;
  }

  const achievement = achievements[index];

  return (
    <div className="achievement-slider">
      <div
        className="achievement-card"
        style={{
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.15),
              rgba(0,0,0,0.85)
            ),
            url(${achievement.imageUrl})
          `,
        }}
      >
        <div className="achievement-content">
          <h3>{achievement.athleteName}</h3>
          <h5>{achievement.title}</h5>
          <p>{achievement.description}</p>
        </div>

        <div className="slider-controls">
          <button
            onClick={() =>
              setIndex(
                index === 0 ? achievements.length - 1 : index - 1
              )
            }
          >
            ◀
          </button>
          <button
            onClick={() =>
              setIndex((index + 1) % achievements.length)
            }
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
