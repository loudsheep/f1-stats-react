import React, { useState, useEffect } from "react";
import './PossibleWinners.css';

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
                <> Loading... </>
            ) : (
                <>
                    <table className="winners-table">
                        <tr>
                            <th>Driver</th>
                            <th>Current Points</th>
                            <th>Theoretical Max Points</th>
                            <th>Can win?</th>
                        </tr>

                        {Object.keys(data).map((key, idx) => (
                            <tr key={idx} style={{color: data[key].color}}>
                                <td>{key}</td>
                                <td>{data[key].current_points}</td>
                                <td>{data[key].max_points}</td>
                                <td style={{color: data[key].can_win ? "green" : "red"}}>{data[key].can_win ? "Yes" : "Nah"}</td>
                            </tr>
                        ))}
                    </table>
                </>
            )}
        </div>
    );
}