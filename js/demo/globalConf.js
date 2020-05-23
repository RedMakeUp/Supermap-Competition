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
    constructor(lat, lng, name, desc, cssId=null){
      this.name = name;
      this.desc = desc;
      this.lat = lat;
      this.lng = lng;
      this.coreSize = 0;
      this.show = false;
      this.marker = null;
      this.cssId = cssId;
    }

    update(map){
      let shadowRadiusByPixel = getPixelDistanceFromCenter(map, this.latLngArray, 400);
      let coreRadiusByPixel = getPixelDistanceFromCenter(map, this.latLngArray, 50);
      let doubleShadowRadiusByPixel = shadowRadiusByPixel * 2;
      let doubleCoreRadiusByPixel = coreRadiusByPixel * 2;

      let circleicon = null;
      if(this.cssId !== null){
        circleicon = L.divIcon({
          className: "css-icon",
          html: "<div class='circle-blob' id=\'" + this.cssId + "\'></div>",
          iconSize: [doubleShadowRadiusByPixel, doubleShadowRadiusByPixel]
        });
      }

      document.documentElement.style.setProperty("--circle-blob-max-length", shadowRadiusByPixel.toString() + "px");

      if(this.show){
        this.removeFromMap(map);

        this.marker = L.marker(this.latLngArray, {icon: circleicon});
        this.marker.bindPopup(this.desc);
        this.coreSize = doubleCoreRadiusByPixel;

        this.addToMap(map);
      }else{
        this.marker = L.marker(this.latLngArray, {icon: circleicon});
        this.marker.bindPopup(this.desc);
        this.coreSize = doubleCoreRadiusByPixel;
      }
    }

    removeFromMap(map){
      if(this.marker !== null) this.marker.remove(map);
      $("#" + this.cssId).remove();
      this.show = false;
    }

    addToMap(map){
      this.show = true;
      this.marker.addTo(map);

      if(this.cssId !== null){
        $("#" + this.cssId).css({
          "width": this.coreSize.toString()+"px",
          "height": this.coreSize.toString()+"px",
        });
      }
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
    new BuildingInfo(3585320.698, 11542483.019, "市骨科康复医院", "市骨科康复医院<br><br>平面坐标<br>X:11542483.019<br>Y:3585320.698", "blob-1"),
    new BuildingInfo(3583072.010, 11545579.047, "市中医院", "市中医院<br><br>平面坐标<br>X:11545579.047<br>Y:3583072.010", "blob-2"),
    new BuildingInfo(3580523.653, 11545235.573, "某军区总医院", "某军区总医院<br><br>平面坐标<br>X:11545235.573<br>Y:3580523.653", "blob-3"),
    new BuildingInfo(3582031.027, 11543943.779, "仁爱医院", "仁爱医院<br><br>平面坐标<br>X:11543943.779<br>Y:3582031.027", "blob-4"),
    new BuildingInfo(3582697.889, 11542678.481, "市第一人民医院", "市第一人民医院<br><br>平面坐标<br>X:11542678.481<br>Y:3582697.889", "blob-5"),
    new BuildingInfo(3582627.885, 11541378.165, "城南医院", "城南医院<br><br>平面坐标<br>X:11541378.165<br>Y:3582627.885", "blob-6")
];
// --------------------------------------------------------------
  

function getPixelDistanceFromCenter(map, center, radiusInMeters){
  let theta = 0 / 180.0 * Math.PI;
  let endX = center[0] + radiusInMeters * Math.cos(theta);
  let endY = center[1] + radiusInMeters * Math.sin(theta);
  let endPos = [endX, endY];

  let centerPoint = map.latLngToContainerPoint(center);
  let endPoint = map.latLngToContainerPoint(endPos);
  
  return centerPoint.distanceTo(endPoint);
}

// --------------------------------------------------------------
class DangerousArea{
  constructor(centerPos, mainColor, radiusInMeters, desc,cssId){
    this.center = centerPos;
    this.mainColor = mainColor;
    this.radiusInMeters = radiusInMeters;
    this.desc = desc;
    this.cssId = cssId;
    this.marker = null;
    this.show = false;
    this.size = 0;
  }

  update(map){
    let radiusByPixel = getPixelDistanceFromCenter(map, this.center, this.radiusInMeters);
    let doubleRadiusByPixel = radiusByPixel * 2;

    let circleIcon = L.divIcon({
      className: "css-icon",
      html: "<div class='area' id=\'" + this.cssId + "\'><div class='sweep'></div></div>",
      iconSize: [doubleRadiusByPixel, doubleRadiusByPixel]
    });

    if(this.show){
      this.removeFromMap(map);

      this.size = doubleRadiusByPixel;
      this.marker = L.marker(this.center, {icon: circleIcon});
      this.marker.bindTooltip(this.desc);

      this.addToMap(map);
    }else{
      this.size = doubleRadiusByPixel;
      this.marker = L.marker(this.center, {icon: circleIcon});
      this.marker.bindTooltip(this.desc);
    }
  }

  removeFromMap(map){
    if(this.marker !== null) this.marker.remove(map);
    $(".area").remove();
    this.show = false;
  }

  addToMap(map){
    this.show = true;
    this.marker.addTo(map);

    $("#" + this.cssId).css({
      "width": this.size.toString()+"px",
      "height": this.size.toString()+"px",
      "background-color": "rgba(255, 255, 255, 0.28)"
    });

    $("#" + this.cssId +" .sweep").css({
      "width": (this.size / 2).toString()+"px",
      "height": (this.size / 2).toString()+"px",
      "background": "linear-gradient(50deg, rgba(34, 34, 34, 0) 56%," + this.mainColor +" )"
    });
  }
}

var dangerousAreas = new Map();
dangerousAreas.set("die", new DangerousArea(chemicalWork.latLngArray, 'rgba(255, 0, 0, 0.68)', 150, "150m", "area-1"));
dangerousAreas.set("severe", new DangerousArea(chemicalWork.latLngArray, 'rgba(255, 153, 51, 0.68)', 400, "400m", "area-2"));
dangerousAreas.set("minor", new DangerousArea(chemicalWork.latLngArray, 'rgba(11, 46, 235, 0.68)', 800, "800m", "area-3"));
dangerousAreas.set("inhalation", new DangerousArea(chemicalWork.latLngArray, 'rgba(3, 251, 18, 0.68)', 1500, "1500m", "area-4"));
// --------------------------------------------------------------


$('[data-toggle="tooltip"]').tooltip({
    trigger : 'hover'
});
$(".progress-line").hide();
