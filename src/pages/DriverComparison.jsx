import '../css/DriverComparison.css';

import BarChart from "../components/Charts/BarChart";
import { useState } from 'react';

export default function DriverComparison() {
    const [title, setTitle] = useState(null);
    const [driverData, setDriverData] = useState([]);
    const [teamData, setTeamData] = useState([]);

    const changeComparingStat = (e) => {
        setTitle(e.target.value);
        let category = e.target.value;

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/compare/${category}`
            );
            const parsed = await response.json();
            setDriverData(parsed.data);

            let teams = JSON.parse(JSON.stringify(parsed.data));

            teams = teams.reduce((accumulator, currentValue) => {
                let existing = accumulator.find(n => n.team === currentValue.team);
                if (existing) {
                    existing.value += currentValue.value
                } else {
                    accumulator.push(currentValue)
                }
                return accumulator
            }, [])

            setTeamData(teams);
        })();
    };

    return (
        <>
            <div className="selector">
                <div className="select">
                    {/* Select Season: */}
                    <select name="season" id="" onChange={changeComparingStat} className="select-elem">
                        <option value="">Select Statistic</option>

                        <option value="leader">Laps leader</option>
                        <option value="wins">Wins</option>
                        <option value="podiums">Podiums</option>
                        <option value="top10">TOP 10 finishes</option>
                        <option value="best">Best result</option>
                        <option value="worst">Worst result</option>
                        <option value="poles">Pole positions</option>
                    </select>
                </div>
            </div>

            <div className="chart-container">
                <div className="bar-chart">
                    <BarChart title={title + " by driver"} id="1" data={driverData} sort={true} reverseSort={false} categoryKey='driver'></BarChart>
                </div>
                <div className="bar-chart">
                    <BarChart title={title + " by team"} id="2" data={teamData} sort={true} reverseSort={false} categoryKey='team'></BarChart>
                </div>
            </div>
        </>
    );
}