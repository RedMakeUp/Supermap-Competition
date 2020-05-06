// 连接到服务器
// --------------------------------------------------------------
var isUseDefaultService = false;
var host = "https://iserver.supermap.io";
var mapUrl = host + "/iserver/services/map-china400/rest/maps/China";
var roadNetUrl = null;
if(!isUseDefaultService){
  host = "http://60.205.181.110:8090";
  mapUrl = host + "/iserver/services/map-City/rest/maps/City%40EmergDS";
  roadNetUrl = host + "/iserver/services/transportationAnalyst-City/rest/networkanalyst/EmergDS_Network@EmergDS";
}
// --------------------------------------------------------------


// 工厂和医院的坐标
// --------------------------------------------------------------
class BuildingInfo{
  constructor(lat, lng, name, desc){
    this.name = name;
    this.desc = desc;
    this.lat = lat;
    this.lng = lng;
    this.marker = L.marker([lat, lng]);
    this.marker.bindPopup(desc);
  }

  get latLngPos(){
    return L.latLng(this.lat, this.lng);
  }

  get lngLatPos(){
    return L.latLng(this.lng, this.lat);
  }

  get latLngArray(){
    return [this.lat, this.lng];
  }
}

var chemicalWork = new BuildingInfo(3584569.32263774, 11544353.69838877, "chemicalWork", "化工厂<br><br>平面坐标<br>X:11544353.698<br>Y:3584569.323");
var hospitals = [
  new BuildingInfo(3585320.698, 11542483.019, "市骨科康复医院", "市骨科康复医院<br><br>平面坐标<br>X:11542483.019<br>Y:3585320.698"),
  new BuildingInfo(3583072.010, 11545579.047, "市中医院", "市中医院<br><br>平面坐标<br>X:11545579.047<br>Y:3583072.010"),
  new BuildingInfo(3580523.653, 11545235.573, "某军区总医院", "某军区总医院<br><br>平面坐标<br>X:11545235.573<br>Y:3580523.653"),
  new BuildingInfo(3582031.027, 11543943.779, "仁爱医院", "仁爱医院<br><br>平面坐标<br>X:11543943.779<br>Y:3582031.027"),
  new BuildingInfo(3582697.889, 11542678.481, "市第一人民医院", "市第一人民医院<br><br>平面坐标<br>X:11542678.481<br>Y:3582697.889"),
  new BuildingInfo(3582627.885, 11541378.165, "城南医院", "城南医院<br><br>平面坐标<br>X:11541378.165<br>Y:3582627.885")
];

function removeHospitals(){
  hospitals.forEach((hospital) => {
    if(map.hasLayer(hospital.marker)){
      hospital.marker.removeFrom(map);
    }
  });
}

function addHospitals(){
  hospitals.forEach((hospital) => {
    if(!map.hasLayer(hospital.marker)){
      hospital.marker.addTo(map);
    }
  });
}
// --------------------------------------------------------------


// 添加化工厂地图
// --------------------------------------------------------------
var mapOriginCenter = [(3579087.71 + 3585516.41) / 2, (11541226.6 + 11546271.45) / 2];
var map = L.map('map', {
  preferCanvas: true,
  crs: L.CRS.NonEarthCRS({
    bounds: L.bounds([11541226.6 , 3579087.71], [ 11546271.45 , 3585516.41]),
    origin: L.point(11541226.6 , 3585516.41)
  }),
  center: mapOriginCenter,
  maxZoom: 4,
  minZoom: 1,
  zoom: 1,
  zoomControl: false
});
map.on('zoom', changeForZoom);

// map.dragging.disable();
map.scrollWheelZoom.disable();
map.doubleClickZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
L.supermap.tiledMapLayer(mapUrl).addTo(map);

function resetMap(){
  removeCurrentRoute();
  removeHospitals();
  resetAllArea();
  map.setView(mapOriginCenter, 1);
}
// --------------------------------------------------------------

// 标记化工厂
// --------------------------------------------------------------
// chemicalWork.marker.addTo(map);
// --------------------------------------------------------------

// 最近设施分析
// --------------------------------------------------------------
// 创建最近设施分析服务实例
var findClosetFacilitiesService = L.supermap.networkAnalystService(roadNetUrl);
// 创建最近设施分析参数实例
var resultSetting = new SuperMap.TransportationAnalystResultSetting({
  returnEdgeFeatures: true,
  returnEdgeGeometry: true,
  returnEdgeIDs: true,
  returnNodeFeatures: true,
  returnNodeGeometry: true,
  returnNodeIDs: true,
  returnPathGuides: true,
  returnRoutes: true
});
var analystParameter = new SuperMap.TransportationAnalystParameter({
  resultSetting: resultSetting,
  weightFieldName: "SmLength"
});
// 当前显示的路径
var currentRoute = null;

// 给定一家医院的位置，动态显示其到工厂的最短路径
function findCloestRoute(hospitalPos){
  let findClosetFacilitiesParameter = new SuperMap.FindClosestFacilitiesParameters({
    event: chemicalWork.latLngPos,
    expectFacilityCount: 1,
    facilities: [hospitalPos],
    isAnalyzeById: false,
    parameter: analystParameter
  });
  //进行查找
  findClosetFacilitiesService.findClosestFacilities(findClosetFacilitiesParameter, function (serviceResult) {
    let result = serviceResult.result;
  
    // 解析服务器返回结果
    let routeCoords = [];
    result.facilityPathList.map((path) => {
      path.route.geometry.coordinates[0].forEach((coord) => {
        routeCoords.push([coord[1], coord[0]]);
      });
    });

    // 清除当前显示的路径
    removeCurrentRoute();
    // 添加新的路径
    currentRoute = L.polyline(routeCoords, {snakingSpeed: 200});
    currentRoute.addTo(map).snakeIn();
  });
}

// 清除当前地图的路径
function removeCurrentRoute(){
  if(currentRoute !== null){
    currentRoute.removeFrom(map);
    currentRoute = null;
  }
}
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
  let theta = angle / 180.0 * Math.PI;
  let endX = centerPos[0] + areaRadius * Math.cos(theta);
  let endY = centerPos[1] + areaRadius * Math.sin(theta);
  // let coords = L.GeometryUtil.destination(L.latLng(centerPos), angle, areaRadius);
  let coords = [endX, endY];
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
  chemicalWork.latLngArray,
  '#f00',
  120.0,
  150,
  20,
  'area-die-text',
  '150m'
);
var areaSevere = generateArea(
  chemicalWork.latLngArray,
  '#FF9933',
  120.0,
  400,
  30,
  'area-severe-text',
  '400m'
);
var areaMinor = generateArea(
  chemicalWork.latLngArray,
  '#00f',
  120.0,
  800,
  40,
  'area-minor-text',
  '800m'
);
var areaInhalation = generateArea(
  chemicalWork.latLngArray,
  '#0f0',
  120.0,
  1500,
  50,
  'area-inhalation-text',
  '1500m'
);