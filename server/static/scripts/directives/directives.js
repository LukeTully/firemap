angular.module('mapprojectApp')
    .directive("ltMap", function () {
        return {
            restrict: "E",
            scope: {
                coordList: "=coords",
                currentPos: "=position"
            },
            link: function (scope, element, attrs) {
                var map = L.map('map').setView([51.106739, -114.913696], 4);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);


                var mapConfig = {
                    min: 0,
                    max: null,
                    group: new L.LayerGroup(),
                    canvasLayer: L.canvas(),
                    pointSet: [],
                    pointSetAlreadyAdded: [],
                    map: map,
                    currentLat: "",
                    currentLong: "",
                };
                scope.$watch(attrs.position, function (newVal, oldVal) {
                    if (newVal.latitude !== "") {
                        mapConfig.currentLat = newVal.latitude;
                        mapConfig.currentLong = newVal.longitude;
                        var latlng = L.latLng(mapConfig.currentLat, mapConfig.currentLong);
                        L.circle(latlng, 200).addTo(mapConfig.map);
                        mapConfig.map.setView(latlng);
                    }

                }, true);


                scope.$watch('coordList', function (newVal, oldVal) {
                    data = newVal;

                    console.log("Triggered");
                    if (newVal) {
                        console.log("Aggregating");
//		var geoProvs = L.geoJson(provinces, {
//			style: {
//				color: "#000000",
//				weight: 1,
//				fill: false
//			}
//		});

//		geoProvs.addTo(map);

//
//		var markers = new L.marker,
//				potholePriority = [],
//				u = 0;

// TODO: Loop and add markers here

// Match priority value
//		var priorityRegex = /Priority (\d)/;
//		var holes = potholes.features[0].items;


                        if (mapConfig.max) {
                            data = data.splice(mapConfig.min, mapConfig.max);
                        }
                        if (mapConfig.group.getLayers()) {
                            console.log("has layers");
                            mapConfig.map.removeLayer(mapConfig.canvasLayer);
                            mapConfig.canvasLayer = L.canvas();
                        }
                        console.log("Cleared");
                        aggregatePoint(data, mapConfig, aggregateCB);


                    }

                });


            }
        }
    });


function aggregatePoint(dataList, config, cb) {
    console.log(config);
    console.timeEnd("Cheese");
    //debugger;
    // check if this is an array of arrays
    if (isArray(dataList)) {
        if (isArray(dataList[0])) {
            console.log("Looping started");
            loopOverArrayForPoints(dataList[0], config, function (config) {
                console.log("Looping Ended");
                dataList.splice(0, 1);
                cb(dataList, config);
            });
        }
        else {
            console.log("Looping started");
            loopOverArrayForPoints(dataList, config, function (config) {
                console.log("Looping Ended");

                cb(dataList, config);
            });
        }
    }
    else {
        throw "datalist was not an array";
    }
};
function pushIntoPointSet(point, config, cb) {
    var marker = new L.marker([point.lat, point.long]).toGeoJSON();

    // remap properties from point to the new marker object
    marker.intensity = point.intensity;
//			console.log(marker.intensity);
    config.pointSet.push(marker); // Push the newly created marker onto the stack
    if (point.last == true) {
        //var group = new L.LayerGroup();
        for (var i = 0; i < config.pointSet.length; i++) {
            //						debugger;
            //						pointSet[i].addTo(map);
            L.geoJson(config.pointSet[i], {
                pointToLayer: function (feature, latlng) {
                    var intensity = parseInt(config.pointSet[i].intensity);
                    var intensityRadius = intensity / 2;
                    var markerOptions = {
                        stroke: false,
                        clickable: true,
                        fillOpacity: 1,
                        renderer: config.canvasLayer,
                        radius: intensityRadius,
                        fillColor: "#671c03"
                    };
                    // Colour options from lowest to highest hectares burned


                    config.group.addLayer(new L.circle(latlng, intensityRadius, markerOptions));
                    return L.circleMarker(latlng, markerOptions);
                }
            });

        }

        config.pointSetAlreadyAdded.push(config.pointSet);
        config.pointSet = [];
        cb(config.group, config);
//				debugger;
    }

}

//:TODO Strip this callback out entirely
function aggregateCB(cheese) {
    if (isArray(cheese) && cheese.length !== 0) {
//				debugger;
        console.log("Callback called");
        console.time("Cheese");
//				var newTime = window.setTimeout(aggregatePoint, 1, cheese, aggregateCB);
    } else {
        console.log("Done");
    }
}

function isArray(arr) {
    if (arr !== undefined && arr !== null) {
        if (arr.pop && typeof arr.pop === "function") {
            return true;
        }
        else {
            return false;
        }
    }
}


function loopOverArrayForPoints(arr, config, cb) {
    for (var i = 0; i < arr.length; i++) {
        // Set the current object for reference later
//				this.currentSet = arr[i];

        //TODO: Write a more extensive test for this.
        if (parseInt(arr[i].LATITUDE) !== 0 && parseInt(arr[i].LONGITUDE) !== 0) {
            if (i > 50000) {
//						console.log(i);
            }
            if (i == arr.length - 1) {
                pushIntoPointSet({
                    lat: arr[i].LATITUDE,
                    long: arr[i].LONGITUDE,
                    intensity: arr[i].SIZE_HA,
                    last: true
                }, config, function (group, config) {
                    config.map.addLayer(group);
                    console.log("Added Points to map");

                });
                cb(); // One of a few spots that doesn't need to be sent the config
            }
            else {
                pushIntoPointSet({
                    lat: arr[i].LATITUDE,
                    long: arr[i].LONGITUDE,
                    intensity: arr[i].SIZE_HA,
                    last: false
                }, config);
            }

        }
        else {
            console.log("Could not parse proper coords from this object:");
            console.log(arr[i]);
            arr.splice(i, 1);
            i = i - 2;
        }

    }
}
