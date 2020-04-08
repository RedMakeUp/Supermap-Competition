var host = "http://60.205.181.110:8090";
var url = host + "/iserver/services/map-city-2/rest/maps/City@CityData";
var serverUrl = host + "/iserver/services/plot-jingyong/rest/plot/";
var map;


map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.EPSG3857,
  center: [30.6107, 103.6992],
  maxZoom: 18,
  minZoom:12,
  zoom: 14,
  zoomControl: false
});
L.supermap.tiledMapLayer(url).addTo(map);
