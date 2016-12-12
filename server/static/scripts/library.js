function aggregatePoints(dataList, renderer) {
   /* Transform each dataItem and throw it on the map */
  return dataList.map((item) => {
     /* Transform each dataItem into a configured circleMarker */
    return getCircleMarker({
      lat: item.LATITUDE,
      long: item.LONGITUDE,
      intensity: item.SIZE_HA,
      last: false,
    }, renderer);
  });
}

function getCircleMarker(point, renderer) {
  const latLng = [point.lat, point.long];
  const intensity = parseInt(point.intensity);
  const intensityRadius = intensity / 2;
  const markerOptions = {
    stroke: false,
    clickable: true,
    fillOpacity: 1,
    renderer: config.canvasLayer,
    radius: intensityRadius,
    fillColor: '#671c03',
  };
  return L.circleMarker(latLng, markerOptions);
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

function getMarker(latLng, options) {
  const marker = new L.marker(latLng).toGeoJSON();
  marker.intensity = options.intensity;
  return marker;
}
