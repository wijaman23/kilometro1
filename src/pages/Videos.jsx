// src/pages/Videos.jsx

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

function normalizarTexto(texto = '') {
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getCategoriasVideo(video) {
  if (Array.isArray(video.categorias)) return video.categorias
  return []
}

function Videos() {
  const [categoriaPrincipal, setCategoriaPrincipal] = useState('Todas')
  const [subcategoria, setSubcategoria] = useState('Todas')
  const [mes, setMes] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [videoActivo, setVideoActivo] = useState(null)
  const [cargandoVideo, setCargandoVideo] = useState(false)

  const categoriasPrincipales = [
    {
      nombre: 'Sesión Mastermind',
      icono: '👥',
      texto: 'Sesiones exclusivas con la comunidad KM1.',
    },
    {
      nombre: 'Clase del mes',
      icono: '🎓',
      texto: 'Clases mensuales sobre entrenamiento y rendimiento.',
    },
    {
      nombre: 'Nutrición con Alfonso Mendoza',
      icono: '🥑',
      texto: 'Consejos y estrategias de nutrición para runners.',
    },
  ]

  const subcategoriasClase = [
    'Todas',
    'Material deportivo',
    'Entrenamiento',
    'Técnica',
    'Mentalidad',
    'Nutrición',
  ]

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

  const contarVideos = categoria => {
    return videos.filter(video => video.categoriaPrincipal === categoria).length
  }

  const videosFiltrados = useMemo(() => {
    let resultado = [...videos]

    const busquedaNormalizada = normalizarTexto(busqueda.trim())

    if (categoriaPrincipal !== 'Todas') {
      resultado = resultado.filter(
        video => video.categoriaPrincipal === categoriaPrincipal,
      )
    }

    if (categoriaPrincipal === 'Clase del mes' && subcategoria !== 'Todas') {
      resultado = resultado.filter(video =>
        getCategoriasVideo(video).includes(subcategoria),
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

    if (busquedaNormalizada) {
      resultado = resultado.filter(video => {
        const textoVideo = normalizarTexto(
          `${video.titulo} ${video.descripcion} ${video.categoriaPrincipal} ${getCategoriasVideo(video).join(' ')}`,
        )

        return textoVideo.includes(busquedaNormalizada)
      })
    }

    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    return resultado
  }, [categoriaPrincipal, subcategoria, mes, busqueda])

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

  const limpiarFiltros = () => {
    setCategoriaPrincipal('Todas')
    setSubcategoria('Todas')
    setMes('Todos')
    setBusqueda('')
  }

  const hayFiltrosActivos =
    categoriaPrincipal !== 'Todas' ||
    subcategoria !== 'Todas' ||
    mes !== 'Todos' ||
    busqueda.trim() !== ''

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
        <header className="videos-title-row">
          <div className="videos-title">
            <p>Contenido KM1</p>

            <h1>Vídeos</h1>

            <span>
              Clases, nutrición, mentalidad, técnica y sesiones Mastermind.
            </span>
          </div>

          <div className="top-actions">
            <button
              type="button"
              className={buscadorAbierto ? 'round-action active' : 'round-action'}
              onClick={() => setBuscadorAbierto(!buscadorAbierto)}
            >
              ⌕
            </button>

            <button
              type="button"
              className={filtrosAbiertos ? 'filter-toggle active' : 'filter-toggle'}
              onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            >
              <span>☷</span>
              Filtros
              {hayFiltrosActivos && <small></small>}
              <b>{filtrosAbiertos ? '⌃' : '⌄'}</b>
            </button>
          </div>
        </header>

        {buscadorAbierto && (
          <section className="search-drop">
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>

              <input
                type="search"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por título, categoría o descripción..."
              />

              {busqueda && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setBusqueda('')}
                >
                  ✕
                </button>
              )}
            </div>
          </section>
        )}

        <section className="main-category-cards">
          {categoriasPrincipales.map(categoria => (
            <button
              type="button"
              key={categoria.nombre}
              className={
                categoriaPrincipal === categoria.nombre
                  ? 'main-category-card active'
                  : 'main-category-card'
              }
              onClick={() => {
                setCategoriaPrincipal(categoria.nombre)
                setSubcategoria('Todas')
              }}
            >
              <span className="main-category-icon">{categoria.icono}</span>

              <span className="main-category-text">
                <strong>{categoria.nombre}</strong>
                <em>{categoria.texto}</em>
                <small>{contarVideos(categoria.nombre)} vídeos</small>
              </span>

              <b>›</b>
            </button>
          ))}
        </section>

        {filtrosAbiertos && (
          <section className="filters-drawer">
            <div className="filters-drawer-head">
              <strong>Filtros</strong>

              {hayFiltrosActivos && (
                <button type="button" onClick={limpiarFiltros}>
                  Limpiar
                </button>
              )}
            </div>

            <div className="filters-drawer-grid">
              <div className="select-wrapper">
                <span className="select-icon">◎</span>

                <label>Categoría principal</label>

                <select
                  value={categoriaPrincipal}
                  onChange={e => {
                    setCategoriaPrincipal(e.target.value)
                    setSubcategoria('Todas')
                  }}
                >
                  <option value="Todas">Todas</option>

                  {categoriasPrincipales.map(categoria => (
                    <option key={categoria.nombre} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                <span className="select-arrow">⌄</span>
              </div>

              {categoriaPrincipal === 'Clase del mes' && (
                <div className="select-wrapper">
                  <span className="select-icon">⌘</span>

                  <label>Subcategoría</label>

                  <select
                    value={subcategoria}
                    onChange={e => setSubcategoria(e.target.value)}
                  >
                    {subcategoriasClase.map(categoria => (
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

                <select value={mes} onChange={e => setMes(e.target.value)}>
                  {meses.map(mesItem => (
                    <option key={mesItem} value={mesItem}>
                      {mesItem}
                    </option>
                  ))}
                </select>

                <span className="select-arrow">⌄</span>
              </div>
            </div>

            <button
              type="button"
              className="apply-filters-btn"
              onClick={() => setFiltrosAbiertos(false)}
            >
              Aplicar filtros
            </button>
          </section>
        )}

        <div className="videos-count-row">
          <span>{videosFiltrados.length} vídeos encontrados</span>
        </div>

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
                    <small>{formatearFecha(video.fecha)}</small>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
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
              <span>{formatearFecha(videoActivo.fecha)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Videos