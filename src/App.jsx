import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LineChart from './Charts/LineChart'
import Schedule from './Schedule/Schedule'
import './App.css'

export default function App() {

  return (
    <div className="App">
      {/* <Schedule></Schedule> */}

      <h2>Australian Grand Prix 2023 - Qualifying - P1 - VER 1:16.732</h2>
      <LineChart></LineChart>
    </div>
  )
}
