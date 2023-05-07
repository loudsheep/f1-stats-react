import './App.css';
import React from "react";
import { Routes, Route, NavLink, } from "react-router-dom";
import Results from './Results';
import SeasonHeatMap from './SeasonHeatMap';
import LineChart from '../components/Charts/LineChart';
import PossibleWinners from './PossibleWinners';

export default function App() {
  return (
    <div className="App">
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
          to={`/demo`}
          className={({ isActive, isPending }) =>
            isActive
              ? "active"
              : isPending
                ? "pending"
                : ""
          }
        >
          Demo
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />
        <Route path="/results" element={<Results />} />
        <Route path="/winners" element={<PossibleWinners />} />
        <Route path="/season-standings" element={<SeasonHeatMap />} />
        <Route path="/demo" element={<LineChart />} />
      </Routes>
    </div>
  )
}
