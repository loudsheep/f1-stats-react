import React, { useState, useEffect } from "react";

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
                    {data.data.map((val) => (
                        <>
                            <h3>{val.RoundNumber}. {val.OfficialEventName}</h3>
                        </>
                    ))}
                </>
            )}
        </>
    );
}