import React, { useEffect, useState } from "react";
import './Schedule.css';

export default function Schedule() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/schedule`
            );
            const parsed = await response.json();
            setData(parsed);
        })();
    }, []);

    return (
        <>
            {data == null ? (
                <> Loading... </>
            ) : (
                <>
                    <div className="next-round">
                        <div className="flag flag1"><img src={"https://flagcdn.com/h120/" + data.data[0].CountryCode.toLowerCase() + ".png"} alt="" /></div>

                        <div>
                            <h3>Next round: {data.data[0].OfficialEventName}</h3>
                            {new Date(data.data[0].EventDate).toDateString()}
                        </div>

                        <div className="flag flag2"><img src={"https://flagcdn.com/h120/" + data.data[0].CountryCode.toLowerCase() + ".png"} alt="" /></div>
                    </div>
                </>
            )}
        </>
    );
}