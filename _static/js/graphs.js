// import { Graph, ExcelDataTransformer } from './classes.js';
class Filter {

    // param: GraphData[], networkModel
    static FilterByNetworkModel(graphDataArr, value) {
        return graphDataArr.filter((data) => data.networkModel === value);
    }

    // param: GraphData[], ieType
    static FilterByIeType(graphDataArr, value) {
        return graphDataArr.filter((data) => data.ieType.includes(value));
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

    static getIeTypeText(ietype) {
        switch (ietype) {
            case 'core':
                return 'Client Platforms (Intel® Core™)';
            case 'xeon':
                return 'Server Platforms (Intel® Xeon®)';
            case 'atom':
                return 'Mobile Platforms (Intel® Atom™)';
            case 'accel':
                return 'Accelerator Platforms';
            default:
                return '';
        }
    }

    // functions to get unique keys 
    static getNetworkModels(graphDataArr) {
        return Array.from(new Set(graphDataArr.map((obj) => obj.networkModel)));
    }
    static getIeTypes(graphDataArr) {
        return Array.from(new Set(graphDataArr.map((obj) => obj.ieType)));
    }
    static getPlatforms(graphDataArr) {
        return Array.from(new Set(graphDataArr.map((obj) => obj.platformName)));
    }
    static getKpis(graphDataArr) {
        return ['Throughput', 'Value', 'Efficiency', 'Latency'];
    }
    // TODO: this is naive, will need to do an actual filter here potentially
    static getPrecisions(graphDataArr) {
        return ['int8', 'fp16', 'fp32'];
    }

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

    $('#build-graphs-btn').on('click', showModal);

    function clickBuildGraphs(graph, networkModels, ietype, platforms, kpis) {
        renderData(graph, networkModels, ietype, platforms, kpis);

        $('.edit-settings-btn').show();
        $('.clear-all-btn').hide();

        $('.edit-settings-btn').on('click', (event) => {
            $('.configure-graphs-content').show();
            $('.edit-settings-btn').hide();
            $('.clear-all-btn').show();
            $('.chart-placeholder').empty();
        });

        $('.graph-chart-title-header').on('click', (event) => {
            console.log(event);
            parent = event.target.parentElement;

            console.log($(parent).children('.chart-wrap.container').is(":visible"))

            if ($(parent).children('.chart-wrap.container').is(":visible")) {
                $(parent).children('.chart-wrap.container').hide();
                $(parent).children('.chevron-right-btn').show();
                $(parent).children('.chevron-down-btn').hide();
                $
            } else {
                $(parent).children('.chart-wrap.container').show();                    
                $(parent).children('.chevron-down-btn').show();
                $(parent).children('.chevron-right-btn').hide();
            }
        });
    }

    function hideModal() {
        $('#graphModal').hide();
    }

    function showModal() {

        if ($('#graphModal').length) {
            $('#graphModal').show();
            return;
        }

        const staticData = 'csv/testdatacsv.csv';

        Papa.parse(staticData, {
            download: true,
            complete: renderModal
        });
    }

    function renderModal(result) {
        console.log(result.data);
        // remove header from csv line
        result.data.shift();
        var graph = new Graph(ExcelDataTransformer.transform(result.data));

        var networkModels = Graph.getNetworkModels(graph.data);
        var ieTypes = Graph.getIeTypes(graph.data);
        var platforms = Graph.getPlatforms(graph.data);
        var kpis = Graph.getKpis(graph.data);
        var precisions = Graph.getPrecisions(graph.data);

        var selectedNetworkModels = [];
        // TODO: check this line for defaul value
        var selectedIeType = 'atom';
        var selectedClientPlatforms = [];
        var selectedKPIs = [];


        console.log(platforms);

        console.log(graph);

        fetch('_static/html/modal.html').then((response) => response.text()).then((text) => {

            // generate and configure modal container
            var modal = $('<div>');
            modal.attr('id', 'graphModal');
            modal.addClass('modal');
            // generate and configure modal content from html import
            var modalContent = $(text);
            modalContent.attr('id', 'graphModalContent');
            modalContent.addClass('modal-content');
            modal.append(modalContent);

            // hide edit settings button
            $('.edit-settings-btn').hide();

            const models = networkModels.map((networkModel) => createCheckMark(networkModel, 'networkmodel'));
            modal.find('.models-column-one').append(models.slice(0, models.length / 2));
            modal.find('.models-column-two').append(models.slice(models.length / 2));

            const types = ieTypes.map((ieType) => {
                var labelText = Graph.getIeTypeText(ieType);
                if (labelText) {
                    const item = $('<label class="checkmark-container">');
                    const checkboxSpan = $('<span class="checkmark radiobutton">');
                    item.text(Graph.getIeTypeText(ieType));
                    const radio = $('<input type="radio" name="ietype"/>');
                    item.append(radio);
                    item.append(checkboxSpan);
                    radio.attr('data-ietype', ieType);
                    return item;
                }
            });
            modal.find('.ietype-column').append(types);

            //TODO: check this line
            modal.find('.ietype-column input').first().attr('checked', true);

            const kpiLabels = kpis.map((kpi) => createCheckMark(kpi, 'kpi'));
            modal.find('.kpi-column').append(kpiLabels);

            // TODO: figure out what to do with precisions
            // const precisionLabels = precisions.map((precision) => {

            // });

            $('body').prepend(modal);

            $('#modal-build-graphs-btn').on('click', () => { 
                $('.configure-graphs-content').hide();
                clickBuildGraphs(graph, selectedNetworkModels, selectedIeType, selectedClientPlatforms, selectedKPIs) 
            });

            $('.modal-close').on('click', hideModal);
            modal.find('.models-column-one input').on('click', function (event) {
                const selectedItem = $(this).data('networkmodel');
                if (event.target.checked) {
                    selectedNetworkModels.push(selectedItem)
                } else {
                    selectedNetworkModels = selectedNetworkModels.filter((item) => item !== selectedItem);
                }
                var fPlatforms = filterClientPlatforms(graph.data, selectedNetworkModels, selectedIeType);
                renderClientPlatforms(fPlatforms, modal);
                selectedClientPlatforms = Graph.getPlatformNames(fPlatforms);
            });
            modal.find('.models-column-two input').on('click', function (event) {
                const selectedItem = $(this).data('networkmodel');
                if (event.target.checked) {
                    selectedNetworkModels.push(selectedItem)
                } else {
                    selectedNetworkModels = selectedNetworkModels.filter((item) => item !== selectedItem);
                }
                var fPlatforms = filterClientPlatforms(graph.data, selectedNetworkModels, selectedIeType);
                renderClientPlatforms(fPlatforms, modal);
                selectedClientPlatforms = Graph.getPlatformNames(fPlatforms);
                console.log(selectedNetworkModels);
            });
            modal.find('.ietype-column input').on('click', function (event) {
                const selectedItem = $(this).data('ietype');
                selectedIeType = selectedItem;
                var fPlatforms = filterClientPlatforms(graph.data, selectedNetworkModels, selectedIeType);
                renderClientPlatforms(fPlatforms, modal);
                selectedClientPlatforms = Graph.getPlatformNames(fPlatforms);
                console.log(selectedIeType);
            });
            modal.find('.kpi-column input').on('click', function (event) {
                const selectedItem = $(this).data('kpi');
                console.log(event.target.checked);
                if (event.target.checked) {
                    selectedKPIs.push(selectedItem)
                } else {
                    selectedKPIs = selectedKPIs.filter((item) => item !== selectedItem);
                }
                console.log(selectedKPIs);
            });

            // TODO Fix this targeting issue
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        });
    }

    // TODO: matrix math or truth table testing before shipping this
    function filterClientPlatforms(data, networkModels, ietype) {
        var first = Filter.FilterByNetworkModel(data, networkModels[0]);
        var second = Filter.FilterByIeType(first, ietype);
        return second;

    }

    function renderClientPlatforms(platforms, modal) {
        var platformNames = Graph.getPlatformNames(platforms);
        $('.client-platform-column').empty();
        const clientPlatforms = platformNames.map((platform) => createCheckMark(platform, 'platform'));
        selectAllCheckboxes(clientPlatforms);
        modal.find('.client-platform-column').append(clientPlatforms);
    }

    function createCheckMark(itemLabel, modelLabel) {
      const item = $('<label class="checkmark-container">');
      item.text(itemLabel);
      const checkbox = $('<input type="checkbox"/>');
      const checkboxSpan = $('<span class="checkmark">');
      item.append(checkbox);
      item.append(checkboxSpan);
      checkbox.attr('data-' + modelLabel, itemLabel);
      return item;
    }


    // receives a jquery parent class and selects all child checkboxes
    function selectAllCheckboxes(items) {
        console.log(items);
        items.forEach((item) => {
            console.log(item);
            item.find(':input').attr('checked', true);
        });
        
    }
    // receives a jquery parent class and unselects all child checkboxes
    function unselectAllCheckboxes(item) {
        console.log(items);
        items.forEach((item) => {
            console.log(item);
            item.attr('checked', false);
        });
    }


    function getChartOptions(title, displayLabels) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: true, position: 'bottom' },
            title: {
                display: false,
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

    function renderData(graph, networkModels, ietype, platforms, kpis) {

        $('.chart-placeholder').empty();
        networkModels.forEach((networkModel) => {
            // graph title
            var chartName = networkModel;
            // graph title
            var chartSlug = chartName.replace(')', '').replace(' (', '-');
            console.log(chartSlug);
            var chartContainer = $('<div>');
            // apply graph title temporary readdress

            var chevronDown = '<span class="chevron-down-btn"></span>';
            var chevronRight = '<span style="display:none" class="chevron-right-btn"></span>';
            $(chevronRight).hide();
            var chartContainerHeader = $('<span class="graph-chart-title">' + networkModel + '</span>' + chevronDown + chevronRight);
            chartContainerHeader.addClass('graph-chart-title-header');
            chartContainer.prepend(chartContainerHeader);
            chartContainer.attr('id', 'ov-chart-container-' + chartSlug);

            chartContainer.addClass('chart-container');
            chartContainer.addClass('container');

            // Array of Arrays
            var filteredNetworkModels = Filter.FilterByNetworkModel(graph.data, networkModel);
            console.log(filteredNetworkModels);
            var filteredGraphData = Filter.FilterByIeType(filteredNetworkModels, ietype);
            console.log(filteredGraphData);

            if (filteredGraphData.length > 0) {
                createChartWithNewData(filteredGraphData, chartContainer, kpis);
            }

            $('.chart-placeholder').append(chartContainer);            
        })
    };


    // this function should take the final data set and turn it into graphs
    // params: GraphData, unused, chartContainer
    function createChartWithNewData(model, chartContainer, kpis) {
        var chartWrap = $('<div>');
        chartWrap.addClass('chart-wrap');
        chartWrap.addClass('container');
        chartContainer.append(chartWrap);
        var labels = Graph.getPlatformNames(model);
        console.log('LABELS');
        console.log(model);

        var graphConfigs = kpis.map((kpiii) => {
            var kpi = kpiii.toLowerCase();
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

        var graphClass = $('<div>');
        graphClass.addClass('graph-row');
        chartWrap.append(graphClass);

        graphConfigs.forEach((graphConfig, index) => {
            var showLabels = !index ? true : false;

            switch (index) {
                case 0:
                    processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'graph-row-first-column', showLabels);
                    break;
                case 1:
                    processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'graph-row-column', showLabels);
                    break;
                case 2:
                    processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'graph-row-column', showLabels);
                    break;
                case 3:
                    processMetricNew(labels, graphConfig.datasets, graphConfig.chartTitle, graphClass, 'graph-row-column', showLabels);
                    break;
                default:
                    break;
            }
        });

        // might need this line for multiple graphs on a page
        // var displayWidth = $(window).width();

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
        new Chart(context, {
            type: 'horizontalBar',
            data: getChartDataNew(labels, datasets),
            options: getChartOptions(chartTitle, displayLabels)
        });
    }


});
