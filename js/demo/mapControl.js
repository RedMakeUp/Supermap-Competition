var host = window.isLocal ? window.server : "https://iserver.supermap.io";
var url = host + "/iserver/services/map-china400/rest/maps/China_4326";
var serverUrl = host + "/iserver/services/plot-jingyong/rest/plot/";
var map;

// 点击地图，触发动态线
let latlngs = [
  [ 36.2109375, 89.384765625 ],
  [ 38.759765625, 95.888671875 ],
  [ 32.783203125, 96.591796875 ],
  [ 35.244140625, 106.171875 ],
  [ 45.52734375, 107.2265625 ],
  [ 36.474609375, 119.53125 ],
  [ 27.158203125, 115.3125 ],
  [25.3125, 106.962890625]
];
let line = null;


map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.EPSG4326,
  center: [35, 104],
  maxZoom: 18,
  zoom: 3,
  zoomControl: false
});
map.on('click',(e) => {
  if(line !== null){
    line.remove(map);
  }

  line = L.polyline(latlngs, {snakingSpeed: 200});
  line.addTo(map).snakeIn();
});

L.supermap.tiledMapLayer(url).addTo(map);
