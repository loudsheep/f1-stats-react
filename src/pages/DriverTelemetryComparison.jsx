import { useState } from 'react';
import DriverLapTimesChart from '../components/Charts/DriverLapTimesChart';
import LinearChart from '../components/Charts/Telemetry/LinearChart';
import MiniSectorsChart from '../components/Charts/Telemetry/MiniSectorsChart';
import './DriverTelemetryComparison.css';
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png';
import SpeedComparisonChart from '../components/Charts/Telemetry/SpeedComparisonChart';

export default function DriverTelemetryComparison() {
    const colors = ["#FF00AA", "#00FFAA", "#FFAA00", "#AA00FF", "#00AAFF", "#AAFF00", "#FF5500", "#0055FF", "#FF0055", "#55FF00"];

    const [season, setSeason] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [results, setResults] = useState(null);

    const [driverLaps, setDriverLaps] = useState(null);
    const [driverName, setDriverName] = useState(null);
    const [driverColor, setDriverColor] = useState(null);

    const [speedData, setSpeedData] = useState([]);
    const [gearData, setGearData] = useState([]);
    const [throttleData, setThrottleData] = useState([]);
    const [rpmData, setRpmData] = useState([]);

    const [trackMap, setTrackMap] = useState(null);
    const [timingData, setTimingData] = useState([])

    const clearLapTimesChartAndDrivers = () => {
        setDriverLaps(null);
        setDriverColor(null);
        setDriverName(null);
        setResults(null);
    };

    const clearTelemetryCharts = () => {
        setSpeedData([]);
        setGearData([]);
        setTimingData([]);
        setThrottleData([]);
        setRpmData([]);
        setTrackMap(null);
    };

    const getEventData = (e) => {
        clearLapTimesChartAndDrivers();
        clearTelemetryCharts();
        let year = e.target.value;
        if (year == "") return;
        setSeason(year);

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/sessions?year=${year}`
            );
            const parsed = await response.json();
            setEvents(parsed.data);

            setSelectedEvent(null);
            setSelectedSession(null);
        })();
    };

    const selectEvent = (e) => {
        clearLapTimesChartAndDrivers();
        clearTelemetryCharts();
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
        clearLapTimesChartAndDrivers();
        let session = e.target.value;
        if (session == "") return;

        setResults("loading");
        setSelectedSession(session);

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/results?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${session}`
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
                window.getBackendURL() + `/laps?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${selectedSession}&driver=${driver}`
            );
            const parsed = await response.json();
            setDriverLaps(parsed.data);
            setDriverName(driver);
            setDriverColor(color);
        })();
    }

    const addLapTelemetryToChart = (lap) => {
        console.log(season, selectedEvent, selectedSession, driverName, driverColor, lap);

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/telemetry?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${selectedSession}&driver=${driverName}&lap=${lap}`
            );
            let parsed = await response.json();

            let sd = JSON.parse(JSON.stringify(speedData));
            sd.push({
                color: "#" + driverColor,
                name: driverName,
                data: parsed.data.speed,
                displayName: "Lap " + lap + " - " + selectedSession + " - " + driverName
            });
            setSpeedData(sd);

            let gd = JSON.parse(JSON.stringify(gearData));
            gd.push({
                color: "#" + driverColor,
                name: driverName,
                data: parsed.data.gear,
                displayName: "Lap " + lap + " - " + selectedSession + " - " + driverName
            });
            setGearData(gd);

            let rd = JSON.parse(JSON.stringify(rpmData));
            rd.push({
                color: "#" + driverColor,
                name: driverName,
                data: parsed.data.rpm,
                displayName: "Lap " + lap + " - " + selectedSession + " - " + driverName
            });
            setRpmData(rd);

            let th = JSON.parse(JSON.stringify(throttleData));
            th.push({
                color: "#" + driverColor,
                name: driverName,
                data: parsed.data.throttle,
                displayName: "Lap " + lap + " - " + selectedSession + " - " + driverName
            });
            setThrottleData(th);

            setTrackMap(parsed.data.track_map);
            let td = JSON.parse(JSON.stringify(timingData));
            td.push({
                color: "#" + driverColor,
                name: driverName,
                data: parsed.data.time,
                displayName: "Lap " + lap + " - " + selectedSession + " - " + driverName
            });
            setTimingData(td);
        })();
    };

    const removeLapTelemetryFromChart = (elem) => {
        let sd = JSON.parse(JSON.stringify(speedData));
        let idx = speedData.indexOf(elem);
        sd.splice(idx, 1);
        setSpeedData(sd);

        let gd = JSON.parse(JSON.stringify(gearData));
        gd.splice(idx, 1);
        setGearData(gd);

        let rd = JSON.parse(JSON.stringify(rpmData));
        rd.splice(idx, 1);
        setRpmData(rd);

        let th = JSON.parse(JSON.stringify(throttleData));
        th.splice(idx, 1);
        setThrottleData(th);

        let td = JSON.parse(JSON.stringify(timingData));
        td.splice(idx, 1);
        setTimingData(td);

        if (td.length == 0) {
            setTrackMap(null);
        }
    }

    return <>
        <div className="selector">
            <div className="select">
                {/* Select Season: */}
                <select name="season" id="" onChange={getEventData} className="select-elem">
                    <option value="">Select Season</option>

                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
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

        <div className="driver-select-container">
            {Array.isArray(results) && (
                <>
                    <h2>Select a driver:</h2>
                    <div className="driver-select">
                        {results.map((value, idx) => (
                            <div className="driver" style={{ color: '#' + value.TeamColor, borderColor: '#' + value.TeamColor }} onClick={() => selectDriver(value.Abbreviation, value.TeamColor)}>
                                {value.Abbreviation}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

        <div style={{ width: "90%", height: "500px", marginBottom: "50px", border: "2px solid #ffffff42", margin: "0 auto" }}>
            {driverLaps !== null && (
                <DriverLapTimesChart lapTimes={driverLaps} driver={driverName} color={"#" + driverColor} onClickLapNumber={addLapTelemetryToChart}></DriverLapTimesChart>
            )}
        </div>

        <hr />

        <div className="selected-laps">
            {speedData.map((value, idx) => (
                <div className="selected-lap" style={{ color: value.color, backgroundColor: value.color + "50" }} onClick={() => removeLapTelemetryFromChart(value)}>{value.displayName}</div>
            ))}
        </div>

        <br />

        <div className="chart-container">
            <LinearChart id={1} title={"Speed"} chartData={speedData} labelPostFix=' km/h' yAxisLabel={"Speed (km/h)"} xAxisLabel={"Distance (m)"}></LinearChart>

            <LinearChart id={2} title={"Gear"} chartData={gearData} style={{ width: "100%", height: "250px", marginBottom: "50px" }} xAxisLabel={"Distance (m)"} yAxisLabel={"Gear"}></LinearChart>

            <LinearChart id={3} title={"Throttle"} chartData={throttleData} style={{ width: "100%", height: "250px", marginBottom: "50px" }} labelPostFix='%' xAxisLabel={"Distance (m)"} yAxisLabel={"Throttle (%)"}></LinearChart>

            <LinearChart id={4} title={"RPM"} chartData={rpmData} style={{ width: "100%", height: "250px", marginBottom: "50px" }} xAxisLabel={"Distance (m)"} yAxisLabel={"RPM"}></LinearChart>
        </div>


        {trackMap != null && (
            <div className="chart-container">
                <div style={{ display: "flex" }}>
                    <MiniSectorsChart title={"10 Mini sectors"} trackMap={trackMap} timeData={timingData} miniSectorCount={10}></MiniSectorsChart>
                    <SpeedComparisonChart title={"Speed comparison"} trackMap={trackMap} speedData={speedData}></SpeedComparisonChart>
                </div>
            </div>
        )}
    </>
}