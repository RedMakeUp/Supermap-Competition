// 移除或者添加医院标记
// --------------------------------------------------------------
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
map = L.map('map', {
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
map.on('load',() =>{
  console.log("loaded map");
});
map.on('zoom', () => {
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
});
map.on('click', (e) => {
  console.log(map.getPixelBounds());
});

// map.getPanes()["mapPane"].appendChild(
//   document.getElementById("idol-box")
// );

// map.dragging.disable();
map.scrollWheelZoom.disable();
map.doubleClickZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
L.supermap.tiledMapLayer(mapUrl).addTo(map);

// 清除地图上的一切标记，并回到最初的大小
function resetMap(){
  removeCurrentRoute();
  removeHospitals();
  resetAllArea();
  map.setView(mapOriginCenter, 1);
}
// --------------------------------------------------------------


// 最近设施分析
// --------------------------------------------------------------
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
    if(serviceResult === undefined){
      alert("路网服务返回错误");
      return;
    }
    
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


function getPixelDistanceFromCenter(centerPos, distanceByMeter){
  let theta = 0 / 180.0 * Math.PI;
  let endX = centerPos[0] + distanceByMeter * Math.cos(theta);
  let endY = centerPos[1] + distanceByMeter * Math.sin(theta);
  let endPos = [endX, endY];

  let centerPoint = map.project(centerPos);
  let endPoint = map.project(endPos);
  
  return centerPoint.distanceTo(endPoint);
}

// 毒气扩散区生成，一个扩散区由两个圆形，一条线段和一个文本组成
// @centerPos     中心位置，经纬度组成的数组，如[lat,lng]
// @mainColor     主体颜色，字符串，如'#f00'
// @angle         线段的倾斜角，角度制
// @areaRadius    圆形的半径，单位米
// @dotRadius     小园点的半径，单位米
// @textClassName 文字要使用的css类名
// --------------------------------------------------------------
function generateArea(centerPos, mainColor, areaRadius, desc,cssId){
  let radiusByPixel = getPixelDistanceFromCenter(centerPos, areaRadius);
  let doubleRadiusByPixel = radiusByPixel * 2;

  let circleIcon = L.divIcon({
    className: "css-icon",
    html: "<div class='area' id=\'" + cssId + "\'><div class='sweep'></div></div>",
    iconSize: [doubleRadiusByPixel, doubleRadiusByPixel]
  });

  let ciecleMarker = L.marker(centerPos, {icon: circleIcon});
  ciecleMarker.bindTooltip(desc);

  return {
    id: cssId,
    size: doubleRadiusByPixel,
    color: mainColor,
    marker: ciecleMarker,
    show: false,
  };
}
// --------------------------------------------------------------


// 添加或者删除某个扩散区域到地图
// --------------------------------------------------------------
function addAreaToMap(area){
  area.show = true;
  area.marker.addTo(map);

  $("#"+area.id).css({
    "width": area.size.toString()+"px",
    "height": area.size.toString()+"px",
    // "background-color": area.color
  });

  $("#"+area.id +" .sweep").css({
    "width": (area.size / 2).toString()+"px",
    "height": (area.size / 2).toString()+"px",
    "background": "linear-gradient(50deg, rgba(34, 34, 34, 0) 56%," + area.color +" )"
  });

  // changeForZoom();
}
function removeAreaFromMap(area){
  area.show = false;
  area.marker.remove(map);
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
  150,
  '150m',
  "area-1"
);
var areaSevere = generateArea(
  chemicalWork.latLngArray,
  '#FF9933',
  400,
  '400m',
  "area-2"
);
var areaMinor = generateArea(
  chemicalWork.latLngArray,
  'rgba(11, 46, 235, 0.48)',
  800,
  '800m',
  "area-3"
);
var areaInhalation = generateArea(
  chemicalWork.latLngArray,
  'rgba(3, 251, 18, 0.48)',
  1500,
  '1500m',
  "area-4"
);