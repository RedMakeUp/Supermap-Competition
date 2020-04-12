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
  maxZoom: 15,
  minZoom: 15,
  zoom: 14,
  zoomControl: false
});
// map.on('click',(e) => {
//   console.log(e);
// });
L.supermap.tiledMapLayer(url).addTo(map);
// --------------------------------------------------------------


// 毒气扩散区生成，一个扩散区由两个圆形，一条线段和一个文本组成
// @centerPos     中心位置，经纬度组成的数组，如[lat,lng]
// @mainColor     主体颜色，字符串，如'#f00'
// @angle         线段的倾斜角，角度制
// @lineLen       线段长度，单位米
// @areaRadius    圆形的半径，单位米
// @dotRadius     小园点的半径，单位米
// @textClassName 文字要使用的css类名
//
// Note:
//  目前是静态的，后期可以通过‘divIcon’+‘CSS’(@areaDie_text)或者直接requestAnimationFrame()让其动起来
// --------------------------------------------------------------
function generateArea(centerPos, mainColor, angle, lineLen, areaRadius, dotRadius, textClassName,text){
  // 圆形区域
  let circleStyle = {
    radius: areaRadius, // In meters
    fillColor: mainColor,
    fillOpacity: 0.2,
    color: mainColor,
    opacity: 0.4
  };
  let area_circle = L.circle(centerPos, circleStyle);
  // 线段
  let theta = angle / 180.0 * Math.PI;
  let lineStyle = {
    color: mainColor,
    opacity: 0.6
  };
  let x = lineLen * Math.cos(theta);
  let y = lineLen * Math.sin(theta);
  let xy_unproj = L.CRS.EPSG3857.unproject(L.point(x, y));
  let coords = [centerPos[0] + xy_unproj.lat, centerPos[1] + xy_unproj.lng];
  let area_line = L.polyline([centerPos, coords], lineStyle);
  // 线段一端的点
  let dotStyle = {
    radius: dotRadius, // In meters
    fillColor: mainColor,
    fillOpacity: 0.8,
    color: mainColor,
    opacity: 0.0
  };
  let area_dot = L.circle(coords, dotStyle);
  // 文字
  var myTextIcon = L.divIcon({className: textClassName,html: "<div class=" + textClassName + ">" + text +"</div>"});
  let area_text = L.marker(centerPos, {icon: myTextIcon});
  // 封装在一起，便于操作
  return {
    circle: area_circle,
    line: area_line,
    dot: area_dot,
    text: area_text,
    show: false,
  };
}
// --------------------------------------------------------------


// 添加或者删除某个扩散区域到地图
// --------------------------------------------------------------
function addAreaToMap(area){
  area.show = true;
  area.circle.addTo(map);
  area.line.addTo(map);
  area.dot.addTo(map);
  area.text.addTo(map);
}
function removeAreaFromMap(area){
  area.show = false;
  area.circle.remove(map);
  area.line.remove(map);
  area.dot.remove(map);
  area.text.remove(map);
}
// --------------------------------------------------------------

function resetAllArea(){
  if(areaDie.show) removeAreaFromMap(areaDie);
  if(areaSevere.show) removeAreaFromMap(areaSevere);
  if(areaMinor.show) removeAreaFromMap(areaMinor);
  if(areaInhalation.show) removeAreaFromMap(areaInhalation);
}

var areaDie = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#f00',
  -45.0,
  160,
  150,
  25,
  'area-die-text',
  '150m'
);
var areaSevere = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#0f0',
  -45.0,
  420,
  400,
  30,
  'area-severe-text',
  '400m'
);
var areaMinor = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#00f',
  -45.0,
  840,
  800,
  40,
  'area-minor-text',
  '800m'
);
var areaInhalation = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#0ff',
  -45.0,
  1570,
  1500,
  50,
  'area-inhalation-text',
  '1500m'
);