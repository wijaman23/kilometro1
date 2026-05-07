import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import videos from '../data/videos'

import logo from '../assets/kilometro1.png'

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

  const categorias = ['Todos', ...new Set(videos.map(video => video.categoria))]

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
      resultado = resultado.filter(
        video => video.categoria === categoriaActiva,
      )
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
        <Link to="/" className="logo-link">
          <img src={logo} alt="Kilómetro 1" className="logo-img" />
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
            Clases, entrenamientos, mastermind y comunidad runner.
          </span>
        </header>

        <div className="filters-row">
          <div className="category-scroll">
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={
                  categoriaActiva === categoria
                    ? 'filter-btn active'
                    : 'filter-btn'
                }
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="selects-row">
            <select value={mes} onChange={e => setMes(e.target.value)}>
              {meses.map(mesItem => (
                <option key={mesItem} value={mesItem}>
                  {mesItem}
                </option>
              ))}
            </select>

            <select value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
            </select>
          </div>
        </div>

        <section className="youtube-grid">
          {videosFiltrados.map(video => (
            <article className="youtube-card" key={video.id}>
              <button
                className="youtube-thumb"
                onClick={() => setVideoActivo(video)}
              >
                <img src={video.thumbnail} alt={video.titulo} />

                <iframe
                  className="preview-iframe"
                  src={`https://www.youtube.com/embed/${getYoutubeId(video.enlace)}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${getYoutubeId(video.enlace)}`}
                  title={`Preview ${video.titulo}`}
                  allow="autoplay; encrypted-media"
                ></iframe>

                <span className="play-badge">▶</span>
              </button>

              <div className="youtube-card-info">
                <button onClick={() => setVideoActivo(video)}>
                  {video.titulo}
                </button>

                <span>{video.categoria}</span>

                <small>{formatearFecha(video.fecha)}</small>
              </div>
            </article>
          ))}
        </section>
      </section>

      {videoActivo && (
        <div
          className="video-modal"
          onClick={() => setVideoActivo(null)}
        >
          <div
            className="video-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setVideoActivo(null)}
            >
              ✕
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(videoActivo.enlace)}?autoplay=1`}
              title={videoActivo.titulo}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="modal-video-info">
              <h2>{videoActivo.titulo}</h2>

              <p>{videoActivo.descripcion}</p>

              <span>
                {videoActivo.categoria} ·{' '}
                {formatearFecha(videoActivo.fecha)}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Videos