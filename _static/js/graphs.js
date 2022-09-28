// import { Graph, ExcelDataTransformer } from './classes.js';
class Filter {

    // param: GraphData[], networkModel[]
    static FilterByNetworkModel(graphDataArr, value) {
        return graphDataArr.filter((data) => data.networkModel === value);
    }

    // param: GraphData[], ieType[] (atom, core, core-iGPU, core-CPU+iGPU, xeon, accel)
    static FilterByIeType(graphDataArr, value) {
        return graphDataArr.filter((data) => data.ieType === value);
    }

    // param: GraphData[] (of one networkModel), key (throughput, latency, efficiency, value)
    static getKpiData(graphDataArr, key) {
        return graphDataArr.map((data) => {
            console.log(data);
            console.log(data[key]);
            return data[key];
        });
    }

}
class ExcelDataTransformer {

    static transform(csvdata) {
        const entries = csvdata.filter((entry) => {
            return !entry.includes('begin_rec') && !entry.includes('end_rec');
        });
        // do other purging and data massaging here
        console.log(entries);
        // else generate
        return entries.map((entry) => {
            return new GraphData(new ExcelData(entry));
        });
    }
}

class ExcelData {
    constructor(csvdataline) {
        if (!csvdataline) {
            return;
        }
        this.networkModel = csvdataline[0];
        this.release = csvdataline[1];
        this.ieType = csvdataline[2];
        this.platformName = csvdataline[3];
        this.throughputInt8 = csvdataline[4];
        this.throughputFP16 = csvdataline[5];
        this.throughputFP32 = csvdataline[6];
        this.value = csvdataline[7];
        this.efficiency = csvdataline[8];
        this.price = csvdataline[9];
        this.tdp = csvdataline[10];
        this.sockets = csvdataline[11];
        this.pricePerSocket = csvdataline[12];
        this.tdpPerSocket = csvdataline[13];
        this.latency = csvdataline[14];
    }
    networkModel = '';
    release = '';
    ieType = '';
    platformName = '';
    throughputInt8 = '';
    throughputFP16 = '';
    throughputFP32 = '';
    value = '';
    efficiency = '';
    price = '';
    tdp = '';
    sockets = '';
    pricePerSocket = '';
    tdpPerSocket = '';
    latency = '';
}


class GraphData {
    constructor(excelData) {
        if (!excelData) {
            return;
        }
        this.networkModel = excelData.networkModel;
        this.release = excelData.release;
        this.ieType = excelData.ieType;
        this.platformName = excelData.platformName;
        this.kpi = new KPI(
            new Precision(excelData.throughputInt8, excelData.throughputFP16, excelData.throughputFP32),
            excelData.value,
            excelData.efficiency,
            excelData.latency);
        this.price = excelData.price;
        this.tdp = excelData.tdp;
        this.sockets = excelData.sockets;
        this.pricePerSocket = excelData.pricePerSocket;
        this.tdpPerSocket = excelData.tdpPerSocket;
        this.latency = excelData.latency;
    }
    networkModel = '';
    platformName = '';
    release = '';
    ieType = '';
    kpi = new KPI();
    price = '';
    tdp = '';
    sockets = '';
    pricePerSocket = '';
    tdpPerSocket = '';
}

class KPI {
    constructor(precisions, value, efficiency, latency) {
        this.throughput = precisions;
        this.value = value;
        this.efficiency = efficiency;
        this.latency = latency;
    }
    throughput = new Precision();
    value = '';
    efficiency = '';
    latency = '';
}

class Precision {
    constructor(int8, fp16, fp32) {
        this.int8 = int8;
        this.fp16 = fp16;
        this.fp32 = fp32;
    }
    int8 = '';
    fp16 = '';
    fp32 = '';
}

class Graph {
    constructor(data) {
        this.data = data;
    }
    data = new GraphData();

    // param: GraphData[]
    static getPlatformNames(graphDataArr) {
        return graphDataArr.map((data) => data.platformName);
    }

    // param: GraphData[]
    static getDatabyKPI(graphDataArr, kpi) {
        switch (kpi) {
            case 'throughput':
                // returning int8 for now but should scale to select n <= 3 of 3
                return graphDataArr.map((data) => data.kpi.throughput);
            case 'latency':
                return graphDataArr.map((data) => data.kpi.latency);
            case 'efficiency':
                return graphDataArr.map((data) => data.kpi.efficiency);
            case 'value':
                return graphDataArr.map((data) => data.kpi.value);
            default:
                return [];
        }
    }

    // this is the function that tells the graph software how to render
    static getGraphConfig(kpi) {
        switch (kpi) {
            case 'throughput':
                return {
                    chartTitle: 'Throughput (higher is better)',
                    datasets: [{ data: null, color: '#00C7FD', label: 'FPS (INT8)' },
                    { data: null, color: '#0068B5', label: 'FPS (FP16)' },
                    { data: null, color: '#00C7FD', label: 'FPS (FP32)' }],
                };
            case 'latency':
                return {
                    chartTitle: 'Latency (lower is better)',
                    datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
                };
            case 'value':
                return {
                    chartTitle: 'Value (higher is better)',
                    datasets: [{ data: null, color: '#8BAE46', label: 'FPS/$ (INT8)' }],
                };
            case 'efficiency':
                return {
                    chartTitle: 'Efficiency (higher is better)',
                    datasets: [{ data: null, color: '#E96115', label: 'FPS/TDP (INT8)' }],
                };
            default:
                return {};
        }
    }
}

$(document).ready(function () {
    var chartBlock = $('.chart-block');
    chartBlock.each(function () {
        var url = $(this).data('loadcsv');
        Papa.parse(url, {
            download: true,
            complete: renderData($(this))
        })
    });
    document.getElementById('build-graphs-btn').addEventListener('click', clickBuildGraphs);

    // placeholder random filters
    function getNetworkModel() {
        var arr = [
            ['bert-base-cased[124]'],
            ['deeplabv3-TF [513x513]'],
            ['mobilenet-ssd-CF [300x300]'],
            ['ssdlite_mobilenet_v2-TF [300x300]']
        ];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function getIeType() {
        var arr = [
            'atom',
            'core',
            'xeon'
        ];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function getKPI() {
        var arr = [
            ['throughput', 'latency', 'efficiency', 'value'],
            ['throughput', 'value'],
            ['throughput'],
            ['throughput', 'efficiency', 'value'],
            ['latency', 'efficiency', 'value'],
            ['throughput', 'latency', 'efficiency'],
            ['latency', 'efficiency'],
            ['throughput', 'latency', 'value'],
            ['throughput', 'latency'],
        ];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function clickBuildGraphs() {
        document.getElementById('ov-chart-container').remove();
        console.log('Build Graphs Button being clicked');
        var chartBlock = $('.chart-block');
        chartBlock.each(function () {
            var url = $(this).data('loadcsv');
            Papa.parse(url, {
                download: true,
                complete: renderData($(this))
            })
        });
    }

    // this is the graph data that is used to render the graphs
    // needs to be built after the filter is selected, not split by ie-types
    var CONFIG = {
        core: {
            throughput: {
                chartTitle: 'Throughput (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS (INT8)' }, { data: null, color: '#0068B5', label: 'FPS (FP32)' }],
            },
            latency: {
                chartTitle: 'Latency (lower is better)',
                datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
            },
            value: {
                chartTitle: 'Value (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/$ (INT8)' }],
            },
            efficiency: {
                chartTitle: 'Efficiency (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/TDP (INT8)' }],
            }
        },
        atom: {
            throughput: {
                chartTitle: 'Throughput (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS (INT8)' }, { data: null, color: '#0068B5', label: 'FPS (FP32)' }],
            },
            latency: {
                chartTitle: 'Latency (lower is better)',
                datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
            },
            value: {
                chartTitle: 'Value (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/$ (INT8)' }],
            },
            efficiency: {
                chartTitle: 'Efficiency (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/TDP (INT8)' }],
            }
        },
        xeon: {
            throughput: {
                chartTitle: 'Throughput (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS (INT8)' }, { data: null, color: '#0068B5', label: 'FPS (FP32)' }],
            },
            latency: {
                chartTitle: 'Latency (lower is better)',
                datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
            },
            value: {
                chartTitle: 'Value (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/$ (INT8)' }],
            },
            efficiency: {
                chartTitle: 'Efficiency (higher is better)',
                datasets: [{ data: null, color: '#00C7FD', label: 'FPS/TDP (INT8)' }],
            }
        },
        accel: {
            throughput: {
                chartTitle: 'Throughput (higher is better)',
                datasets: [{ data: null, color: '#8BAE46', label: 'FPS (FP16)' }],
            },
            latency: {
                chartTitle: 'Latency (lower is better)',
                datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
            },
            value: {
                chartTitle: 'Value (higher is better)',
                datasets: [{ data: null, color: '#8BAE46', label: 'FPS (FP16)' }]
            },
            efficiency: {
                chartTitle: 'Efficiency (higher is better)',
                datasets: [{ data: null, color: '#8BAE46', label: 'FPS (FP16)' }]
            }
        }
    }

    function getChartOptions(title, displayLabels) {
        return {
            responsive: false,
            maintainAspectRatio: false,
            legend: { display: true, position: 'bottom' },
            title: {
                display: true,
                text: title
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: displayLabels, //this will remove only the label
                        beginAtZero: true
                    }
                }]
            },
            plugins: {
                datalabels: {
                    color: "#4A4A4A",
                    anchor: "end",
                    align: "end",
                    clamp: false,
                    offset: 0,
                    display: true,
                    font: {
                        size: 8,
                        family: 'Roboto'
                    }
                }
            }
        }
    }

    // params: string[], Datasets[]
    function getChartDataNew(labels, datasets) {
        return {
            labels: labels,
            datasets: datasets.map((item) => {
                return {
                    label: item.label,
                    data: item.data,
                    backgroundColor: item.color,
                    borderColor: 'rgba(170,170,170,0)',
                    barThickness: 12
                }
            })
        }
    }

    function renderData(currentChart) {
        return function (result) {
            console.log(result);
            var data = result.data;
            var NETWORKMODEL = getNetworkModel();
            var IETYPE = getIeType();
            var KPIS = getKPI();

            // remove header from csv line
            data.shift();
            var graphDataArray = ExcelDataTransformer.transform(data);
            console.log(graphDataArray);
            var graph = new Graph(graphDataArray);
            console.log(graph);

            // graph title
            console.log(data);
            var chartName = graph.data[0].networkModel;
            // graph title
            var chartSlug = chartName.replace(')', '').replace(' (', '-');
            var graphContainer = $('<div>');
            var chartContainer = $('<div>');
            // apply graph title temporary readdress
            chartContainer.prepend('<h3>' + NETWORKMODEL + '</h3>');
            chartContainer.attr('id', 'ov-chart-container');
            //-----
            graphContainer.attr('id', 'ov-graph-container-' + chartSlug);
            chartContainer.addClass('chart-container');
            chartContainer.addClass('container');

            // ---------------------- Filters ---------------------------

            //var networkModels = ['bert-base-cased[124]'];
            //var ieType = 'atom';

            // -------------------------------------------------

            // Array of Arrays
            var filteredNetworkModels = [...NETWORKMODEL].map((networkModel) => Filter.FilterByNetworkModel(graph.data, networkModel));
            console.log(filteredNetworkModels);
            var filteredGraphData = filteredNetworkModels.map((models) => Filter.FilterByIeType(models, IETYPE));
            console.log(filteredGraphData);

            if (filteredGraphData.length > 0) {
                createChartWithNewData(filteredGraphData, chartContainer, KPIS);
            }

            // array [core, atom, xeon, accel]
            var hwTypes = Object.keys(CONFIG);
            console.log('hardware types!');
            console.log(hwTypes);

            // will need to refactor these to not be by hwtype but by filtered data
            // for every hardware type, generate a graph (iter. up to 4 times)
            hwTypes.forEach(function (hwType) {
                createChart(data, hwType, chartContainer);
            });
            currentChart.append(chartContainer);
        }

        // this function should take the final data set and turn it into graphs
        // params: GraphData[], unused, chartContainer
        function createChartWithNewData(data, chartContainer, kpis) {
            var chartWrap = $('<div>');
            chartWrap.addClass('chart-wrap');
            chartWrap.addClass('container');
            chartContainer.append(chartWrap);
            var labels = Graph.getPlatformNames(data[0]);
            console.log('LABELS');
            console.log(data);

            data.forEach((model) => {
                console.log(model);
                var graphConfigs = kpis.map((kpi) => {
                    if (kpi === 'throughput') {
                        var throughputData = Graph.getDatabyKPI(model, kpi);
                        var config = Graph.getGraphConfig(kpi);
                        config.datasets[0].data = throughputData.map(tData => tData.int8);
                        config.datasets[1].data = throughputData.map(tData => tData.fp16);
                        //config.datasets[2].data = throughputData.map(tData => tData.fp32);
                        return config;
                    }
                    var config = Graph.getGraphConfig(kpi);
                    config.datasets[0].data = Graph.getDatabyKPI(model, kpi);
                    return config;
                });
                console.log(graphConfigs);

                var graphClass = $('<div>');
                graphClass.addClass('row');
                chartWrap.append(graphClass);

                graphConfigs.forEach((graphConfig, index) => {
                    var showLabels = !index ? true : false;

                    switch (index) {
                        case 0:
                            processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'col-md-6', showLabels);
                            break;
                        case 1:
                            processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'col-md-3', showLabels);
                            break;
                        case 2:
                            processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'col-md-3', showLabels);
                            break;
                        case 3:
                            processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'col-md-3', showLabels);
                            break;
                        default:
                            break;
                    }

                });
            });

            // might need this line for multiple graphs on a page
            //var displayWidth = $(window).width();

        }

        function processMetricNew(labels, datasets, chartTitle, container, widthClass, displayLabels) {
            var chart = $('<div>');
            chart.addClass('chart');
            chart.addClass(widthClass);
            chart.height(labels.length * 55 + 30);
            var canvas = $('<canvas>');
            chart.append(canvas);
            container.append(chart);
            var context = canvas.get(0).getContext('2d');
            context.canvas.height = labels.length * 55 + 30;
            if (widthClass === 'col-md-6') {
                context.canvas.width = context.canvas.width * 1.4;
            }
            else if (widthClass === 'col-md-3') {
                context.canvas.width = context.canvas.width * 0.75;
            }
            new Chart(context, {
                type: 'horizontalBar',
                data: getChartDataNew(labels, datasets),
                options: getChartOptions(chartTitle, displayLabels)
            });
        }
    }


});
