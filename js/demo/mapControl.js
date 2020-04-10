var host = "http://60.205.181.110:8090";
var url = host + "/iserver/services/map-city-2/rest/maps/City@CityData";
var serverUrl = host + "/iserver/services/plot-jingyong/rest/plot/";
var map;

// 添加化工厂地图
// --------------------------------------------------------------
map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.EPSG3857,
  center: [30.628228073321804, 103.70288014411928],// Currently for facility, but [30.6107, 103.6992] for map center
  maxZoom: 17,
  minZoom: 17,
  zoom: 14,
  zoomControl: false
});
// map.on('click',(e) => {
//   console.log(e);
// });
L.supermap.tiledMapLayer(url).addTo(map);
// --------------------------------------------------------------


// 毒气扩散区分析
// Note:
//  目前是静态的，后期可以通过‘divIcon’+‘CSS’(@areaDie_text)或者直接requestAnimationFrame()让其动起来
// --------------------------------------------------------------
// 圆形区域
let facilityCords = [30.628228073321804, 103.70288014411928]
let areaDirColor = '#ff0000';
let areaDieStyle_circle = {
  radius: 150, // In meters
  fillColor: areaDirColor,
  fillOpacity: 0.2,
  color: areaDirColor,
  opacity: 0.4
};
let areaDie_circle = L.circle(facilityCords, areaDieStyle_circle).addTo(map);
// 线段
let theta = -45.0 / 180.0 * Math.PI;
let areaDieStyle_line = {
  color: areaDirColor,
  opacity: 0.6
};
let facilityCordsPorj = L.CRS.EPSG3857.project(L.latLng(facilityCords));
let lineLen = 160;// In meters
let x = lineLen * Math.cos(theta);
let y = lineLen * Math.sin(theta);
let centerCoords = L.CRS.EPSG3857.unproject(L.point(x, y));
let coords = [facilityCords[0] + centerCoords.lat, facilityCords[1] + centerCoords.lng];
let areaDie_line = L.polyline([facilityCords, coords], areaDieStyle_line).addTo(map);
// 线段一端的点
let areaDieStyle_dot = {
  radius: 10, // In meters
  fillColor: areaDirColor,
  fillOpacity: 0.8,
  color: areaDirColor,
  opacity: 0.0
};
let areaDie_dot = L.circle(coords, areaDieStyle_dot).addTo(map);
// 文字
var myTextIcon = L.divIcon({className: 'area-die-text',html: "<div class='area-die-text'>150m</div>"});
let areaDie_text = L.marker(facilityCords, {icon: myTextIcon}).addTo(map);
// --------------------------------------------------------------
