


function aggregatePoint(dataList, config, cb) {
  loopOverArrayForPoints(dataList, config, () => {
        cb(dataList, config);
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


function loopOverArrayForPoints(arr, config, cb) {
  for (let i = 0; i < arr.length; i++) {
        // Set the current object for reference later
        //				this.currentSet = arr[i];

        // TODO: Write a more extensive test for this.
    if (parseInt(arr[i].LATITUDE) !== 0 && parseInt(arr[i].LONGITUDE) !== 0) {
      if (i > 50000) {
                //						console.log(i);
      }
      if (i == arr.length - 1) {
        pushIntoPointSet({
          lat: arr[i].LATITUDE,
          long: arr[i].LONGITUDE,
          intensity: arr[i].SIZE_HA,
          last: true,
        }, config, (group, config) => {
            config.map.addLayer(group);
            console.log('Added Points to map');
          });
        cb(); // One of a few spots that doesn't need to be sent the config
      } else {
        pushIntoPointSet({
          lat: arr[i].LATITUDE,
          long: arr[i].LONGITUDE,
          intensity: arr[i].SIZE_HA,
          last: false,
        }, config);
      }
    } else {
      console.log('Could not parse proper coords from this object:');
      console.log(arr[i]);
      arr.splice(i, 1);
      i -= 2;
    }
  }
}
