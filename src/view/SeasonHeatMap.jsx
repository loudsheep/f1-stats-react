import { useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import f1Tire from '../assets/F1_tire_Pirelli_PZero_Red.svg.png'


export default function SeasonHeatMap() {
    const [data, setData] = useState(null);

    const getSeasonData = (season) => {
        if (season == "") return;
        setData(null);

        (async () => {
            const response = await fetch(
                `http://localhost:8000/standings?year=${season}`
            );
            const parsed = await response.json();
            setData(parsed.data);
        })();
    };

    const createHeatMapChart = (id, heatMapData) => {
        var root = am5.Root.new(id);

        root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        let data = [];
        for (let i of Object.keys(heatMapData)) {
            for (let j of Object.keys(heatMapData[i])) {
                data.push({
                    race: i,
                    driver: j,
                    value: heatMapData[i][j],
                });
            }
        }

        let xData = [];
        for (let i of Object.keys(heatMapData)) {
            xData.push({
                race: i,
            });
        }
        let yData = [];
        for (let i of data) {
            if (yData.indexOf(i.driver) < 0) {
                yData.push(i.driver);
            }
        }
        for (let i = 0; i < yData.length; i++) {
            yData[i] = {
                driver: yData[i],
            }
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

        xRenderer.labels.template.setAll({
            rotation: -45,
            centerX: am5.p0,
            centerY: am5.p100,
        });

        xRenderer.grid.template.set("visible", false);

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: "race"
        }));

        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            calculateAggregates: true,
            stroke: am5.color("#ffffff"),
            clustered: false,
            xAxis: xAxis,
            yAxis: yAxis,
            categoryXField: "race",
            categoryYField: "driver",
            valueField: "value"
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
            min: am5.color("#c6dbef"),
            max: am5.color("#08306b"),
            dataField: "value",
            key: "fill"
        }]);

        series.data.setAll(data);
        xAxis.data.setAll(xData);
        yAxis.data.setAll(yData);

        return () => {
            root.dispose();
        };
    };

    const click = (e) => {
        getSeasonData(e.target.value);
    };

    useLayoutEffect(() => {
        getSeasonData(2023);
    }, []);

    useEffect(() => {
        if (data !== null) {
            let chart = createHeatMapChart("chartdiv", data);

            return () => {
                chart();
            };
        }
    }, [data]);

    return (
        <div>
            Select season to show data:
            <select name="" id="" onChange={click}>
                <option value="2023" selected>2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
            </select>

            {data === null && (
                <div>
                    <img className="loading-tire" src={f1Tire} alt="" />
                </div>
            )}

            <div id="chartdiv" style={{ width: "100%", height: "800px" }}></div>
        </div >
    );
}