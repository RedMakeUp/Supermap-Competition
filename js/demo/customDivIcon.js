class CustomDivIcon{
    constructor(lat, lng, name, desc, cssId){
      this.name = name;
      this.desc = desc;
      this.lat = lat;
      this.lng = lng;
      this.show = false;
      this.marker = null;
      this.cssId = cssId;
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

    update(map){

    }

    removeFromMap(map){
        if(this.marker !== null) this.marker.remove(map);
        $("#" + this.cssId).remove();
        this.show = false;
    }

    addToMap(map){
        this.show = true;
        this.marker.addTo(map);

        // Extens this function to implement specified style
    }

    getPixelDistanceFromCenter(map, center, radiusInMeters){
        let theta = 0 / 180.0 * Math.PI;
        let endX = center[0] + radiusInMeters * Math.cos(theta);
        let endY = center[1] + radiusInMeters * Math.sin(theta);
        let endPos = [endX, endY];
      
        let centerPoint = map.latLngToContainerPoint(center);
        let endPoint = map.latLngToContainerPoint(endPos);
        
        return centerPoint.distanceTo(endPoint);
    }
}

class Hospital extends CustomDivIcon{
    constructor(lat, lng, name, desc, cssId){
        super(lat, lng, name, desc, cssId);

        this.coreSize = 0;
        this.coreRadiusInMeter = 50;
        this.shadowRadiusInMeter = 400;
    }

    update(map){
        let shadowRadiusByPixel = this.getPixelDistanceFromCenter(map, this.latLngArray, this.shadowRadiusInMeter);
        let coreRadiusByPixel = this.getPixelDistanceFromCenter(map, this.latLngArray, this.coreRadiusInMeter);
        let doubleShadowRadiusByPixel = shadowRadiusByPixel * 2;
        let doubleCoreRadiusByPixel = coreRadiusByPixel * 2;

        let circleicon = L.divIcon({
            className: "css-icon",
            html: "<div class='circle-blob' id=\'" + this.cssId + "\'></div>",
            iconSize: [doubleShadowRadiusByPixel, doubleShadowRadiusByPixel]
        });

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

    addToMap(map){
        this.show = true;
        this.marker.addTo(map);
  
        $("#" + this.cssId).css({
            "width": this.coreSize.toString()+"px",
            "height": this.coreSize.toString()+"px",
        });
    }
}

class DangerousArea extends CustomDivIcon{
    constructor(lat, lng, name, desc, cssId, mainColor, radiusInMeters){
        super(lat, lng, name, desc, cssId);

        this.size = 0;
        this.mainColor = mainColor;
        this.radiusInMeters = radiusInMeters;
    }

    update(map){
        let radiusByPixel = this.getPixelDistanceFromCenter(map, this.latLngArray, this.radiusInMeters);
        let doubleRadiusByPixel = radiusByPixel * 2;
    
        let circleIcon = L.divIcon({
          className: "css-icon",
          html: "<div class='area' id=\'" + this.cssId + "\'><div class='sweep'></div></div>",
          iconSize: [doubleRadiusByPixel, doubleRadiusByPixel]
        });
    
        if(this.show){
          this.removeFromMap(map);
    
          this.size = doubleRadiusByPixel;
          this.marker = L.marker(this.latLngArray, {icon: circleIcon});
          this.marker.bindTooltip(this.desc);
    
          this.addToMap(map);
        }else{
          this.size = doubleRadiusByPixel;
          this.marker = L.marker(this.latLngArray, {icon: circleIcon});
          this.marker.bindTooltip(this.desc);
        }
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