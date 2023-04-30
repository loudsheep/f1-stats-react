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
        .setColorGradient("##1900ff", "#15ff00")
        .setMidpoint(330)
        .getColors();

    console.log(gradientArray);

    // TODO MIN-MAX to NewMIN-NewMAX
    const mapValue = (value, min, max, newMin, newMax) => {
        return (((value - min) * (newMax - newMin)) / (max - min)) + newMin
    };

    const createChart = (id, data, name, color) => {
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
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
            })
        );
        xAxis.data.setAll(data);

        // Create series
        let series1 = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Y",
                valueXField: "X",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{valueY}"
                })
            })
        );
        series1.data.setAll(data);


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

        series1.set("stroke", am5.color(color));


        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    };

    const createTrackChart = (id, track, data, name, color) => {
        let root = am5.Root.new(id);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        let idx = 0;
        for (let i of track) {
            i.strokeSettings = {
                stroke: am5.color(gradientArray[data[idx].Y]),
            };
            idx++;
        }

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                disabled: true,
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, { disabled: true }),
            })
        );
        xAxis.data.setAll(data);

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

    const comaprisonTrackMap = (id, track, speed1, speed2, color1, color2) => {
        let root = am5.Root.new(id);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        let idx = 0;
        for (let i of track) {
            let speed = speed1[idx];
            let color = color1;

            for(let j=0; j<speed2.length; j++) {
                if(speed2[j].X > speed.X) {
                    color = speed2[j].Y > speed.Y ? color2 : color1;
                    break;
                }
            }

            i.strokeSettings = {
                stroke: am5.color(color),
            };
            idx++;
        }

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                disabled: true,
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, { disabled: true }),
            })
        );
        xAxis.data.setAll(speed1);

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


    useLayoutEffect(() => {
        let speed = createChart("speedChart", myData.speed, "Speed", "#0000ff");
        let gear = createChart("gearChart", myData.gear, "Gear", "#0000ff");
        let rpm = createChart("rpmChart", myData.rpm, "RPM", "#0000ff");
        let speedMap = createTrackChart("speedMapChart", myData.track_map, myData.speed, "TRACK", "#0000ff");
        let compareMap = comaprisonTrackMap("compareMapChart", myData.track_map, myData.speed, myData.speed2, "#ff0000", "#1900ff");

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

            <div id="compareMapChart" style={{ width: "500px", height: "500px", marginBottom: "50px" }}></div>
        </>
    )
}