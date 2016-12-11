angular.module('mapprojectApp')
    .directive('ltMap', {
      restrict: 'E',
      scope: {
        coordList: '=coords',
        currentPos: '=position',
      },
      link(scope, element, attrs) {
        const mapConfig = {
          min: 0,
          max: null,
          group: new L.LayerGroup(),
          canvasLayer: L.canvas(),
          pointSet: [],
          pointSetAlreadyAdded: [],
          currentLat: '',
          currentLong: '',
        };

        const map = L.map('map').setView([51.106739, -114.913696], 4);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);

        /* Watch the position attribute for changes and draw a dot on
        the map to represent the current location */
        scope.$watch('currentPos', (newVal) => {
          const lat = mapConfig.currentLat = newVal.latitude;
          const long = mapConfig.currentLong = newVal.longitude;
          const latLng = L.latLng(lat, long);
          L.circle(latLng, 200).addTo(mapConfig.map);
          mapConfig.map.setView(latLng);
        }, true);

        /* Watch the coordinate list for changes and respond by redrawing the points on the map */
        scope.$watch('coordList', (newVal) => {
            /* Reset the canvas layer */
          if (mapConfig.group.getLayers()) {
            mapConfig.map.removeLayer(mapConfig.canvasLayer);
            mapConfig.canvasLayer = L.canvas();
          }
          aggregatePoint(data, mapConfig, aggregateCB);
        });
      },
    });
