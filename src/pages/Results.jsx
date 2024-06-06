import { useState } from 'react';
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png';
import DriverLapTimesChart from '../components/Charts/DriverLapTimesChart';
import Schedule from '../components/Schedule/Schedule';
import '../css/Results.css';

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
                window.getBackendURL() + `/sessions/${year}`
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
                break;
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
                window.getBackendURL() + `/results/${season}/${events[selectedEvent].RoundNumber}/${session}`
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
                window.getBackendURL() + `/laps/${season}/${events[selectedEvent].RoundNumber}/${selectedSession}/${driver}`
            );
            const parsed = await response.json();
            setDriverLaps(parsed.data);
            setDriverName(driver);
            setDriverColor(color);
        })();
    }

    return (
        <div className="Results">
            <Schedule></Schedule>

            <br />

            <div className="selector">
                <div className="select">
                    {/* Select Season: */}
                    <select name="season" id="" onChange={getEventData} className="select-elem">
                        <option value="">Select Season</option>

                        {window.yearSelectOptions().map((value) => (
                            <option value={value}>{value}</option>
                        ))}
                    </select>
                </div>

                <div className="select">
                    {/* Select Event: */}
                    <select name="event" id="" placeholder='Select' onChange={selectEvent} className="select-elem">
                        <option value="" selected>Select Event</option>
                        {events.map((value, idx) => (
                            <option value={value.RoundNumber} key={idx}>{value.EventName}</option>
                        ))}
                    </select>
                </div>

                <div className="select">
                    {/* Select Session: */}
                    <select name="session" id="" placeholder='Select' onChange={selectSession} className="select-elem">
                        <option value="" selected>Select Session</option>
                        {selectedEvent !== null && (
                            <>
                                {events[selectedEvent].Sessions.map((value, idx) => (
                                    <option value={value} key={idx}>{value}</option>
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
                <div style={{marginBottom: "10px"}}>
                    <h2>Seession Results</h2>

                    <table>
                        <tr>
                            <th>Position</th>
                            <th>Driver Name</th>
                            <th>Team Name</th>
                            <th>Points</th>
                            <th>Status</th>
                        </tr>

                        {results.map((value, idx) => (
                            <tr style={{ color: '#' + value.TeamColor }} onClick={() => selectDriver(value.Abbreviation, value.TeamColor)} key={idx}>
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