import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import { useLayoutEffect, useRef } from "react";
import './DriverLapTimesChart.css';

export default function DriverLapTimesChart({ lapTimes = [], driver = "", color = "#ffffff", onClickLapNumber = () => { } }) {

    const getCompoundImage = (name) => {
        if (name == "SOFT") {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/F1_tire_Pirelli_PZero_Red.svg/120px-F1_tire_Pirelli_PZero_Red.svg.png";
        } else if (name == "MEDIUM") {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/F1_tire_Pirelli_PZero_Yellow.svg/120px-F1_tire_Pirelli_PZero_Yellow.svg.png";
        } else if (name == "HARD") {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/F1_tire_Pirelli_PZero_White.svg/120px-F1_tire_Pirelli_PZero_White.svg.png";
        } else if (name == "WET") {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/F1_tire_Pirelli_Cinturato_Blue.svg/120px-F1_tire_Pirelli_Cinturato_Blue.svg.png";
        } else if (name == "INTERMEDIATE") {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/F1_tire_Pirelli_Cinturato_Green.svg/120px-F1_tire_Pirelli_Cinturato_Green.svg.png";
        }
        return "https://flagcdn.com/w80/pl.png";
    };

    const getCompoundColor = (name) => {
        if (name == "SOFT") {
            return am5.color("#ff0000");
        } else if (name == "MEDIUM") {
            return am5.color("#fbff00");
        } else if (name == "HARD") {
            return am5.color("#ffffff");
        } else if (name == "WET") {
            return am5.color("#0004d6");
        } else if (name == "INTERMEDIATE") {
            return am5.color("#1a9c00");
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


        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
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
            durationFormat: "m:ss:SS",
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
    }, []);

    return (
        <>
            <div id="lapTimesChart" style={{ width: "100%", height: "500px", marginBottom: "50px" }}></div>
        </>
    )
}