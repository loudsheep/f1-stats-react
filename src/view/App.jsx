import './App.css';
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Results from '../pages/Results';
import SeasonHeatMap from '../pages/SeasonHeatMap';
import PossibleWinners from '../pages/PossibleWinners';
import DriverTelemetryComparison from '../pages/DriverTelemetryComparison';
import MainPage from '../pages/MainPage';
// import TimeDeltaChart from '../components/Charts/Telemetry/TimeDeltaChart';

export default function App() {

  return (
    <div className="App">
      <div className='logo'>
        <span className='part1'>F1</span> Stats
      </div>
      <nav>
        <NavLink
          to={`/results`}
          className={({ isActive, isPending }) =>
            isActive
              ? "active"
              : isPending
                ? "pending"
                : ""
          }
        >
          Results
        </NavLink>

        <NavLink
          to={`/winners`}
          className={({ isActive, isPending }) =>
            isActive
              ? "active"
              : isPending
                ? "pending"
                : ""
          }
        >
          Possible WDC winners
        </NavLink>

        <NavLink
          to={`/season-standings`}
          className={({ isActive, isPending }) =>
            isActive
              ? "active"
              : isPending
                ? "pending"
                : ""
          }
        >
          Standings HeatMap
        </NavLink>

        <NavLink
          to={`/telemetry`}
          className={({ isActive, isPending }) =>
            isActive
              ? "active"
              : isPending
                ? "pending"
                : ""
          }
        >
          Telemetry
        </NavLink>
      </nav>

      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/winners" element={<PossibleWinners />} />
        <Route path="/season-standings" element={<SeasonHeatMap />} />
        <Route path="/telemetry" element={<DriverTelemetryComparison />} />
        {/* <Route path="/demo" element={<TimeDeltaChart />} /> */}
      </Routes>
    </div>
  )
}
