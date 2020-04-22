var isUseDefaultService = true;
var host = "https://iserver.supermap.io";
var url = host + "/iserver/services/map-china400/rest/maps/China";
if(!isUseDefaultService){
  host = "http://60.205.181.110:8090";
  url = host + "/iserver/services/map-city-2/rest/maps/City@CityData";
}

var map;

// 添加化工厂地图
// --------------------------------------------------------------
map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.EPSG3857,
  center: [30.628228073321804, 103.70288014411928],// Currently for facility, but [30.6107, 103.6992] for map center
  maxZoom: 16,
  minZoom: 14,
  zoom: 15,
  zoomControl: false
});
map.on('zoom', changeForZoom);
L.supermap.tiledMapLayer(url).addTo(map);
// --------------------------------------------------------------


// 不同的Zoom等级，定义不同的行为
// --------------------------------------------------------------
function changeForZoom(){
  var zoomLevel = map.getZoom();

  var areaDieText = $('#area-die-text');
  var areaSevereText = $('#area-severe-text');
  var areaMinorText = $('#area-minor-text');
  var areaInhalationText = $('#area-inhalation-text');

  switch (zoomLevel) {
      case 14:
        changeForZoom_14(areaDieText, areaSevereText, areaMinorText, areaInhalationText);
        break;
      case 15:
        changeForZoom_15(areaDieText, areaSevereText, areaMinorText, areaInhalationText);
        break;
      case 16:
        changeForZoom_16(areaDieText, areaSevereText, areaMinorText, areaInhalationText);
        break;
  }
}

function changeForZoom_14(areaDieText, areaSevereText, areaMinorText, areaInhalationText){
  if(areaDieText.length !== 0){
    areaDieText.css('font-size', 5);
    areaDieText.css('transform', 'rotate(30deg) translate(8px,-5px)');
  }
  
  if(areaSevereText.length !== 0){
    areaSevereText.css('font-size', 15);
    areaSevereText.css('transform', 'rotate(30deg) translate(10px,-15px)');
  }

  if(areaMinorText.length !== 0){
    areaMinorText.css('font-size', 25);
    areaMinorText.css('transform', 'rotate(30deg) translate(15px,-25px)');
  }

  if(areaInhalationText.length !== 0){
    areaInhalationText.css('font-size', 35);
    areaInhalationText.css('transform', 'rotate(30deg) translate(35px,-35px)');
  }
}

function changeForZoom_15(areaDieText, areaSevereText, areaMinorText, areaInhalationText){
  if(areaDieText.length !== 0){
    areaDieText.css('font-size', 10);
    areaDieText.css('transform', 'rotate(30deg) translate(10px,-10px)');
  }
  
  if(areaSevereText.length !== 0){
    areaSevereText.css('font-size', 25);
    areaSevereText.css('transform', 'rotate(30deg) translate(15px,-25px)');
  }

  if(areaMinorText.length !== 0){
    areaMinorText.css('font-size', 35);
    areaMinorText.css('transform', 'rotate(30deg) translate(55px,-35px)');
  }

  if(areaInhalationText.length !== 0){
    areaInhalationText.css('font-size', 45);
    areaInhalationText.css('transform', 'rotate(30deg) translate(115px,-45px)');
  }
}

function changeForZoom_16(areaDieText, areaSevereText, areaMinorText, areaInhalationText){
  if(areaDieText.length !== 0){
    areaDieText.css('font-size', 20);
    areaDieText.css('transform', 'rotate(30deg) translate(10px,-20px)');
  }
  
  if(areaSevereText.length !== 0){
    areaSevereText.css('font-size', 35);
    areaSevereText.css('transform', 'rotate(30deg) translate(50px,-35px)');
  }

  if(areaMinorText.length !== 0){
    areaMinorText.css('font-size', 45);
    areaMinorText.css('transform', 'rotate(30deg) translate(135px,-45px)');
  }

  if(areaInhalationText.length !== 0){
    areaInhalationText.css('font-size', 65);
    areaInhalationText.css('transform', 'rotate(30deg) translate(225px,-65px)');
  }
}
// --------------------------------------------------------------


// 毒气扩散区生成，一个扩散区由两个圆形，一条线段和一个文本组成
// @centerPos     中心位置，经纬度组成的数组，如[lat,lng]
// @mainColor     主体颜色，字符串，如'#f00'
// @angle         线段的倾斜角，角度制
// @areaRadius    圆形的半径，单位米
// @dotRadius     小园点的半径，单位米
// @textClassName 文字要使用的css类名
//
// Note:
//  目前是静态的，后期可以通过‘divIcon’+‘CSS’(@areaDie_text)或者直接requestAnimationFrame()让其动起来
// --------------------------------------------------------------
function generateArea(centerPos, mainColor, angle, areaRadius, dotRadius, textClassName,text){
  // 圆形区域
  let circleStyle = {
    radius: areaRadius, // In meters
    fillColor: mainColor,
    fillOpacity: 0.45,
    color: mainColor,
    opacity: 0.5
  };
  let area_circle = L.circle(centerPos, circleStyle);
  // 线段
  let lineStyle = {
    color: mainColor,
    opacity: 0.6
  };
  let coords = L.GeometryUtil.destination(L.latLng(centerPos), angle, areaRadius);
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
  var myTextIcon = L.divIcon({
    className: "my-div-icon",
    html: "<div class=area-text " + "id=\"" +textClassName + "\">" + text +"</div>"
  });
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

  changeForZoom();
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
  120.0,
  150,
  20,
  'area-die-text',
  '150m'
);
var areaSevere = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#FF9933',
  120.0,
  400,
  30,
  'area-severe-text',
  '400m'
);
var areaMinor = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#00f',
  120.0,
  800,
  40,
  'area-minor-text',
  '800m'
);
var areaInhalation = generateArea(
  [30.628228073321804, 103.70288014411928],
  '#0f0',
  120.0,
  1500,
  50,
  'area-inhalation-text',
  '1500m'
);