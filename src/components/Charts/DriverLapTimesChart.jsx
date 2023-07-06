import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5xy from "@amcharts/amcharts5/xy";
import { useLayoutEffect } from "react";

export default function DriverLapTimesChart({ lapTimes = [], driver = "", color = "#ffffff", title = null, onClickLapNumber = (lap) => { } }) {
    const getCompoundColor = (name) => {
        if (name == "SOFT") {
            return am5.color("#da291c");
        } else if (name == "MEDIUM") {
            return am5.color("#ffd12e");
        } else if (name == "HARD") {
            return am5.color("#f0f0ec");
        } else if (name == "WET") {
            return am5.color("#0067ad");
        } else if (name == "INTERMEDIATE") {
            return am5.color("#43b02a");
        }

        return am5.color("#000000");
    };

    const createChart = (id, driver, color, lapTimes) => {
        let root = am5.Root.new(id);

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        if (title != null) {
            chart.children.unshift(am5.Label.new(root, {
                text: title,
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
            am5xy.DurationAxis.new(root, {
                extraMax: 0,
                baseUnit: "millisecond",
                // min: 0,
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                extraMax: 0,
                renderer: am5xy.AxisRendererX.new(root, {}),
            })
        );

        xAxis.set("tooltip", am5.Tooltip.new(root, {
            forceHidden: true,
        }));


        let series = chart.series.push(
            am5xy.SmoothedXLineSeries.new(root, {
                name: driver,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "LapTime",
                valueXField: "LapNumber",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]Lap {valueX} - {valueY}",
                }),

            })
        );

        let bulletTemplate = am5.Template.new(root, {});
        bulletTemplate.events.on("click", function (ev) {
            // console.log("Clicked on a lap:", ev.target.dataItem.dataContext.LapNumber);
            onClickLapNumber(ev.target.dataItem.dataContext.LapNumber);
        });

        series.bullets.push(function (root, series, dataItem) {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 6,
                    fill: getCompoundColor(dataItem.dataContext.Compound)
                }, bulletTemplate),
            });
        });

        series.events.on("click", function (ev) {
            console.log("Clicked on a column", ev.target);
        });

        series.data.setAll(lapTimes);
        series.set("stroke", am5.color(color));

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            snapToSeries: [series],
            xAxis: xAxis,
            snapToSeriesBy: "x"
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

        root.durationFormatter.set("baseUnit", "millisecond");
        root.durationFormatter.setAll({
            baseUnit: "millisecond",
            durationFormat: "m:ss:SSS",
            durationFields: ["valueY"]
        });

        return () => {
            root.dispose();
        };
    };


    useLayoutEffect(() => {
        let laps = createChart("lapTimesChart", driver, color, lapTimes);

        return () => {
            laps();
        }
    }, [lapTimes]);

    return (
        <>
            <div id="lapTimesChart" style={{ width: "100%", height: "100%", marginBottom: "50px" }}></div>
        </>
    )
}