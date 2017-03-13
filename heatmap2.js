

function plotHeatmap() {
    var stationList = [];
    var tripsData = [];

    var city = $('#city').val();
    var userType = $('#userType').val();
    var day = $('#day').val();

    $.getJSON("data/station.json", function (data) {
        getStationsList(data);
        console.log(stationList);
        getTrips();
    });

    function getStationsList(data) {
        data.forEach(function (item) {
            if (item.landmark.toLowerCase() == city.toLowerCase()) {
                stationList.push(item.name);
            }
        });
    }

    function getTrips() {
        $.getJSON("data/stationTrips.json", function (data) {
            getTripData(data);
            console.log(tripsData);
            plotHeatmap();
        });
    }

    function getTripData(data) {
        data.forEach(function (item) {
            if(item.city.toLowerCase() == city.toLowerCase()
                && stationList.indexOf(item.start_station) != -1
                && stationList.indexOf(item.end_station) != -1) {
                var trip = [];
                trip.push(stationList.indexOf(item.start_station));
                trip.push(stationList.indexOf(item.end_station));
                trip.push(item.trips);
                tripsData.push(trip);
            }
        })
    }


    function plotHeatmap() {
        $('#container').highcharts({

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 150,
                plotBorderWidth: 1
            },


            title: {
                text: 'Trips between station'
            },

            xAxis: {
                categories: stationList
            },

            yAxis: {
                categories: stationList,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[7]
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 12,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 455
            },

            tooltip: {
                formatter: function () {
                    return 'From <b>' + this.series.xAxis.categories[this.point.x] + '</b><br>To <b>' + this.series.yAxis.categories[this.point.y] + '</b><br>trips <b>' + this.point.value + '<b>';
                }
            },

            series: [{
                name: 'Trips per station',
                borderWidth: 1,
                data: tripsData,
                dataLabels: {
                    enabled: true,
                    color: 'black',
                    style: {
                        textShadow: 'none'
                    }
                }
            }]

        });
    }
}

//$(function () {
//
//    var stationList = [];
//    var tripsData = [];
//    
//    $.getJSON("data/station.json", function (data) {
//        getStationsList(data);
//        console.log(stationList);
//        getTrips();
//    });
//    
//    function getStationsList(data) {
//        data.forEach(function (item) {
//           if (item.landmark == "San Jose") {
//                stationList.push(item.name);
//            } 
//        });
//    }
//    
//    function getTrips() {
//        $.getJSON("data/stationTrips.json", function (data) {
//            getTripData(data);
//            console.log(tripsData);
//            plotHeatmap();
//        });    
//    }
//    
//    function getTripData(data) {
//        data.forEach(function (item) {
//            if(item.city == "San Jose" && stationList.indexOf(item.start_station) != -1 && stationList.indexOf(item.end_station) != -1) {
//                var trip = [];
//                trip.push(stationList.indexOf(item.start_station));
//                trip.push(stationList.indexOf(item.end_station));
//                trip.push(item.trips);
//                tripsData.push(trip);
//            }
//        })
//    }
//    
//    
//    function plotHeatmap() {
//                $('#container').highcharts({
//        
//        chart: {
//            type: 'heatmap',
//            marginTop: 40,
//            marginBottom: 150,
//            plotBorderWidth: 1
//        },
//
//
//        title: {
//            text: 'Trips between station'
//        },
//
//        xAxis: {
//            categories: stationList
//        },
//
//        yAxis: {
//            categories: stationList,
//            title: null
//        },
//
//        colorAxis: {
//            min: 0,
//            minColor: '#FFFFFF',
//            maxColor: Highcharts.getOptions().colors[7]
//        },
//
//        legend: {
//            align: 'right',
//            layout: 'vertical',
//            margin: 12,
//            verticalAlign: 'top',
//            y: 25,
//            symbolHeight: 455
//        },
//
//        tooltip: {
//            formatter: function () {
//                return 'From <b>' + this.series.xAxis.categories[this.point.x] + '</b><br>To <b>' + this.series.yAxis.categories[this.point.y] + '</b><br>trips <b>' + this.point.value + '<b>';
//            }
//        },
//
//        series: [{
//            name: 'Trips per station',
//            borderWidth: 1,
//            data: tripsData,
//            dataLabels: {
//                enabled: true,
//                color: 'black',
//                style: {
//                    textShadow: 'none'
//                }
//            }
//        }]
//
//    });
//    }
//    
//});