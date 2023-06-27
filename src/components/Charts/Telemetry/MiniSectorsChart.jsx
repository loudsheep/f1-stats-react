import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export default function MiniSectorsChart({ title, trackMap, timeData, miniSectorCount = 20 }) {

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

    const createChart = (id, track, timeData, miniSectorsCount) => {
        let root = am5.Root.new(id);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
                pinchZoomX: false,
                pinchZoomY: false,
            })
        );

        chart.zoomOutButton.set("forceHidden", true);

        let timeMinMax = findDataMinAndMax(timeData[0].data, "X");
        let miniSectorDistance = timeMinMax.max / miniSectorsCount;

        track = JSON.parse(JSON.stringify(track));

        let sectorColors = [];
        for (let i = 0; i < miniSectorsCount + 1; i++) {
            sectorColors.push({
                color: "#000000",
                time: Number.POSITIVE_INFINITY,
            })
        }

        for (let time of timeData) {
            let sectorTmpTime = 0;
            let currentSector = 0;
            let sectors = [];
            for (let i of time.data) {
                let sec = Math.floor(i.X / miniSectorDistance);
                if (sec != currentSector) {
                    sectors.push(i.Y - sectorTmpTime);
                    if (sectorColors[currentSector].time > i.Y - sectorTmpTime) {
                        sectorColors[currentSector] = {
                            color: time.color,
                            time: i.Y - sectorTmpTime,
                        }
                    }
                    sectorTmpTime = i.Y;
                    currentSector = sec;
                }
            }
        }

        for (let i in track) {
            let sec = Math.floor(timeData[timeData.length - 1].data[i].X / miniSectorDistance);

            track[i].strokeSettings = {
                stroke: am5.color(sectorColors[sec].color),
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
                min: yDiff.min * ratioX - extraSpace,
                strictMinMax: true,
            })
        );

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                syncWithAxis: xAxis,
                visible: false,
                max: yDiff.max * ratioY + extraSpace,
                min: yDiff.min * ratioY - extraSpace,
                strictMinMax: true,
            })
        );
        // Create series
        let series = chart.series.push(
            am5xy.SmoothedXYLineSeries.new(root, {
                // name: name,
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

        return () => {
            root.dispose();
        };
    };

    useLayoutEffect(() => {
        let chart = createChart("map-chart", trackMap, timeData, miniSectorCount);

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
                {timeData.map((value, idx) => (
                    <div style={{ color: value.color, backgroundColor: value.color + "50", margin: "5px 0.5rem", borderRadius: "5px", padding: "1px", minWidth: "200px" }}>
                        {value.displayName}
                    </div>
                ))}
            </div>
            <div id="map-chart" className="chart" style={{ width: "100%", aspectRatio: 1, marginBottom: "50px" }}></div>
        </div>
    </>;
}