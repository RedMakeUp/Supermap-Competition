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
map.on('zoom', () => {
  updateAreas();
  updateHospitals();
});
updateAreas();
updateHospitals();

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
  $("#hospital-select-control").text("请选择一家医院");
  $("#hospital-select-control").val("请选择一家医院");
  map.setView(mapOriginCenter, 1);
}
// --------------------------------------------------------------


// 添加,移除或更新医院标记
// --------------------------------------------------------------
function removeHospitals(){
  hospitals.forEach((hospital) => {
    hospital.removeFromMap(map);
  });
}

function addHospitals(){
  hospitals.forEach((hospital) => {
    hospital.addToMap(map);
  });
}

function updateHospitals(){
  hospitals.forEach((hospital) => {
    hospital.update(map);
  });
}
// --------------------------------------------------------------


// 添加,移除或更新扩散区域
// --------------------------------------------------------------
function addAreaToMap(areaName){
  if(dangerousAreas.has(areaName)){
    dangerousAreas.get(areaName).addToMap(map);
  }
}

function resetAllArea(){
  dangerousAreas.forEach((area, name) => {
    area.removeFromMap(map);
  });
}

function updateAreas(){
  dangerousAreas.forEach((area, name) => {
    area.update(map);
  });
}
// --------------------------------------------------------------


// 最近设施分析
// --------------------------------------------------------------
// 给定一家医院的位置，动态显示其到工厂的最短路径
function findCloestRoute(hospitalPos){
  let findClosetFacilitiesParameter = new SuperMap.FindClosestFacilitiesParameters({
    event: chemicalWorkPos,
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

    $(".progress-line").hide();
    
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
