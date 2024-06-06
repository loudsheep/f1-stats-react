import React, { useEffect, useState } from "react";
import LapsLedCharts from "../components/Charts/General/LapsLedChart";
import '../css/PossibleWinners.css';
import DriverComparison from "../components/DriverComparison";

export default function PossibleWinners() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/winners`
            );
            const parsed = await response.json();
            setData(parsed.data);
        })();
    }, []);

    return (
        <div>
            {data == null ? (
                <div className="loading-text"> Loading... </div>
            ) : (
                <>
                    <table className="winners-table">
                        <tr>
                            <th>Driver</th>
                            <th>Current Points</th>
                            <th>Theoretical Max Points</th>
                            <th>Wins</th>
                            <th>Can win?</th>
                        </tr>

                        {Object.keys(data).map((key, idx) => (
                            <tr key={idx} style={{color: data[key].color}}>
                                <td>{key}</td>
                                <td>{data[key].current_points}</td>
                                <td>{data[key].max_points}</td>
                                <td>{data[key].wins}</td>
                                <td style={{color: data[key].can_win ? "green" : "red"}}>{data[key].can_win ? "Yes" : "Nah (max " + data[key].max_position + " place)"}</td>
                            </tr>
                        ))}
                    </table>
                </>
            )}

            <hr />
            <h2>{window.getFullYear()} Season Statistics compare</h2>
            <br />

            {/* <LapsLedCharts className={"laps-chart"}></LapsLedCharts> */}
            <DriverComparison></DriverComparison>
        </div>
    );
}