angular.module('mapprojectApp')
    .directive('ltMap', {
      restrict: 'E',
      scope: {
        coordList: '=coords',
        currentPos: '=position',
      },
      link(scope, element, attrs) {
        const map = L.map('map').setView([51.106739, -114.913696], 4);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);
        const mapConfig = {
          min: 0,
          max: null,
          group: new L.LayerGroup(),
          canvasLayer: L.canvas(),
          pointSet: [],
          pointSetAlreadyAdded: [],
          map,
          currentLat: '',
          currentLong: '',
        };
        scope.$watch(attrs.position, (newVal) => {
          if (newVal.latitude !== '') {
            mapConfig.currentLat = newVal.latitude;
            mapConfig.currentLong = newVal.longitude;
            const latlng = L.latLng(mapConfig.currentLat, mapConfig.currentLong);
            L.circle(latlng, 200).addTo(mapConfig.map);
            mapConfig.map.setView(latlng);
          }
        }, true);
        scope.$watch('coordList', (newVal) => {
          let data = newVal;
          if (newVal) {
            if (mapConfig.max) {
              data = data.splice(mapConfig.min, mapConfig.max);
            }
            if (mapConfig.group.getLayers()) {
              mapConfig.map.removeLayer(mapConfig.canvasLayer);
              mapConfig.canvasLayer = L.canvas();
            }
            aggregatePoint(data, mapConfig, aggregateCB);
          }
        });
      },
    });
