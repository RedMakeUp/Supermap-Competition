var host = window.isLocal ? window.server : "https://iserver.supermap.io";
var url = host + "/iserver/services/map-china400/rest/maps/China_4326";
var serverUrl = host + "/iserver/services/plot-jingyong/rest/plot/";


var map;
map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.EPSG4326,
  center: [35, 104],
  maxZoom: 18,
  zoom: 3
});
L.supermap.tiledMapLayer(url).addTo(map);
