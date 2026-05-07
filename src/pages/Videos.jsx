import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga4'

import videos from '../data/videos'
import logo from '../assets/LOGO_2_BLANCO.svg'

function getYoutubeId(url) {
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0]
  }

  if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0]
  }

  return ''
}

function Videos() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [orden, setOrden] = useState('recientes')
  const [mes, setMes] = useState('Todos')
  const [videoActivo, setVideoActivo] = useState(null)
  const [cargandoVideo, setCargandoVideo] = useState(false)

  const categoriasOrdenadas = [
    'Todos',
    'Mastermind',
    'Clase mensual',
    'Nutrición',
    'Entrenamiento',
    'Técnica',
    'Mentalidad',
    'Material',
    'Otros',
  ]

  const categorias = categoriasOrdenadas.filter(
    categoria =>
      categoria === 'Todos' ||
      videos.some(video => video.categoria === categoria),
  )

  const meses = [
    'Todos',
    ...new Set(
      videos.map(video => {
        const fecha = new Date(video.fecha)

        return fecha.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        })
      }),
    ),
  ]

  const videosFiltrados = useMemo(() => {
    let resultado = [...videos]

    if (categoriaActiva !== 'Todos') {
      resultado = resultado.filter(video => video.categoria === categoriaActiva)
    }

    if (mes !== 'Todos') {
      resultado = resultado.filter(video => {
        const fecha = new Date(video.fecha)

        const mesVideo = fecha.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        })

        return mesVideo === mes
      })
    }

    resultado.sort((a, b) => {
      if (orden === 'recientes') {
        return new Date(b.fecha) - new Date(a.fecha)
      }

      return new Date(a.fecha) - new Date(b.fecha)
    })

    return resultado
  }, [categoriaActiva, orden, mes])

  const abrirVideo = video => {
    ReactGA.event({
      category: 'Videos',
      action: 'Abrir video',
      label: video.titulo,
    })

    setCargandoVideo(true)
    setVideoActivo(video)
  }

  const cerrarVideo = () => {
    setVideoActivo(null)
    setCargandoVideo(false)
  }

  const formatearFecha = fecha => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <main className="videos-page">
      <nav className="videos-nav">
        <Link to="/" className="videos-logo-link">
          <img src={logo} alt="Kilómetro 1" className="videos-logo-img" />
        </Link>

        <Link to="/" className="back-home-btn">
          Inicio
        </Link>
      </nav>

      <section className="videos-container">
        <header className="videos-title">
          <p>Contenido KM1</p>

          <h1>Vídeos</h1>

          <span>
            Clases, nutrición, mentalidad, técnica y sesiones Mastermind.
          </span>
        </header>

        <section className="filters-panel">
          <div className="category-scroll">
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={
                  categoriaActiva === categoria
                    ? 'category-pill active'
                    : 'category-pill'
                }
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="mobile-filters-title">
            Filtra el contenido
          </div>

          <div className="selects-row">
            <div className="select-wrapper mobile-category-select">
              <span className="select-icon">☰</span>

              <select
                value={categoriaActiva}
                onChange={e => setCategoriaActiva(e.target.value)}
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>

              <span className="select-arrow">⌄</span>
            </div>

            <div className="select-wrapper desktop-month-select">
              <span className="select-icon">☰</span>

              <select value={mes} onChange={e => setMes(e.target.value)}>
                {meses.map(mesItem => (
                  <option key={mesItem} value={mesItem}>
                    {mesItem}
                  </option>
                ))}
              </select>

              <span className="select-arrow">⌄</span>
            </div>

            <div className="select-wrapper select-featured">
              <span className="select-icon">◷</span>

              <select value={orden} onChange={e => setOrden(e.target.value)}>
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
              </select>

              <span className="select-arrow">⌄</span>
            </div>
          </div>
        </section>

        {videosFiltrados.length > 0 ? (
          <section className="youtube-grid">
            {videosFiltrados.map(video => {
              const youtubeId = getYoutubeId(video.enlace)

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

                    <iframe
                      className="preview-iframe"
                      src={`https://www.youtube.com/embed/${youtubeId}?mute=1&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${youtubeId}`}
                      title={`Preview ${video.titulo}`}
                      allow="autoplay; encrypted-media"
                    />

                    <span className="play-badge">▶</span>
                  </button>

                  <div className="youtube-card-info">
                    <button onClick={() => abrirVideo(video)}>
                      {video.titulo}
                    </button>

                    <div className="video-meta">
                      <span>{video.categoria}</span>
                      <small>{formatearFecha(video.fecha)}</small>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        ) : (
          <div className="empty-message">
            No hay vídeos con estos filtros.
          </div>
        )}
      </section>

      {videoActivo && (
        <div className="video-modal" onClick={cerrarVideo}>
          <div
            className="video-modal-content"
            onClick={e => e.stopPropagation()}
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
              src={`https://www.youtube.com/embed/${getYoutubeId(
                videoActivo.enlace,
              )}?autoplay=1&rel=0`}
              title={videoActivo.titulo}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setCargandoVideo(false)}
            />

            <div className="modal-video-info">
              <h2>{videoActivo.titulo}</h2>

              <p>{videoActivo.descripcion}</p>

              <span>
                {videoActivo.categoria} · {formatearFecha(videoActivo.fecha)}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Videos