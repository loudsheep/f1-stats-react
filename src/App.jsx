import { useState } from 'react'
import reactLogo from './assets/react.svg'
import LineChart from './Charts/LineChart'
import Schedule from './Schedule/Schedule'
import './App.css'

export default function App() {

  const [season, setSeason] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    })();
  };

  const selectEvent = (e) => {
    let event = e.target.value;
    for (let i in events) {
      if (events[i].RoundNumber == event) {
        setSelectedEvent(i);
        return;
      }
    }
  };

  const selectSession = (e) => {
    let session = e.target.value;
    console.log("SELECTED SESSION " + session);

    (async () => {
      const response = await fetch(
        `http://localhost:8000/drivers?year=${season}&event=${events[selectedEvent].RoundNumber}&session=${session}`
      );
      const parsed = await response.json();
      // setEvents(parsed.data);
      
      // setSelectedEvent(null);
      for(let i of parsed.data) {
        console.log(i.Abbreviation);
      }
    })();
  };

  return (
    <div className="App">
      <Schedule></Schedule>

      <div>
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

        Select Event:
        <select name="event" id="" placeholder='Select' onChange={selectEvent}>
          {events.map((value, i) => (
            <option value={value.RoundNumber}>{value.EventName}</option>
          ))}
        </select>

        Select Session:
        <select name="session" id="" placeholder='Select' onChange={selectSession}>
          {selectedEvent !== null && (
            <>
              {events[selectedEvent].Sessions.map((value) => (
                <option value={value}>{value}</option>
              ))}
            </>
          )}
        </select>
      </div>

      {/* <h2>Australian Grand Prix 2023 - Qualifying - P1 - VER 1:16.732</h2> */}
      <LineChart></LineChart>
    </div>
  )
}
