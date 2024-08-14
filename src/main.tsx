import React from 'react'
import ReactDOM from 'react-dom/client'
// import Home from './App.tsx'
// import Home from './Home.tsx'
import PricesManager from './components/PricesManager.tsx'
//import PricesForm from './components/PricesForm.tsx'
//import PricesTable from './components/PricesTable.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PricesManager />
  </React.StrictMode>,
)
