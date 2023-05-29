import { useState } from 'react';
import myData from '../../assets/testData1.json';
import myData2 from '../../assets/testData2.json';
import LinearChart from './Telemetry/LinearChart';

export default function DriverTelemetryComparison() {
    const data = [
        { color: "#0000ff", name: "VER", data: myData.speed },
        { color: "#c40000", name: "LEC", data: myData2.speed },
    ];

    const [title, setTitle] = useState("Speed data");

    return <>
        <LinearChart title={title} chartData={data}></LinearChart>

        <button onClick={() => {
            setTitle("Some random text" + Math.random()) 
        }}>TEXT</button>
    </>
}