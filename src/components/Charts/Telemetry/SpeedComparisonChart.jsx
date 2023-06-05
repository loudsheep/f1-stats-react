import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

export default function SpeedComparisonChart({ title, trackMap, speedData }) {

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
        let speed1 = speedData[speedData.length - 1];

        console.log(speed1);
        for (let i in track) {
            let X = speed1.data[i].X;
            let speed = speed1.data[i];
            let color = speed1.color;

            for (let s = 0; s < speedData.length - 1; s++) {
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
                renderer: am5xy.AxisRendererX.new(root, {}),
                visible: false,
            })
        );

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                // syncWithAxis: xAxis,
                visible: false,
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
        <div id="speed-chart" className="chart" style={{ width: "40%", aspectRatio: 1, marginBottom: "50px" }}></div>
    </>;
}