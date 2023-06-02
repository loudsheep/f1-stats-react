import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

export default function LinearChart({ title, chartData, style = { width: "100%", height: "500px", marginBottom: "50px" } }) {
    const createChart = (elementId, data, chartTitle) => {
        let root = am5.Root.new(elementId);

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        if (chartTitle != null) {
            chart.children.unshift(am5.Label.new(root, {
                text: chartTitle,
                fontSize: 25,
                fontWeight: "500",
                textAlign: "center",
                x: am5.percent(50),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 5
            }));
        }

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

    const randomID = Math.round(Math.random() * 1000);

    useLayoutEffect(() => {
        let chart = createChart("linear-chart" + randomID, chartData, title);

        return () => {
            chart();
        }
    });

    return <>
        <div id={"linear-chart" + randomID} className="chart" style={style}></div>
    </>;
}