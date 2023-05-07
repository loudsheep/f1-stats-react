import { useState } from 'react';
import DriverLapTimesChart from '../components/Charts/DriverLapTimesChart';
import Schedule from '../components/Schedule/Schedule';
import './Results.css';
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png'

export default function Results() {
    const [season, setSeason] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [results, setResults] = useState(null);

    const [driverLaps, setDriverLaps] = useState(null);
    const [driverName, setDriverName] = useState(null);
    const [driverColor, setDriverColor] = useState(null);

    const getEventData = (e) => {
        let year = e.target.value;
        if (year == "") return;
        setSeason(year);

        (async () => {
            const response = await fetch(
                `http://localhost:8000/sessions?year=${year}`
            );
            const parsed = await response.json();
            setEvents(parsed.data);

            setSelectedEvent(null);
            setSelectedSession(null);
        })();
    };

    const selectEvent = (e) => {
        let event = e.target.value;
        if (event == "") return;

        for (let i in events) {
            if (events[i].RoundNumber == event) {
                setSelectedEvent(i);
                return;
            }
        }
    };

    const selectSession = (e) => {
        let session = e.target.value;
        if (session == "") return;

        setResults("loading");
        setSelectedSession(session);

        (async () => {
            const response = await fetch(
                `http://localhost:8000/results?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${session}`
            );
            const parsed = await response.json();
            setResults(parsed.data);
        })();
    };

    const selectDriver = (driver, color) => {
        setDriverLaps(null);
        setDriverName(null);
        setDriverColor(null);

        (async () => {
            const response = await fetch(
                `http://localhost:8000/laps?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${selectedSession}&driver=${driver}`
            );
            const parsed = await response.json();
            setDriverLaps(parsed.data);
            setDriverName(driver);
            setDriverColor(color);

            console.log(parsed.data);
        })();
    }

    return (
        <div className="Results">
          <Schedule></Schedule>
    
          <br />
    
          <div className="session-selector">
            <div className="select">
              Select Season:
              <select name="season" id="" onChange={getEventData}>
                <option value="">Select</option>
    
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </select>
            </div>
    
            <div className="select">
              Select Event:
              <select name="event" id="" placeholder='Select' onChange={selectEvent}>
                <option value="" selected>Event</option>
                {events.map((value, i) => (
                  <option value={value.RoundNumber}>{value.EventName}</option>
                ))}
              </select>
            </div>
    
            <div className="select">
              Select Session:
              <select name="session" id="" placeholder='Select' onChange={selectSession}>
                <option value="" selected>Session</option>
                {selectedEvent !== null && (
                  <>
                    {events[selectedEvent].Sessions.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
    
          {results === "loading" && (
            <>
              <img className="loading-tire" src={f1Tire} alt="" />
            </>
          )}
    
          {Array.isArray(results) && (
            <div>
              <h2>Seession Results</h2>
    
              <table>
                <tr>
                  <th>Position</th>
                  <th>Driver Name</th>
                  <th>Team Name</th>
                  <th>Points</th>
                  <th>Status</th>
                </tr>
    
                {results.map((value) => (
                  <tr style={{ color: '#' + value.TeamColor }} onClick={() => selectDriver(value.Abbreviation, value.TeamColor)}>
                    <td>{value.Position}</td>
                    <td>{value.FullName}</td>
                    <td>{value.TeamName}</td>
                    <td>{value.Points}</td>
                    <td>{value.Status}</td>
                  </tr>
                ))}
              </table>
            </div>
          )}
    
          {/* <h2>Australian Grand Prix 2023 - Qualifying - P1 - VER 1:16.732</h2> */}
          {/* <LineChart></LineChart> */}
          {driverLaps !== null && (
            <DriverLapTimesChart lapTimes={driverLaps} driver={driverName} color={"#" + driverColor}></DriverLapTimesChart>
          )}
        </div>
      )
}