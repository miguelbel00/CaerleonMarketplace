import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home.tsx'
import PricesManager from './components/PricesManager.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home></Home>
    <PricesManager />
    
  </React.StrictMode>,
)
