// import { Graph, ExcelDataTransformer } from './classes.js';
class Filter {

    // param: GraphData[], networkModel[]
    static FilterByNetworkModel(graphDataArr, values) {
        return graphDataArr.filter((data) => values.includes(data.networkModel));
    }

    // param: GraphData[], ieType[] (atom, core, core-iGPU, core-CPU+iGPU, xeon, accel)
    static FilterByIeType(graphDataArr, values) {
        return graphDataArr.filter((data) => values.includes(data.ieType));
    }
    
    // param: GraphData[] (of one networkModel), key (throughput, latency, efficiency, value)
    static getKpiData(graphDataArr, key) {
        return graphDataArr.map((data) => data.kpi);
    }

}
class ExcelDataTransformer {

    static transform(csvdata) {
        const entries = csvdata.filter((entry) => {
            return !entry.includes('begin_rec') && !entry.includes('end_rec');
        });
        // do other purging and data massaging here
        // else generate
        return entries.map((entry, index) => {
            if (!entry) {
                console.log(index);
                console.log('index');
            }
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
                return graphDataArr.map((data) => data.kpi.throughput.int8);
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
                    datasets: [{ data: null, color: '#00C7FD', label: 'FPS (INT8)' }, { data: null, color: '#0068B5', label: 'FPS (FP32)' }],
                };
            case 'latency':
                return {
                    chartTitle: 'Latency (lower is better)',
                    datasets: [{ data: null, color: '#8F5DA2', label: 'Milliseconds' }],
                };
            case 'value':
                return {
                    chartTitle: 'Value (higher is better)',
                    datasets: [{ data: null, color: '#00C7FD', label: 'FPS/$ (INT8)' }],
                };
            case 'efficiency':
                return {
                    chartTitle: 'Efficiency (higher is better)',
                    datasets: [{ data: null, color: '#00C7FD', label: 'FPS/TDP (INT8)' }],
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

    // data: full import data
    // ieType: object keys of config, the ie
    function getLabels(data, ieType) {
        return data
            .filter((item) => item[1] === ieType)
            .map((item) => item[2]);
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

    // doesn't seem to be used anywhere so might remove after first main build
    var titleMapping = {
        core: '<h3>Intel® Core™</h3>',
        atom: '<h3>Intel® Atom®</h3>',
        xeon: '<h3>Intel® Xeon®</h3>',
        accel: '<h3>Intel® Movidius™ Vision Processing Units</h3>'
    }


    // since this is using the ie-type split, will need to refactor away from this
    var labelsMapping = {
        core: null,
        atom: null,
        xeon: null,
        accel: null
    }

    /**
     * params:
     * data: (all imported data)
     * labels: 
     * 
     *
     * */

    function getDataByLabelsAndIndex(data, labels, pos) {
        // need to refactor not by array index but property map
        return data.filter(item => labels.indexOf(item[2]) !== -1).map(item => parseFloat(item[pos]));
    }

    function getChartOptions(title, displayLabels) {
        return {
            responsive: false,
            maintainAspectRatio:false,
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

    function getChartData(hwType, metric) {
        //console.log(CONFIG.hwType.metric.datasets);
        return {
            labels: labelsMapping[hwType],
            datasets: CONFIG[hwType][metric]['datasets'].map(function (item) {
                return {
                    label: item.label,
                    data: item.data,
                    backgroundColor: item.color,
                    borderColor: 'rgba(170,170,170,0)',
                    barThickness: 12
                }
            })
        };
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
            graphContainer.attr('id', 'ov-graph-container-' + chartSlug);
            chartContainer.addClass('chart-container');
            chartContainer.addClass('container');

            var filteredGraphData = Filter.FilterByNetworkModel(graph.data, ['bert-base-cased[124]']);
            filteredGraphData = Filter.FilterByIeType(filteredGraphData, ['xeon', 'atom']);

            if(filteredGraphData) {
                createChartWithNewData(filteredGraphData, chartContainer);
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
        function createChartWithNewData(data, chartContainer) {
            var chartWrap = $('<div>');
            chartWrap.addClass('chart-wrap');
            chartWrap.addClass('container');
            chartContainer.append(chartWrap);
            var labels = Graph.getPlatformNames(data);
            console.log('LABELS');
            console.log(labels);

            var kpis = ['value', 'efficiency'];
            var graphConfigs = kpis.map((kpi) => {
                var config = Graph.getGraphConfig(kpi);
                config.datasets[0].data = Graph.getDatabyKPI(data, kpi);
                return config;
            });
            console.log(graphConfigs);

            var graphClass = $('<div>');
            graphClass.addClass('row');
            chartWrap.append(graphClass);

            graphConfigs.forEach((graphConfig) => {
                processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'col-md-8', true);
            });

            // might need this line for multiple graphs on a page
            //var displayWidth = $(window).width();

            

        }

        function createChart(data, hwType, chartContainer) {
            // add title
            var chartWrap = $('<div>');
            chartWrap.addClass('chart-wrap');
            chartWrap.addClass('container');
            chartContainer.append(chartWrap);
            var labels = getLabels(data, hwType);
            var int8Data = getDataByLabelsAndIndex(data, labels, 3);
            var fp32Data = getDataByLabelsAndIndex(data, labels, 4);
            var fp16Data = getDataByLabelsAndIndex(data, labels, 5);
            var valueData = getDataByLabelsAndIndex(data, labels, 6);
            var efficiencyData = getDataByLabelsAndIndex(data, labels, 7);
            var latencyData = getDataByLabelsAndIndex(data, labels, 8);

            labelsMapping[hwType] = labels
            if (hwType === 'accel') {
                CONFIG[hwType].throughput.datasets[0].data = fp16Data;
            }
            else {
                CONFIG[hwType].throughput.datasets[0].data = int8Data;
                CONFIG[hwType].throughput.datasets[1].data = fp32Data;
            }
            CONFIG[hwType].latency.datasets[0].data = latencyData;
            CONFIG[hwType].value.datasets[0].data = valueData;
            CONFIG[hwType].efficiency.datasets[0].data = efficiencyData;

            metrics = Object.keys(CONFIG[hwType]).filter((metric) => hasData(hwType, metric));

            var througputLatency = $('<div>');
            througputLatency.addClass('row');
            var efficiencyValue = $('<div>');
            efficiencyValue.addClass('row');

            chartWrap.append(througputLatency);
            chartWrap.append(efficiencyValue);

            var displayWidth = $(window).width();

            if (metrics.includes('throughput') && metrics.includes('latency')) {
                processMetric(hwType, 'throughput', througputLatency, 'col-md-8', true);
                if (displayWidth < 450) {
                    processMetric(hwType, 'latency', througputLatency, 'col-md-4', true);
                }
                else {
                    processMetric(hwType, 'latency', througputLatency, 'col-md-4', false);
                }
            }
            else if (metrics.includes('throughput')) {
                processMetric(hwType, 'throughput', througputLatency, 'col-md-12', true);
            }
            else if (metrics.includes('latency')) {
                processMetric(hwType, 'latency', througputLatency, 'col-md-12', true);
            }

            if (metrics.includes('efficiency') && metrics.includes('value')) {
                processMetric(hwType, 'efficiency', througputLatency, 'col-md-8', true);
                if (displayWidth < 450) {
                    processMetric(hwType, 'value', througputLatency, 'col-md-4', true);
                }
                else {
                    processMetric(hwType, 'value', througputLatency, 'col-md-4', false);
                }
            }
            else if (metrics.includes('efficiency')) {
                processMetric(hwType, 'efficiency', througputLatency, 'col-md-6', true);
            }
            else if (metrics.includes('value')) {
                processMetric(hwType, 'value', througputLatency, 'col-md-6', true);
            }
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
            if (widthClass === 'col-md-8') {
                context.canvas.width = context.canvas.width * 1.5;
            }
            else if(widthClass === 'col-md-12') {
                context.canvas.width = context.canvas.width * 2.5;
            }
            new Chart(context, {
                type: 'horizontalBar',
                data: getChartDataNew(labels, datasets),
                options: getChartOptions(chartTitle, displayLabels)
            });
        }

        function processMetric(hwType, metric, container, widthClass, displayLabels) {
            var chart = $('<div>');
            chart.addClass('chart');
            chart.addClass(widthClass);
            chart.height(labelsMapping[hwType].length * 55 + 30);
            var canvas = $('<canvas>');
            chart.append(canvas);
            container.append(chart);
            var context = canvas.get(0).getContext('2d');
            context.canvas.height = labelsMapping[hwType].length * 55 + 30;
            if (widthClass === 'col-md-8') {
                context.canvas.width = context.canvas.width * 1.5;
            }
            else if(widthClass === 'col-md-12') {
                context.canvas.width = context.canvas.width * 2.5;
            }
            new Chart(context, {
                type: 'horizontalBar',
                data: getChartData(hwType, metric),
                options: getChartOptions(CONFIG[hwType][metric].chartTitle, displayLabels)
            });
        }

        function hasData(hwType, metric) {
            var has = false;
            CONFIG[hwType][metric]['datasets'].forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                    if (dataset.data[i] > 0) {
                        has = true;
                        break;
                    }
                }
            })
            return has;
        }
    }

    
});
