import { useState } from 'react';
import myData from '../../assets/testData1.json';
import myData2 from '../../assets/testData2.json';
import LinearChart from './Telemetry/LinearChart';
import MiniSectorsChart from './Telemetry/MiniSectorsChart';

export default function DriverTelemetryComparison() {
    const data = [
        { color: "#0000ff", name: "VER", data: myData.speed },
        { color: "#c40000", name: "LEC", data: myData2.speed },
    ];

    const data2 = [
        { color: "#0000ff", name: "VER", data: myData.gear },
        { color: "#c40000", name: "LEC", data: myData2.gear },
    ];

    const trackData = [
        { color: "#0000ff", name: "VER", data: myData.time },
        { color: "#c40000", name: "LEC", data: myData2.time },
    ];

    return <>
        <LinearChart title={"Speed data VER - LEC"} chartData={data}></LinearChart>
        <LinearChart title={"Gear data VER - LEC"} chartData={data2}></LinearChart>
        <MiniSectorsChart title={"Mini sectors VER - LEC"} trackMap={myData.track_map} timeData={trackData}></MiniSectorsChart>
    </>
}