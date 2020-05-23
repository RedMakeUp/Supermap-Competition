// --------------------------------------------------------------
// 是否使用默认的服务（当云服务器崩溃的时候，显示默认的中国地图）
var isUseDefaultService = false;
// 主机地址
var host = "https://iserver.supermap.io";
// 地图服务地址
var mapUrl = host + "/iserver/services/map-china400/rest/maps/China";
// 路网服务地址
var roadNetUrl = null;
if(!isUseDefaultService){
  host = "http://60.205.181.110:8090";
  mapUrl = host + "/iserver/services/map-City/rest/maps/City%40EmergDS";
  roadNetUrl = host + "/iserver/services/transportationAnalyst-City/rest/networkanalyst/EmergDS_Network@EmergDS";
}
// --------------------------------------------------------------


// --------------------------------------------------------------
// 创建最近设施分析服务实例
var findClosetFacilitiesService = L.supermap.networkAnalystService(roadNetUrl);
// 创建最近设施分析参数实例
var analystParameter = new SuperMap.TransportationAnalystParameter({
  resultSetting: new SuperMap.TransportationAnalystResultSetting({
    returnEdgeFeatures: true,
    returnEdgeGeometry: true,
    returnEdgeIDs: true,
    returnNodeFeatures: true,
    returnNodeGeometry: true,
    returnNodeIDs: true,
    returnPathGuides: true,
    returnRoutes: true
  }),
  weightFieldName: "SmLength"
});
// 当前显示的路径
var currentRoute = null;
// --------------------------------------------------------------


// --------------------------------------------------------------
// 地图
var map = null;
// 地图中心
var mapOriginCenter = [(3579087.71 + 3585516.41) / 2, (11541226.6 + 11546271.45) / 2];
// --------------------------------------------------------------


// --------------------------------------------------------------
// 工厂坐标
var chemicalWorkPos = L.latLng(3584569.32263774, 11544353.69838877);
// 医院
var hospitals = [
    new Hospital(3585320.698, 11542483.019, "市骨科康复医院", "市骨科康复医院<br><br>平面坐标<br>X:11542483.019<br>Y:3585320.698", "blob-1"),
    new Hospital(3583072.010, 11545579.047, "市中医院", "市中医院<br><br>平面坐标<br>X:11545579.047<br>Y:3583072.010", "blob-2"),
    new Hospital(3580523.653, 11545235.573, "某军区总医院", "某军区总医院<br><br>平面坐标<br>X:11545235.573<br>Y:3580523.653", "blob-3"),
    new Hospital(3582031.027, 11543943.779, "仁爱医院", "仁爱医院<br><br>平面坐标<br>X:11543943.779<br>Y:3582031.027", "blob-4"),
    new Hospital(3582697.889, 11542678.481, "市第一人民医院", "市第一人民医院<br><br>平面坐标<br>X:11542678.481<br>Y:3582697.889", "blob-5"),
    new Hospital(3582627.885, 11541378.165, "城南医院", "城南医院<br><br>平面坐标<br>X:11541378.165<br>Y:3582627.885", "blob-6")
];
// 危险区域
var dangerousAreas = new Map();
dangerousAreas.set("die", new DangerousArea(chemicalWorkPos.lat, chemicalWorkPos.lng, 'die', '150m', 'area-1', 'rgba(255, 0, 0, 0.68)', 150));
dangerousAreas.set("severe", new DangerousArea(chemicalWorkPos.lat, chemicalWorkPos.lng, 'severe', '400m', 'area-2', 'rgba(255, 153, 51, 0.68)', 400));
dangerousAreas.set("minor", new DangerousArea(chemicalWorkPos.lat, chemicalWorkPos.lng, 'minor', '800m', 'area-3', 'rgba(11, 46, 235, 0.68)', 800));
dangerousAreas.set("inhalation", new DangerousArea(chemicalWorkPos.lat, chemicalWorkPos.lng, 'inhalation', '1500m', 'area-4', 'rgba(3, 251, 18, 0.68)', 1500));
// --------------------------------------------------------------


// --------------------------------------------------------------
$('[data-toggle="tooltip"]').tooltip({
    trigger : 'hover'
});
$(".progress-line").hide();
// 初始化“最短救援路线-下拉菜单”
hospitals.forEach((hospital) => {
  $("#list-hospital").append("<li><a style='cursor: pointer;'>" + hospital.name + "</a></li>");
});
$("#list-hospital").append("<li role='separator' class='divider'></li>\n<li><a style='cursor: not-allowed; opacity: 0.8;'>请选择一家医院</a></li>")
// --------------------------------------------------------------
