import { Graph, ExcelDataTransformer } from 'classes.js';

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
        console.log(data);
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
        console.log('getDataByLabelsAndIndex');
        // need to refactor not by array index but property map
        var thing = data.filter(item => labels.indexOf(item[2]) !== -1).map(item => parseFloat(item[pos]));
        console.log(thing);
        return thing;
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
        console.log(CONFIG);
        //console.log(CONFIG.hwType.metric.datasets);
        console.log(Object.entries(CONFIG));
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

    function renderData(currentChart) {
        return function (result) {
            console.log(result);
            var data = result.data;
            var graphDataArray = new ExcelDataTransformer(data).data;
            var graph = new Graph(graphDataArray);
            console.log(graph);
            
            // remove col names
            data.shift(0);
            // array [core, atom, xeon, accel]
            var hwTypes = Object.keys(CONFIG);
            // graph title
            var chartName = data[1][0];
            // graph title
            var chartSlug = chartName.replace(')', '').replace(' (', '-');
            var graphContainer = $('<div>');
            var chartContainer = $('<div>');
            graphContainer.attr('id', 'ov-graph-container-' + chartSlug);
            chartContainer.addClass('chart-container');
            chartContainer.addClass('container');

            // will need to refactor these to not be by hwtype but by filtered data
            hwTypes.forEach(function (hwType) {
                // add title
                var chartWrap = $('<div>');
                chartWrap.addClass('chart-wrap');
                chartWrap.addClass('container');
                chartContainer.append(chartWrap);
                var labels = getLabels(data, hwType);
                console.log('LABELS');
                console.log(labels);
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

            })
            currentChart.append(chartContainer);
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
