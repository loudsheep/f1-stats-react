import { useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png'


export default function SeasonHeatMap() {
    const [data, setData] = useState(null);
    const [season, setSeason] = useState(2023);
    const [category, setCategory] = useState("points");

    const getSeasonData = (category, season) => {
        console.log(category, season);
        if (season == "") return;
        setData(null);

        (async () => {
            const response = await fetch(
                `http://${window.backendServerAddress}:8000/heatmap?year=${season}&category=${category}`
            );
            const parsed = await response.json();
            setData(parsed.data);
        })();
    };

    const createHeatMapChart = (id, heatMapData, colors) => {
        var root = am5.Root.new(id);

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let yData = [];
        for (let driver of heatMapData.drivers) {
            yData.push({
                driver: driver,
            });
        }

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout
        }));

        var yRenderer = am5xy.AxisRendererY.new(root, {
            visible: false,
            minGridDistance: 20,
            inversed: true
        });

        yRenderer.grid.template.set("visible", false);

        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0,
            renderer: yRenderer,
            categoryField: "driver"
        }));

        var xRenderer = am5xy.AxisRendererX.new(root, {
            visible: false,
            minGridDistance: 30,
            opposite: true
        });

        xRenderer.grid.template.set("visible", false);

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: "raceCode",
            bullet: function (root, axis, dataItem) {
                return am5xy.AxisBullet.new(root, {
                    location: 0.5,
                    sprite: am5.Picture.new(root, {
                        width: 25,
                        // height: 24,
                        centerY: am5.percent(75),
                        centerX: am5.p50,
                        src: "https://flagcdn.com/w80/" + dataItem.dataContext.countryCode.toLowerCase() + ".png"
                    })
                });
            }
        }));

        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            calculateAggregates: true,
            stroke: am5.color("#ffffff"),
            clustered: false,
            xAxis: xAxis,
            yAxis: yAxis,
            categoryXField: "race",
            categoryYField: "driver",
            valueField: "value",
        }));

        series.columns.template.setAll({
            strokeOpacity: 1,
            strokeWidth: 0.25,
            fill: am5.color("#000"),
            width: am5.percent(100),
            height: am5.percent(100),
        });

        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    fill: am5.color("#ffffff"),
                    populateText: true,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    fontSize: 13,
                    text: "{value}"
                })
            });
        });

        series.set("heatRules", [{
            target: series.columns.template,
            min: am5.color(colors.min),
            max: am5.color(colors.max),
            dataField: "value",
            key: "fill",
        }]);


        series.data.setAll(heatMapData.chartData);
        xAxis.data.setAll(heatMapData.races);
        yAxis.data.setAll(yData);

        return () => {
            root.dispose();
        };
    };

    const changeSeason = (e) => {
        setSeason(e.target.value);
        getSeasonData(category, e.target.value);
    };

    const changeCategory = (e) => {
        setCategory(e.target.value);
        getSeasonData(e.target.value, season);
    };

    useLayoutEffect(() => {
        getSeasonData(category, season);
    }, []);

    useEffect(() => {
        if (data !== null) {
            let colors = {};
            if (category == "points") {
                colors.min = "#b9d4ff";
                colors.max = "#09375a";
            } else if (category == "positions") {
                colors.min = "#ff2414";
                colors.max = "#231fff";
            } else if (category == "qualifying") {
                colors.min = "#2a5779";
                colors.max = "#b9d4ff";
            }

            let chart = createHeatMapChart("chartdiv", data, colors);

            return () => {
                chart();
            };
        }
    }, [data]);

    return (
        <div>
            Select what data to show:
            <select name="" id="" onChange={changeCategory}>
                <option value="points" selected>Points After Each Race</option>
                <option value="positions">Race Finish Position</option>
                <option value="qualifying">Qualifying Position</option>
            </select>

            Select season to show data:
            <select name="" id="" onChange={changeSeason}>
                <option value="2023" selected>2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
            </select>

            {data === null && (
                <div>
                    <img className="loading-tire" src={f1Tire} alt="" />
                </div>
            )}

            <div id="chartdiv" style={{ width: "60%", height: "800px", margin: "10px auto 0 auto" }}></div>
        </div >
    );
}