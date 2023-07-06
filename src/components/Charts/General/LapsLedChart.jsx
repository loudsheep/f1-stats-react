import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5xy from "@amcharts/amcharts5/xy";
import { useEffect, useLayoutEffect, useState } from "react";

export default function LapsLedCharts({ style, className }) {
    const [data, setData] = useState([]);

    const createChart = (id, data) => {
        var root = am5.Root.new(id);

        // root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        for (let i of data) {
            i.columnSettings = {
                fill: am5.color(i.color),
            }
            i.bulletSettings = {
                fill: am5.color("#fff"),
                fillOpacity: 0.95,
            }
        }

        data.sort((a, b) => {
            return b.laps - a.laps;
        });

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
        }));

        chart.children.unshift(am5.Label.new(root, {
            text: "Laps finished as race leader in 2023",
            fontSize: 25,
            fontWeight: "500",
            textAlign: "center",
            x: am5.percent(50),
            centerX: am5.percent(50),
            paddingTop: 0,
            paddingBottom: 5
        }));

        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);
        cursor.lineX.set("visible", false);

        var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });

        xRenderer.grid.template.setAll({
            location: 1
        })

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "driver",
            renderer: xRenderer,
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: am5xy.AxisRendererY.new(root, {
                strokeOpacity: 0.1
            })
        }));


        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Laps leader",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "laps",
            sequencedInterpolation: true,
            categoryXField: "driver",
            calculateAggregates: true,
            // tooltip: am5.Tooltip.new(root, {
            //     labelText: "{valueY}%"
            // }),
        }));

        series.columns.template.setAll({
            templateField: "columnSettings"
        });

        series.bullets.push(function (root) {
            return am5.Bullet.new(root, {
                locationX: 0.5,
                locationY: 0.5,
                sprite: am5.Label.new(root, {
                    text: "{valueY}",
                    rotation: -90,
                    fontSize: "1.25rem",
                    centerX: am5.percent(50),
                    centerY: am5.percent(50),
                    populateText: true,
                    maskBullets: false,
                    templateField: "bulletSettings"
                })
            });
        });

        series.columns.template.onPrivate("height", function (height, target) {
            am5.array.each(target.dataItem.bullets, function (bullet) {
                if (height > 50) {
                    // bullet.get("sprite").set("centerX", am5.p50);
                }
                else {
                    bullet.set("locationY", 1);
                    bullet.get("sprite").set("centerX", am5.percent(-30));
                }
            });
        });

        series.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, strokeOpacity: 0 });

        xAxis.data.setAll(data);
        series.data.setAll(data);

        let exporting = am5plugins_exporting.Exporting.new(root, {
            menu: am5plugins_exporting.ExportingMenu.new(root, {}),
            filePrefix: "raceLeader",
            pngOptions: {
                quality: 1,
                maintainPixelRatio: true
            }
        });

        return () => {
            root.dispose()
        };
    };

    useEffect(() => {
        (async () => {
            const response = await fetch(
                window.getBackendURL() + `/lap-leaders`
            );
            const parsed = await response.json();
            setData(parsed.data);
        })();
    }, []);

    useLayoutEffect(() => {
        let chart = createChart("lap-leader-chart", data);

        return () => {
            chart();
        }
    }, [data]);

    return (
        <div id="lap-leader-chart" style={style} className={className}></div>
    );
}