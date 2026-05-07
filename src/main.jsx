import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'

import App from './App.jsx'

import './styles/global.css'

ReactGA.initialize('G-Z6TPCEMYD7')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)