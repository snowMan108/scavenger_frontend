import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Home, LeaderBoard } from './pages'
import Claim from './pages/Claim'
//import Reward from './pages/Rewards'

export default function App() {
  /**
   * Vite exposes env variables on the special import.meta.env object.
   * Basename needs to be set for GitHub Pages to function properly.
   *
   * @link https://vitejs.dev/guide/env-and-mode.html
   */
   const basename1 = import.meta.env.BASE_URL

  return (
    <BrowserRouter basename={basename1}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rewards" element={<Claim />} />
       
        <Route path="/leader-board" element={<LeaderBoard />} />
      
      </Routes>
    </BrowserRouter>
  )
}
