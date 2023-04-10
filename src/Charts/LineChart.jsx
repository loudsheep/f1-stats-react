import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useRef } from "react";
import myData from '../assets/data.json';

export default function LineChart() {
    const chartRef = useRef(null);


    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        let data = myData.speed;

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
                name: "Speed",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Speed",
                valueXField: "Distance",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{valueY} km/h"
                })
            })
        );
        series1.data.setAll(data);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {
            snapToSeries: [series1],
            snapToSeriesBy: "x"
        }));

        // xAxis.set("tooltip", am5.Tooltip.new(root, {}));
        // yAxis.set("tooltip", am5.Tooltip.new(root, {}));


        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    )
}