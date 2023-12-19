import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import PricesManager from './components/PricesManager.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PricesManager />
  </React.StrictMode>,
)
