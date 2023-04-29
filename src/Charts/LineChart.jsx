import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useRef } from "react";
import myData from '../assets/data.json';

export default function LineChart() {
    const chartRef = useRef(null);

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


    useLayoutEffect(() => {
        let speed = createChart("speedChart", myData.speed, "Speed", "#0000ff");
        let gear = createChart("gearChart", myData.gear, "Gear", "#0000ff");
        let rpm = createChart("rpmChart", myData.rpm, "RPM", "#0000ff");

        return () => {
            speed();
            gear();
            rpm();
        }
    }, []);

    return (
        <>
            <div id="speedChart" style={{ width: "100%", height: "500px", marginBottom:"50px" }}></div>
        
            <div id="gearChart" style={{ width: "100%", height: "250px", marginBottom:"50px" }}></div>

            <div id="rpmChart" style={{ width: "100%", height: "250px", marginBottom:"50px" }}></div>
        </>
    )
}