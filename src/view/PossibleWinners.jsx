import React, { useState, useEffect } from "react";

export default function PossibleWinners() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                `http://${window.backendServerAddress}:8000/winners`
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
                    <table>
                        <tr>
                            <th>Driver</th>
                            <th>Current Points</th>
                            <th>Theoretical Max Points</th>
                            <th>Can win?</th>
                        </tr>

                        {Object.keys(data).map((key, idx) => (
                            <tr key={idx}>
                                <td>{key}</td>
                                <td>{data[key].current_points}</td>
                                <td>{data[key].max_points}</td>
                                <td>{data[key].can_win ? "Yes" : "Nah"}</td>
                            </tr>
                        ))}
                    </table>
                </>
            )}
        </div>
    );
}