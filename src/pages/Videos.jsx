import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga4";
import { Apple, Brain, GraduationCap } from "lucide-react";

import videos from "../data/videos";
import Header from "../components/Header";

function getYoutubeId(url = "") {
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  if (url.includes("/embed/") && url.includes("youtube.com")) {
    return url.split("/embed/")[1].split("?")[0];
  }

  return "";
}

function getLoomId(url = "") {
  if (url.includes("loom.com/share/")) {
    return url.split("loom.com/share/")[1].split("?")[0];
  }

  if (url.includes("loom.com/embed/")) {
    return url.split("loom.com/embed/")[1].split("?")[0];
  }

  return "";
}

function getVideoType(url = "") {
  if (url.includes("loom.com")) return "loom";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "unknown";
}

function getEmbedUrl(url = "", autoplay = false) {
  const tipo = getVideoType(url);

  if (tipo === "loom") {
    const loomId = getLoomId(url);
    return `https://www.loom.com/embed/${loomId}${autoplay ? "?autoplay=1" : ""}`;
  }

  if (tipo === "youtube") {
    const youtubeId = getYoutubeId(url);
    return `https://www.youtube.com/embed/${youtubeId}${
      autoplay ? "?autoplay=1&rel=0" : "?rel=0"
    }`;
  }

  return url;
}

function getCategoriasVideo(video) {
  if (Array.isArray(video.categorias)) return video.categorias;
  return [];
}

function formatearDuracion(isoDuration) {
  if (!isoDuration) return "";

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const horas = parseInt(match?.[1] || 0);
  const minutos = parseInt(match?.[2] || 0);
  const segundos = parseInt(match?.[3] || 0);

  if (horas > 0) {
    return `${horas}:${String(minutos).padStart(2, "0")}:${String(
      segundos,
    ).padStart(2, "0")}`;
  }

  return `${minutos}:${String(segundos).padStart(2, "0")}`;
}

function Videos() {
  const [categoriaPrincipal, setCategoriaPrincipal] = useState("Todos");
  const [subcategoria, setSubcategoria] = useState("Todos");
  const [mes, setMes] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [videoActivo, setVideoActivo] = useState(null);
  const [cargandoVideo, setCargandoVideo] = useState(false);

  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [duraciones, setDuraciones] = useState({});

  const categoriasPrincipales = [
    {
      nombre: "Sesión Mastermind",
      descripcion: "Sesiones exclusivas con la comunidad KM1.",
      icono: <Brain size={24} strokeWidth={2.4} />,
    },
    {
      nombre: "Clase del mes",
      descripcion: "Clases mensuales sobre entrenamiento y rendimiento.",
      icono: <GraduationCap size={24} strokeWidth={2.4} />,
    },
    {
      nombre: "Nutrición con Alfonso Mendoza",
      descripcion: "Consejos y estrategias de nutrición para runners.",
      icono: <Apple size={24} strokeWidth={2.4} />,
    },
  ];

  const subcategorias = [
    "Todos",
    "Material deportivo",
    "Entrenamiento",
    "Técnica",
    "Mentalidad",
    "Nutrición",
  ];

  const meses = [
    "Todos",
    ...new Set(
      videos.map((video) => {
        const fecha = new Date(video.fecha);

        return fecha.toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        });
      }),
    ),
  ];

  useEffect(() => {
    async function cargarDuraciones() {
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

        if (!apiKey) return;

        const ids = videos
          .map((video) => getYoutubeId(video.enlace))
          .filter(Boolean)
          .join(",");

        if (!ids) return;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${apiKey}`,
        );

        const data = await response.json();

        if (!data.items) return;

        const nuevasDuraciones = {};

        data.items.forEach((item) => {
          nuevasDuraciones[item.id] = formatearDuracion(
            item.contentDetails.duration,
          );
        });

        setDuraciones(nuevasDuraciones);
      } catch (error) {
        console.error(error);
      }
    }

    cargarDuraciones();
  }, []);

  const videosFiltrados = useMemo(() => {
    let resultado = [...videos];

    if (categoriaPrincipal !== "Todos") {
      resultado = resultado.filter(
        (video) => video.categoriaPrincipal === categoriaPrincipal,
      );
    }

    if (categoriaPrincipal === "Clase del mes" && subcategoria !== "Todos") {
      resultado = resultado.filter((video) =>
        getCategoriasVideo(video).includes(subcategoria),
      );
    }

    if (mes !== "Todos") {
      resultado = resultado.filter((video) => {
        const fecha = new Date(video.fecha);

        const mesVideo = fecha.toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        });

        return mesVideo === mes;
      });
    }

    if (busqueda.trim()) {
      const texto = busqueda.toLowerCase();

      resultado = resultado.filter((video) => {
        return (
          video.titulo.toLowerCase().includes(texto) ||
          video.descripcion.toLowerCase().includes(texto) ||
          video.categoriaPrincipal.toLowerCase().includes(texto) ||
          getCategoriasVideo(video).join(" ").toLowerCase().includes(texto)
        );
      });
    }

    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return resultado;
  }, [categoriaPrincipal, subcategoria, mes, busqueda]);

  const abrirVideo = (video) => {
    ReactGA.event({
      category: "Videos",
      action: "Abrir video",
      label: video.titulo,
    });

    setCargandoVideo(true);
    setVideoActivo(video);
  };

  const cerrarVideo = () => {
    setVideoActivo(null);
    setCargandoVideo(false);
  };

  const limpiarFiltros = () => {
    setCategoriaPrincipal("Todos");
    setSubcategoria("Todos");
    setMes("Todos");
    setBusqueda("");
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const hayFiltrosActivos =
    categoriaPrincipal !== "Todos" ||
    subcategoria !== "Todos" ||
    mes !== "Todos" ||
    busqueda.trim() !== "";

  return (
    <main className="videos-page">
      <Header />
      <section className="videos-container">
        <div className="videos-title-row">
          <header className="videos-title">
            <h1>Vídeos</h1>

            <span>
              Clases, nutrición, mentalidad, técnica y sesiones Mastermind.
            </span>
          </header>

          <div className="top-actions">
            <button
              className={
                mostrarBuscador ? "round-action active" : "round-action"
              }
              onClick={() => setMostrarBuscador(!mostrarBuscador)}
            >
              ⌕
            </button>

            <button
              className={
                mostrarFiltros ? "filter-toggle active" : "filter-toggle"
              }
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              ☰ Filtros {hayFiltrosActivos && <small></small>}
            </button>
          </div>
        </div>

        {mostrarBuscador && (
          <div className="search-drop">
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Buscar vídeos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {busqueda && (
                <button
                  className="clear-search"
                  onClick={() => setBusqueda("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        <section className="main-category-cards">
          {categoriasPrincipales.map((categoria) => (
            <button
              key={categoria.nombre}
              className={
                categoriaPrincipal === categoria.nombre
                  ? "main-category-card active"
                  : "main-category-card"
              }
              onClick={() => {
                setCategoriaPrincipal(categoria.nombre);
                setSubcategoria("Todos");
              }}
            >
              <div className="main-category-icon">{categoria.icono}</div>

              <div className="main-category-text">
                <strong>{categoria.nombre}</strong>

                <em>{categoria.descripcion}</em>

                <small>
                  {
                    videos.filter(
                      (video) => video.categoriaPrincipal === categoria.nombre,
                    ).length
                  }{" "}
                  vídeos
                </small>
              </div>

              <b>›</b>
            </button>
          ))}
        </section>

        {mostrarFiltros && (
          <section className="filters-drawer">
            <div className="filters-drawer-head">
              <strong>Filtros</strong>

              {hayFiltrosActivos && (
                <button onClick={limpiarFiltros}>Limpiar</button>
              )}
            </div>

            <div className="filters-drawer-grid">
              <div className="select-wrapper">
                <span className="select-icon">◉</span>

                <label>Categoría principal</label>

                <select
                  value={categoriaPrincipal}
                  onChange={(e) => {
                    setCategoriaPrincipal(e.target.value);
                    setSubcategoria("Todos");
                  }}
                >
                  <option value="Todos">Todos</option>

                  {categoriasPrincipales.map((categoria) => (
                    <option key={categoria.nombre} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                <span className="select-arrow">⌄</span>
              </div>

              {categoriaPrincipal === "Clase del mes" && (
                <div className="select-wrapper">
                  <span className="select-icon">◎</span>

                  <label>Subcategoría</label>

                  <select
                    value={subcategoria}
                    onChange={(e) => setSubcategoria(e.target.value)}
                  >
                    {subcategorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>

                  <span className="select-arrow">⌄</span>
                </div>
              )}

              <div className="select-wrapper">
                <span className="select-icon">◷</span>

                <label>Mes</label>

                <select value={mes} onChange={(e) => setMes(e.target.value)}>
                  {meses.map((mesItem) => (
                    <option key={mesItem} value={mesItem}>
                      {mesItem}
                    </option>
                  ))}
                </select>

                <span className="select-arrow">⌄</span>
              </div>
            </div>
          </section>
        )}

        <div className="videos-count-row">
          <div>
            <strong>{videosFiltrados.length} vídeos</strong>

            <span>Contenido KM1 disponible</span>
          </div>

          {hayFiltrosActivos && (
            <div className="list-actions">
              <button
                type="button"
                className="see-all-btn"
                onClick={limpiarFiltros}
              >
                Ver todos
              </button>
            </div>
          )}
        </div>

        {videosFiltrados.length > 0 ? (
          <section className="youtube-grid">
            {videosFiltrados.map((video) => {
              const youtubeId = getYoutubeId(video.enlace);
              const esYoutube = getVideoType(video.enlace) === "youtube";

              return (
                <article className="youtube-card" key={video.id}>
                  <button
                    className="youtube-thumb"
                    onClick={() => abrirVideo(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      loading="lazy"
                    />

                    {esYoutube && youtubeId && (
                      <iframe
                        className="preview-iframe"
                        src={`https://www.youtube.com/embed/${youtubeId}?mute=1&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${youtubeId}`}
                        title={`Preview ${video.titulo}`}
                        allow="autoplay; encrypted-media"
                      />
                    )}

                    <span className="play-badge">▶</span>

                    {duraciones[youtubeId] && (
                      <span className="duration-badge">
                        {duraciones[youtubeId]}
                      </span>
                    )}
                  </button>

                  <div className="youtube-card-info">
                    <button onClick={() => abrirVideo(video)}>
                      {video.titulo}
                    </button>

                    <div className="video-meta">
                      <small>{formatearFecha(video.fecha)}</small>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="empty-message">
            <div>
              <strong>No hay vídeos con estos filtros.</strong>
            </div>

            <button onClick={limpiarFiltros}>Ver todos</button>
          </div>
        )}
      </section>

      {videoActivo && (
        <div className="video-modal" onClick={cerrarVideo}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={cerrarVideo}>
              ✕
            </button>

            {cargandoVideo && (
              <div className="modal-loader">
                <div className="page-loader"></div>
              </div>
            )}

            <iframe
              src={getEmbedUrl(videoActivo.enlace, true)}
              title={videoActivo.titulo}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setCargandoVideo(false)}
            />

            <div className="modal-video-info">
              <h2>{videoActivo.titulo}</h2>

              <p>{videoActivo.descripcion}</p>

              <span>{formatearFecha(videoActivo.fecha)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Videos;