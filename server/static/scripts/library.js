

function aggregatePoint(dataList, config) {
   /* Transform each dataItem and throw it on the map */
  arr.map((item) => {
    const mapItem = {
      lat: item.LATITUDE,
      long: item.LONGITUDE,
      intensity: item.SIZE_HA,
      last: false,
    };
    pushIntoPointSet(mapItem, config);
    return mapItem;
  });
}

function pushIntoPointSet(point, config, cb) {
  const marker = new L.marker([point.lat, point.long]).toGeoJSON();

    // remap properties from point to the new marker object
  marker.intensity = point.intensity;
    //			console.log(marker.intensity);
  config.pointSet.push(marker); // Push the newly created marker onto the stack
  if (point.last == true) {
        // var group = new L.LayerGroup();
    for (let i = 0; i < config.pointSet.length; i++) {
            //						debugger;
            //						pointSet[i].addTo(map);
      L.geoJson(config.pointSet[i], {
        pointToLayer(feature, latlng) {
          const intensity = parseInt(config.pointSet[i].intensity);
          const intensityRadius = intensity / 2;
          const markerOptions = {
            stroke: false,
            clickable: true,
            fillOpacity: 1,
            renderer: config.canvasLayer,
            radius: intensityRadius,
            fillColor: '#671c03',
          };
                    // Colour options from lowest to highest hectares burned


          config.group.addLayer(new L.circle(latlng, intensityRadius, markerOptions));
          return L.circleMarker(latlng, markerOptions);
        },
      });
    }

    config.pointSetAlreadyAdded.push(config.pointSet);
    config.pointSet = [];
    cb(config.group, config);
        //				debugger;
  }
}

// :TODO Strip this callback out entirely
function aggregateCB(cheese) {
  if (isArray(cheese) && cheese.length !== 0) {
        //				debugger;
    console.log('Callback called');
    console.time('Cheese');
        //				var newTime = window.setTimeout(aggregatePoint, 1, cheese, aggregateCB);
  } else {
    console.log('Done');
  }
}

function isArray(arr) {
  if (arr !== undefined && arr !== null) {
    if (arr.pop && typeof arr.pop === 'function') {
      return true;
    } else {
      return false;
    }
  }
}

