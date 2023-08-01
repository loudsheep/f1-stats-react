import '../css/DriverComparison.css';
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png';
import BarChart from "./Charts/BarChart";
import { useEffect, useState } from 'react';

export default function DriverComparison() {
    const [title, setTitle] = useState(null);
    const [driverData, setDriverData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [sortReverse, setSortReverse] = useState(false);

    const changeComparingStat = (e) => {
        setSortReverse(false);
        let t = "";
        switch (e.target.value) {
            case "wins": t = "Wins"; break;
            case "podiums": t = "Podiums"; break;
            case "best": t = "Best result"; setSortReverse(true); break;
            case "worst": t = "Worst result"; setSortReverse(true); break;
            case "top10": t = "Top 10 finishes"; break;
            case "leader": t = "Laps led"; break;
            case "poles": t = "Pole positions"; break;

            default:
                return;
        }
        setTitle(t);

        let category = e.target.value;
        setDriverData("loading");
        setTeamData("loading");

        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/compare/${category}`
            );
            const parsed = await response.json();
            setDriverData(parsed.data);

            setTeamData(sumDataForTeamsChart(parsed.data, category != "best" && category != "worst", category == "worst"));
        })();
    };

    const sumDataForTeamsChart = (data, sum = true, greaterValue = false) => {
        data = JSON.parse(JSON.stringify(data));

        data = data.reduce((accumulator, currentValue) => {
            let existing = accumulator.find(n => n.team === currentValue.team);
            if (existing) {
                if (sum) {
                    existing.value += currentValue.value
                } else {
                    if (greaterValue) {
                        existing.value = existing.value > currentValue.value ? existing.value : currentValue.value;
                    } else {
                        existing.value = existing.value < currentValue.value ? existing.value : currentValue.value;
                    }
                }
            } else {
                accumulator.push(currentValue)
            }
            return accumulator
        }, [])

        return data;
    }

    useEffect(() => {
        let category = "wins";
        setDriverData("loading");
        setTeamData("loading");
        setTitle("Wins");

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
    }, []);

    return (
        <>
            <div className="selector">
                <div className="select">
                    Select category to compare:
                    <select name="season" id="" onChange={changeComparingStat} className="select-elem">
                        <option value="">Select Statistic</option>

                        <option value="leader">Laps lead</option>
                        <option value="wins" selected>Wins</option>
                        <option value="poles">Pole positions</option>
                        <option value="podiums">Podiums</option>
                        <option value="top10">Top 10 finishes</option>
                        <option value="best">Best result</option>
                        <option value="worst">Worst result</option>
                    </select>
                </div>
            </div>

            <div className="chart-container2">
                <div className="bar-chart">
                    {driverData === "loading" ? (
                        <img className="loading-tire" src={f1Tire} alt="" />
                    ) : (
                        <BarChart title={title + " by driver"} id="1" data={driverData} sort={true} reverseSort={sortReverse} categoryKey='driver'></BarChart>
                    )}
                </div>
                <div className="bar-chart">
                    {teamData === "loading" ? (
                        <img className="loading-tire" src={f1Tire} alt="" />
                    ) : (
                        <BarChart title={title + " by team"} id="2" data={teamData} sort={true} reverseSort={sortReverse} categoryKey='team'></BarChart>
                    )}
                </div>
            </div>
        </>
    );
}