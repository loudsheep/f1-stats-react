import React, { useState, useEffect } from "react";
import './Schedule.css';

export default function Schedule() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                "http://localhost:8000/schedule"
            );
            const parsed = await response.json();
            setData(parsed);
            console.log(parsed);
        })();
    }, []);

    return (
        <>
            {data == null ? (
                <> Loading... </>
            ) : (
                <>
                    <div className="next-round">
                        <h3>Next round: {data.data[0].OfficialEventName}</h3>
                        {new Date(data.data[0].EventDate).toDateString()}
                    </div>
                </>
            )}
        </>
    );
}