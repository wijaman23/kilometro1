import { useEffect, useMemo, useState } from "react";

export default function AchievementSlider({ achievements = [] }) {
  const [index, setIndex] = useState(0);
  const total = achievements.length;

  const current = useMemo(() => achievements[index], [achievements, index]);

  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  if (!current) return null;

  return (
    <>
      <style>{`
        .ach-card {
          border: 1px solid #eee;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #ffffff 0%, #faf7f7 60%, #fff 100%);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .ach-left {
          position: relative;
          min-height: 260px;
          background: #111;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .ach-img-wrap {
          position: relative;
          width: min(320px, 86%);
          aspect-ratio: 4 / 5;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 60px rgba(0,0,0,0.35);
        }
        .ach-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display:block;
          filter: contrast(1.02) saturate(1.05);
        }
        .ach-laurel {
          position:absolute;
          inset: -10px;
          pointer-events:none;
          opacity: 0.95;
          background:
            radial-gradient(circle at 50% 30%, rgba(255,255,255,0.10), transparent 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='520' viewBox='0 0 420 520'%3E%3Cg fill='none' stroke='%23d6b24c' stroke-width='10' opacity='0.85'%3E%3Cpath d='M110 420c-40-60-55-150-10-240 22-45 50-78 85-105'/%3E%3Cpath d='M310 420c40-60 55-150 10-240-22-45-50-78-85-105'/%3E%3C/g%3E%3Cg fill='%23d6b24c' opacity='0.75'%3E%3Ccircle cx='112' cy='410' r='5'/%3E%3Ccircle cx='308' cy='410' r='5'/%3E%3C/g%3E%3C/svg%3E");
          background-repeat:no-repeat;
          background-position:center;
          background-size: cover;
          mix-blend-mode: screen;
        }
        .ach-right {
          padding: 22px 22px 18px;
        }
        .ach-kicker {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b02a37;
          font-weight: 700;
        }
        .ach-title {
          font-size: 24px;
          font-weight: 800;
          margin: 6px 0 8px;
          line-height: 1.15;
        }
        .ach-athlete {
          display:inline-flex;
          align-items:center;
          gap:8px;
          color:#333;
          font-weight:700;
        }
        .ach-desc {
          color:#444;
          margin: 12px 0 14px;
          line-height: 1.55;
        }
        .ach-controls {
          display:flex;
          gap:10px;
          align-items:center;
          justify-content: space-between;
          margin-top: 12px;
        }
        .ach-btn {
          border: 1px solid #eee;
          background:#fff;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 700;
        }
        .ach-btn:hover { border-color:#ddd; }
        .ach-dots {
          display:flex;
          gap:6px;
          align-items:center;
          justify-content:center;
        }
        .ach-dot {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #ddd;
        }
        .ach-dot.active { background: #dc3545; width: 18px; }
      `}</style>

      <div className="ach-card">
        <div className="row g-0">
          <div className="col-12 col-lg-5">
            <div className="ach-left">
              <div className="ach-img-wrap">
                <img className="ach-img" src={current.imageUrl} alt={current.title} />
                <div className="ach-laurel" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="ach-right">
              <div className="ach-kicker">Logro de la semana</div>
              <div className="ach-title">{current.title}</div>

              <div className="ach-athlete">
                🏅 <span>{current.athleteName}</span>
              </div>

              {current.description && (
                <p className="ach-desc">{current.description}</p>
              )}

              <div className="ach-controls">
                <div className="d-flex gap-2">
                  <button className="ach-btn" onClick={prev} disabled={total <= 1}>
                    ← Anterior
                  </button>
                  <button className="ach-btn" onClick={next} disabled={total <= 1}>
                    Siguiente →
                  </button>
                </div>

                <div className="ach-dots">
                  {achievements.map((_, i) => (
                    <div
                      key={i}
                      className={`ach-dot ${i === index ? "active" : ""}`}
                      onClick={() => setIndex(i)}
                      style={{ cursor: "pointer" }}
                      title={`${i + 1}/${total}`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                {index + 1} / {total}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
