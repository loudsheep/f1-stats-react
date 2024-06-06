import { useState } from 'react';
import DriverLapTimesChart from '../components/Charts/DriverLapTimesChart';
import LinearChart from '../components/Charts/Telemetry/LinearChart';
import MiniSectorsChart from '../components/Charts/Telemetry/MiniSectorsChart';
import '../css/Telemetry.css';
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png';
import SpeedComparisonChart from '../components/Charts/Telemetry/SpeedComparisonChart';

export default function DriverTelemetryComparison() {
    const colors = ["#dddddd", "#FF00AA", "#00FFAA", "#FFAA00", "#AA00FF", "#00AAFF", "#AAFF00", "#FF5500", "#0055FF", "#FF0055", "#55FF00"];

    const [season, setSeason] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [results, setResults] = useState(null);

    const [driverLaps, setDriverLaps] = useState(null);
    const [driverLapsToShow, setDriverLapsToShow] = useState(null);
    const [fastestLapNumber, setFastestLapNumber] = useState(null);
    const [showInvalidLaps, setShowInvalidLaps] = useState(false);
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
                window.getBackendURL() + `/sessions/${year}`
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
            setDriverLaps("loading");
            const response = await fetch(
                window.getBackendURL() + `/laps/${season}/${events[selectedEvent].RoundNumber}/${selectedSession}/${driver}`
            );
            const parsed = await response.json();
            setDriverLaps(parsed.data);
            setDriverLapsToShow(parsed.data.filter((x) => {
                if (x["IsAccurate"]) return true;
                return showInvalidLaps;
            }))
            setDriverName(driver);
            setDriverColor(color);

            let minIdx = -1;
            let minValue = Number.POSITIVE_INFINITY;
            for (let i = 0; i < parsed.data.length; i++) {
                const element = parsed.data[i];
                if (element["IsAccurate"] && element["LapTime"] < minValue) {
                    minIdx = i;
                    minValue = element["LapTime"];
                }
            }

            setFastestLapNumber(parsed.data[minIdx]["LapNumber"]);
        })();
    }

    const pickFirstNotUsedColor = () => {
        for (let c of colors) {
            let used = false;
            for (let t of timingData) {
                if (t["color"] == c) {
                    used = true;
                    break;
                }
            }

            if (!used) {
                return c;
            }
        }

        return "#000";
    };

    const checkForColor = (driverColor) => {
        console.log("ckecking");
        if (timingData.length == 0) return driverColor;

        for (let t of timingData) {
            console.log(t, t["color"]);
            if (t["color"] == driverColor) {
                return pickFirstNotUsedColor();
            }
        }

        return driverColor;
    }

    const addLapTelemetryToChart = (lap) => {
        console.log(season, selectedEvent, selectedSession, driverName, driverColor, lap);

        let color = checkForColor("#" + driverColor);
        let displayName = "Lap " + lap + " - " + selectedSession + " - " + driverName;

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/telemetry/${season}/${events[selectedEvent].RoundNumber}/${selectedSession}/${driverName}/${lap}`
            );
            let parsed = await response.json();

            let sd = JSON.parse(JSON.stringify(speedData));
            sd.push({
                color,
                name: driverName,
                data: parsed.data.speed,
                displayName,
            });
            setSpeedData(sd);

            let gd = JSON.parse(JSON.stringify(gearData));
            gd.push({
                color,
                name: driverName,
                data: parsed.data.gear,
                displayName,
            });
            setGearData(gd);

            let rd = JSON.parse(JSON.stringify(rpmData));
            rd.push({
                color,
                name: driverName,
                data: parsed.data.rpm,
                displayName,
            });
            setRpmData(rd);

            let th = JSON.parse(JSON.stringify(throttleData));
            th.push({
                color,
                name: driverName,
                data: parsed.data.throttle,
                displayName,
            });
            setThrottleData(th);

            if (trackMap == null) {
                setTrackMap(parsed.data.track_map);
            }
            let td = JSON.parse(JSON.stringify(timingData));
            td.push({
                color,
                name: driverName,
                data: parsed.data.time,
                displayName,
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
    };

    const toggleInvalidLaps = () => {
        let show = !showInvalidLaps;
        setShowInvalidLaps(!showInvalidLaps);

        setDriverLapsToShow(driverLaps.filter((x) => {
            if (x["IsAccurate"]) return true;
            return show;
        }))
    }

    return <>
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
            <img className="loading-tire" src={f1Tire} alt="" />
        )}

        <div className="driver-select-container">
            {Array.isArray(results) && (
                <>
                    <h2>Select a driver:</h2>
                    <div className="driver-select">
                        {results.map((value, idx) => (
                            <div key={idx} className="driver" style={{ color: '#' + value.TeamColor, borderColor: '#' + value.TeamColor }} onClick={() => selectDriver(value.Abbreviation, value.TeamColor)}>
                                {value.Abbreviation}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

        <div style={{ width: "90%", height: "500px", marginBottom: "50px", border: "2px solid #ffffff42", margin: "0 auto" }}>
            {(driverLaps !== null && driverLaps !== "loading") && (
                <DriverLapTimesChart lapTimes={driverLapsToShow} driver={driverName} color={"#" + driverColor} title={season + " " + events[selectedEvent]["EventName"] + " - " + selectedSession + " - " + driverName + " lap times"} onClickLapNumber={addLapTelemetryToChart}></DriverLapTimesChart>
            )}

            {driverLaps === "loading" && (
                <img className="loading-tire" src={f1Tire} alt="" />
            )}
        </div>

        <div style={{ width: "90%", margin: "0 auto", textAlign: "center" }}>
            <button className='button' disabled={!(driverLaps !== null && driverLaps !== "loading")} onClick={() => { addLapTelemetryToChart(fastestLapNumber) }}>Select fastest lap</button>

            <button className='button' disabled={!(driverLaps !== null && driverLaps !== "loading")} onClick={toggleInvalidLaps}>{showInvalidLaps ? "Hide inaccurate laps" : "Show inaccurate laps"}</button>
        </div>

        <hr />

        <div className="selected-laps">
            {speedData.map((value, idx) => (
                <div key={idx} className="selected-lap" style={{ color: value.color, backgroundColor: value.color + "50" }} onClick={() => removeLapTelemetryFromChart(value)}>{value.displayName}</div>
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
                    <MiniSectorsChart title={"20 Mini sectors"} trackMap={trackMap} timeData={timingData} miniSectorCount={20}></MiniSectorsChart>
                    <SpeedComparisonChart title={"Speed comparison"} trackMap={trackMap} speedData={speedData}></SpeedComparisonChart>
                </div>
            </div>
        )}
    </>
}