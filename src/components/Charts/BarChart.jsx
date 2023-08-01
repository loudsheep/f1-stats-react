import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5xy from "@amcharts/amcharts5/xy";
import { useLayoutEffect } from "react";

export default function BarChart({ data = [], title = null, id = Math.random(), sort = true, reverseSort = false, categoryKey = "value" }) {

    const createChart = (id, data, title, sort, reverse, categoryKey) => {
        var root = am5.Root.new(id);

        // root.interfaceColors.set("grid", am5.color("#fff"));
        root.interfaceColors.set("text", am5.color("#fff"));

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout,
        }));

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

        chart.zoomOutButton.set("forceHidden", true);

        var yRenderer = am5xy.AxisRendererY.new(root, {
            minGridDistance: 30
        });

        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0,
            categoryField: categoryKey,
            renderer: yRenderer,
            tooltip: am5.Tooltip.new(root, { themeTags: ["axis"] })
        }));

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            extraMax: 0.1,
            visible: false,
            renderer: am5xy.AxisRendererX.new(root, {
                strokeOpacity: 0.1,
            })
        }));

        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "value",
            categoryYField: categoryKey,
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "left",
                labelText: "{valueX}"
            })
        }));

        series.columns.template.setAll({
            cornerRadiusTR: 5,
            cornerRadiusBR: 5,
            strokeOpacity: 0
        });

        series.columns.template.adapters.add("fill", function (fill, target) {
            return am5.color(target.dataItem.dataContext.color);
        });

        yAxis.data.setAll(data);
        series.data.setAll(data);
        if (sort) {
            sortCategoryAxis(reverse);
        }

        function getSeriesItem(category) {
            for (var i = 0; i < series.dataItems.length; i++) {
                var dataItem = series.dataItems[i];
                if (dataItem.get("categoryY") == category) {
                    return dataItem;
                }
            }
        }

        series.bullets.push(function (root) {
            return am5.Bullet.new(root, {
                locationX: 1,
                // locationY: 0,
                sprite: am5.Label.new(root, {
                    text: "{valueX}",
                    // rotation: -90,
                    fontSize: "1rem",
                    // centerX: am5.percent(30),
                    centerY: am5.percent(50),
                    populateText: true,
                    maskBullets: false,
                    // templateField: "bulletSettings"
                })
            });
        });

        // Axis sorting
        function sortCategoryAxis(reverse = false) {

            // Sort by value
            series.dataItems.sort(function (x, y) {
                if (reverse) {
                    return y.get("valueX") - x.get("valueX"); // ascending
                }

                return x.get("valueX") - y.get("valueX"); // descending
            })

            // Go through each axis item
            am5.array.each(yAxis.dataItems, function (dataItem) {
                // get corresponding series item
                var seriesDataItem = getSeriesItem(dataItem.get("category"));

                if (seriesDataItem) {
                    // get index of series data item
                    var index = series.dataItems.indexOf(seriesDataItem);
                    // calculate delta position
                    var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
                    // set index to be the same as series data item index
                    dataItem.set("index", index);
                    // set deltaPosition instanlty
                    // dataItem.set("deltaPosition", -deltaPosition);
                    // animate delta position to 0
                    dataItem.animate({
                        key: "deltaPosition",
                        to: 0,
                        duration: 1000,
                        easing: am5.ease.out(am5.ease.cubic)
                    })
                }
            });

            // Sort axis items by index.
            // This changes the order instantly, but as deltaPosition is set,
            // they keep in the same places and then animate to true positions.
            yAxis.dataItems.sort(function (x, y) {
                return x.get("index") - y.get("index");
            });
        }

        return () => {
            root.dispose();
        }
    };


    useLayoutEffect(() => {
        let chart = createChart("barchart" + id, data, title, sort, reverseSort, categoryKey);

        return () => {
            chart();
        }
    }, [data]);

    return (
        <>
            <div id={"barchart" + id} style={{ width: "100%", height: "100%", marginBottom: "50px" }}></div>
        </>
    )
}