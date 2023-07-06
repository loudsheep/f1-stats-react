import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5xy from "@amcharts/amcharts5/xy";
import { useLayoutEffect } from "react";

export default function SpeedComparisonChart({ title, trackMap, speedData }) {
    const map = (value, inputStart, inputEnd, outputStart, outputEnd) => {
        return outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (value - inputStart);
    }

    const interpolateSpeedForDistance = (targetDistance, speedData) => {
        for (let i = 0; i < speedData.length - 1; i++) {
            let t1 = speedData[i];
            let t2 = speedData[i + 1];

            if (t1.X <= targetDistance && targetDistance < t2.X) {
                return map(targetDistance, t1.X, t2.X, t1.Y, t2.Y);
            }
        }

        return speedData[speedData.length - 1].Y;
    };

    const findDataMinAndMax = (data, key = "Y") => {
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;

        for (let i of data) {
            if (i[key] < min) {
                min = i[key];
            }
            if (i[key] > max) {
                max = i[key]
            }
        }

        return {
            min: min,
            max: max,
        };
    };

    const createChart = (id, track, speedData) => {
        let root = am5.Root.new(id);

        // root.interfaceColors.set("grid", am5.color("#fff"));
        // root.interfaceColors.set("text", am5.color("#fff"));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        track = JSON.parse(JSON.stringify(track));
        let speed1 = speedData[0];

        for (let i in track) {
            let X = speed1.data[i].X;
            let speed = speed1.data[i].Y;
            let color = speed1.color;

            for (let s = 1; s < speedData.length; s++) {
                let speedTmp = speedData[s];

                let interpolatedSpeed = interpolateSpeedForDistance(X, speedTmp.data);
                if (interpolatedSpeed >= speed) {
                    speed = interpolatedSpeed;
                    color = speedTmp.color;
                }
            }

            track[i].strokeSettings = {
                stroke: am5.color(color),
            }
        }

        let xDiff = findDataMinAndMax(track, "X");
        let yDiff = findDataMinAndMax(track, "Y");
        let higherDiff = xDiff.max - xDiff.min > yDiff.max - yDiff.min ? xDiff : yDiff;
        let ratioX = (higherDiff.max - higherDiff.min) / (xDiff.max - xDiff.min);
        let ratioY = (higherDiff.max - higherDiff.min) / (yDiff.max - yDiff.min);

        let extraSpace = (higherDiff.max - higherDiff.min) * 0.1;

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                visible: false,
                max: xDiff.max * ratioX + extraSpace,
                min: xDiff.min * ratioX - extraSpace,
                strictMinMax: true,
            })
        );

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                // syncWithAxis: xAxis,
                visible: false,
                max: yDiff.max * ratioY + extraSpace,
                min: yDiff.min * ratioY - extraSpace,
                strictMinMax: true,
            })
        );
        // Create series
        let series = chart.series.push(
            am5xy.SmoothedXYLineSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Y",
                valueXField: "X",
                stroke: am5.color("#fff"),
                fill: am5.color("#ff0000"),
            })
        );
        series.data.setAll(track);

        series.strokes.template.setAll({
            strokeWidth: 6.5,
            templateField: "strokeSettings",
        });

        let exporting = am5plugins_exporting.Exporting.new(root, {
            menu: am5plugins_exporting.ExportingMenu.new(root, {

            }),
            pngOptions: {
                quality: 1,
                maintainPixelRatio: true
            }
        });

        return () => {
            root.dispose();
        };
    };

    useLayoutEffect(() => {
        let chart = createChart("speed-chart", trackMap, speedData);

        return () => {
            chart();
        }
    });

    return <>
        <div style={{ textAlign: "center", width: "50%" }}>
            {title != null && (
                <h2>{title}</h2>
            )}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {speedData.map((value, idx) => (
                    <div key={idx} style={{ color: value.color, backgroundColor: value.color + "50", margin: "5px 0.5rem", borderRadius: "5px", padding: "1px", minWidth: "200px" }}>
                        {value.displayName}
                    </div>
                ))}
            </div>
            <div id="speed-chart" className="chart" style={{ width: "100%", aspectRatio: 1, marginBottom: "50px" }}></div>
        </div>
    </>;
}