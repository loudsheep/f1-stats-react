import './App.css';
import React from "react";
import { Routes, Route } from "react-router-dom";
import Results from './Results';
import SeasonHeatMap from './SeasonHeatMap';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />
        <Route path="/results" element={<Results />} />
        <Route path="/season-standings" element={<SeasonHeatMap />} />
      </Routes>
    </div>
  )
}
