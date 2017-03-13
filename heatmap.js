$(function() {
    $('#chartTitle').text("Heatmap");

    // **** Highchart theme starts ****
    // Load the fonts
    //Highcharts.createElement('link', {
    //   href: 'https://fonts.googleapis.com/css?family=Unica+One',
    //   rel: 'stylesheet',
    //   type: 'text/css'
    //}, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
        ],
        chart: {
            height: 200,
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063',
            height: 800
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);

    // **** highchart theme ends ****


    //populating NAV and re

    $("#nav").load('/WebsiteData/HTML/Templates/nav.html');
    $("#HeatShowOtherGraphs").load('/WebsiteData/HTML/Templates/myModal.html');
    $.getScript('/WebsiteData/JS/myModal.js', function() {
        console.log("modal script loaded..");
    });


    var stationList = [];
    var tripsData = [];
    var myData = null;
    var myLocation = null;
    var userType = null;
    var dayType = null;

    /// listeners



    $("#city,#userType,#day").on('change', function() {
        // //console.log("city/UserType,Day.. some things has been changed");
        tripsData = null; // reinitialization
        tripsData = [];
        // according to selected City loding the stations names
        myLocation = $("#city option:selected").text();
        userType = $("#userType option:selected").text();
        dayType = $("#day option:selected").text();
        //console.log("userType:"+ userType + " ," + "dayType:" +dayType );
        stationList = null; // initit
        stationList = [];
        getStationsList(myData);
        // according to City/ Usertype / days type selecting the GetTrip json (parametre)
        var type = getTripType(userType, dayType);
        getTrips(type);
        //console.log("loading completed..");
    });
    // end of listeners

    //AllAll SubAll custAll SubDay custDay AllDay
    function getTripType(userType, dayType) {
        var type = null;
        if (userType == "All" && dayType == "All days") {
            type = "AllAll";
        } else if (userType == "All" && dayType !== "All days") {
            type = "AllDay";
        } else if (userType == "Subscriber" && dayType == "All days") {
            type = "SubAll";
        } else if (userType == "Customer" && dayType == "All days") {
            type = "custAll";
        } else if (userType == "Subscriber" && dayType !== "All days") {
            type = "SubDay";
        } else if (userType == "Customer" && dayType !== "All days") {
            type = "custDay";
        }

        return type;

    }
    //

    /// api's initial load

    $.getJSON("data/station.json", function(data) {
        //  default : subscriber = All  days =AllDays
        myData = data;
        myLocation = data[1].landmark;
        //console.log("setting the landmark..");
        getStationsList(data);
        getTrips("AllAll"); // bydefault it will load for City : first in Json and sub =All Days= All
    });


    ////
    function getStationsList(data) {
        data.forEach(function(item) {
            if (item.landmark == myLocation && item.station_id != 46 && item.station_id != 47) {
                stationList.push(item.name);
            }
        });
    }

    function getTrips(type) {
        // possible types : AllAll SubAll custAll SubDay custDay
        var currentData;
        if (type == "AllAll") {
            $.getJSON("data/stationTrips.json", function(data) {
                currentData = data;
                plotMe("AllAll");
            });
        } else if (type == "AllDay") {
            $.getJSON("data/stationTripsDaywise.json", function(data) {
                currentData = data;
                plotMe("AllDay");
            });

        } else if (type == "SubAll") {
            $.getJSON("data/stationTripsWithSubscriber.json", function(data) {
                currentData = data;
                //console.log("station List :");
                //console.log(stationList);
                plotMe("SubAll");
            });

        } else if (type == "custAll") {
            $.getJSON("data/stationTripsWithSubscriber.json", function(data) {
                currentData = data;
                plotMe("custAll");
            });

        } else if (type == "SubDay") {
            $.getJSON("data/stationTripsDaywiseWithSubscriber.json", function(data) {
                currentData = data;
                plotMe("SubDay");
            });

        } else if (type == "custDay") {
            $.getJSON("data/stationTripsDaywiseWithSubscriber.json", function(data) {
                currentData = data;
                plotMe("custDay");
            });

        }
        // inner function as closure
        function plotMe(dataType) {
            getTripData(currentData, dataType);
            //console.log("tripsData:");
            //console.log(tripsData);
            //console.log("station list:");
            //console.log(stationList);
            plotHeatmap();
        }
    }

    function getTripData(data, dataType) {
        tripsData = []; // init
        data.forEach(function(item) {
            if (item.hasOwnProperty("day_of_week") && item.hasOwnProperty("subscriber_type")) {
                //console.log("found : usertype" + userType  );
                if (item.city == myLocation && stationList.indexOf(item.start_station) != -1 && stationList.indexOf(item.end_station) != -1 && item.day_of_week == dayType && item.subscriber_type == userType) {

                    var trip = [];
                    trip.push(stationList.indexOf(item.start_station));
                    trip.push(stationList.indexOf(item.end_station));
                    trip.push(item.trips);
                    tripsData.push(trip);

                }
            } else if (item.hasOwnProperty("day_of_week") && (!item.hasOwnProperty("subscriber_type"))) {
                // CustDay SusDay
                if (item.city == myLocation && stationList.indexOf(item.start_station) != -1 && stationList.indexOf(item.end_station) != -1 && item.day_of_week == dayType) {
                    var trip = [];
                    trip.push(stationList.indexOf(item.start_station));
                    trip.push(stationList.indexOf(item.end_station));
                    trip.push(item.trips);
                    tripsData.push(trip);

                }
            } else if ((!item.hasOwnProperty("day_of_week")) && (item.hasOwnProperty("subscriber_type"))) {
                // means the file we are targetting is for AllDays , so pushing the data directly
                if (item.city == myLocation && stationList.indexOf(item.start_station) != -1 && stationList.indexOf(item.end_station) != -1 && item.subscriber_type == userType) {
                    var trip = [];
                    trip.push(stationList.indexOf(item.start_station));
                    trip.push(stationList.indexOf(item.end_station));
                    trip.push(item.trips);
                    tripsData.push(trip);

                }
            } else if ((!item.hasOwnProperty("day_of_week")) && (!item.hasOwnProperty("subscriber_type"))) {
                // AllAll
                if (item.city == myLocation && stationList.indexOf(item.start_station) != -1 && stationList.indexOf(item.end_station) != -1) {
                    var trip = [];
                    trip.push(stationList.indexOf(item.start_station));
                    trip.push(stationList.indexOf(item.end_station));
                    trip.push(item.trips);
                    tripsData.push(trip);

                }
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
                align: 'center',
                layout: 'horizontal',
                //            margin: 12,
                verticalAlign: 'bottom'
                //            y: 25
                //            symbolHeight: 455
            },

            tooltip: {
                formatter: function() {
                    return 'From <b>' + this.series.xAxis.categories[this.point.x] + '</b><br>To <b>' + this.series.yAxis.categories[this.point.y] + '</b><br>trips <b>' + this.point.value + '<b>';
                }
            },

            series: [{
                name: 'Trips per station',
                borderWidth: 0,
                data: tripsData,
                nullColor: '#000000',
                //            dataLabels: {
                //                enabled: true,
                //                color: 'black',
                //                style: {
                //                    textShadow: 'none'
                //                }
                //            },
                turboThreshold: Number.MAX_VALUE
            }]

        });
    }

});