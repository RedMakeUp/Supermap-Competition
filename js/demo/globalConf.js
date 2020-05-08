// 连接到服务器
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

// 最近设施分析
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


// 地图图层
// --------------------------------------------------------------
var map = null;
var mapOriginCenter = [(3579087.71 + 3585516.41) / 2, (11541226.6 + 11546271.45) / 2];
// --------------------------------------------------------------

// 工厂和医院的坐标
// --------------------------------------------------------------
class BuildingInfo{
    constructor(lat, lng, name, desc){
      this.name = name;
      this.desc = desc;
      this.lat = lat;
      this.lng = lng;
  
      let circleicon = L.divIcon({
        className: "css-icon",
        html: "<div class='circle-blob'></div>",
        iconSize: [10, 10]
      });
      this.marker = L.marker([lat, lng], {icon: circleicon});
      // this.marker = L.marker([lat, lng])
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
// --------------------------------------------------------------
  

$('[data-toggle="tooltip"]').tooltip({
    trigger : 'hover'
});
