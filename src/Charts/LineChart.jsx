import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useRef } from "react";
// import { Gradient } from "javascript-color-gradient";
import Gradient from "javascript-color-gradient";
import myData from '../assets/data.json';

export default function LineChart() {
    const chartRef = useRef(null);

    const gradientArray = new Gradient()
        .setColorGradient('#003399', '#0055bb', '#0077cc', '#0099dd', '#00bbff', '#ffcc00', '#ff9900', '#ff6600', '#ff3300', '#ff0000')
    // .setMidpoint(330)
    // .getColors();

    const mapValue = (value, min, max, newMin, newMax) => {
        return (((value - min) * (newMax - newMin)) / (max - min)) + newMin
    };

    const findDataMinAndMax = (data) => {
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;

        for (let i of data) {
            if (i.Y < min) {
                min = i.Y;
            }
            if (i.Y > max) {
                max = i.Y
            }
        }

        return {
            min: min,
            max: max,
        };
    };

    const createChart = (id, data) => {
        let root = am5.Root.new(id);

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                extraMax: 0,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                extraMax: 0,
                renderer: am5xy.AxisRendererX.new(root, {}),
            })
        );
        // xAxis.data.setAll(data);

        for (let i of data) {
            let series = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: i.name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "Y",
                    valueXField: "X",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "[bold]{valueY}",
                    })
                })
            );

            series.data.setAll(i.data);
            series.set("stroke", am5.color(i.color));
        }


        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            // snapToSeries: [series1],
            // snapToSeriesBy: "x",
            // stroke: am5.color('#ff0000'),
        }));

        cursor.lineX.setAll({
            stroke: am5.color("#fff"),
        });

        cursor.lineY.setAll({
            visible: false
        });



        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    };

    const createTrackChart = (id, track, data, name, color) => {
        let root = am5.Root.new(id);

        let minMax = findDataMinAndMax(data);
        let gradient = color.setMidpoint(minMax.max - minMax.min + 1).getColors();

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        let idx = 0;
        for (let i of track) {
            i.strokeSettings = {
                stroke: am5.color(gradient[data[idx].Y - minMax.min]),
            };
            idx++;
        }

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, { disabled: true }),
            })
        );
        xAxis.data.setAll(data);

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                // syncWithAxis: xAxis,
                disabled: true,
            })
        );

        // Create series
        let series1 = chart.series.push(
            am5xy.SmoothedXYLineSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Y",
                valueXField: "X",
                stroke: am5.color("#fff"),
                fill: am5.color("#ff0000"),
            })
        );
        series1.data.setAll(track);

        series1.strokes.template.setAll({
            strokeWidth: 5,
            templateField: "strokeSettings",
        });

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    };

    const comaprisonTrackMap = (id, track, speedData) => {
        let root = am5.Root.new(id);

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
            let speed = speed1.data[i];
            let color = speed1.color;

            for (let s = 1; s < speedData.length; s++) {
                let speedTmp = speedData[s];

                for (let j = 0; j < speedTmp.data.length; j++) {
                    if (speedTmp.data[j].X > X) {
                        if (speedTmp.data[j].Y > speed.Y) {
                            speed = speedTmp.data[j];
                            color = speedTmp.color;
                        }
                        break;
                    }
                }
            }

            track[i].strokeSettings = {
                stroke: am5.color(color),
            }
        }

        
        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, { disabled: true }),
            })
            );
            
            // Create Y-axis
            let yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {}),
                    syncWithAxis: xAxis,
                    disabled: true,
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

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    };


    useLayoutEffect(() => {
        let speed = createChart("speedChart", [
            { color: "#0000ff", name: "VER", data: myData.speed2 },
            { color: "#ffff00", name: "RUS", data: myData.speed3 },
            { color: "#ff0000", name: "BOT", data: myData.speed },
        ]);
        let gear = createChart("gearChart", [
            { color: "#ff0000", name: "BOT", data: myData.gear },
        ]);
        let rpm = createChart("rpmChart", [
            { color: "#ff0000", name: "BOT", data: myData.rpm },
        ]);

        let speedMap = createTrackChart("speedMapChart", myData.track_map, myData.speed, "TRACK", gradientArray);

        let compareMap = comaprisonTrackMap("compareMapChart", myData.track_map, [
            { color: "#ff0000", name: "BOT", data: myData.speed },
            { color: "#0000ff", name: "VER", data: myData.speed2 },
            { color: "#ffff00", name: "RUS", data: myData.speed3 },
        ]);

        return () => {
            speed();
            gear();
            rpm();
            speedMap();
            compareMap();
        }
    }, []);

    return (
        <>
            <div id="speedChart" style={{ width: "100%", height: "500px", marginBottom: "50px" }}></div>

            <div id="gearChart" style={{ width: "100%", height: "250px", marginBottom: "50px" }}></div>

            <div id="rpmChart" style={{ width: "100%", height: "250px", marginBottom: "50px" }}></div>

            <div id="speedMapChart" style={{ width: "500px", height: "500px", marginBottom: "50px" }}></div>
            {/* <div id="speedMapChart" style={{ width: "100%", aspectRatio: "1", marginBottom: "50px" }}></div> */}

            {/* <div id="compareMapChart" style={{ width: "500px", height: "500px", marginBottom: "50px" }}></div> */}
            <div id="compareMapChart" style={{ width: "50%", aspectRatio: 1, marginBottom: "50px" }}></div>
        </>
    )
}