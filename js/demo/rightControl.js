$("#button-fullWidth").click(() => {
    resetMap();
    $('#radio-cancel').prop("checked", true);
});

$("#button-zoomIn").click(() => {
    map.setZoom(map.getZoom() + 1);
});

$("#button-zoomOut").click(() => {
    map.setZoom(map.getZoom() - 1);
});

$("#button-pan").click(() => {
    // if(map.dragging.enabled()){
    //     map.dragging.disable();
    // }else{
    //     map.dragging.enable();
    // }
});
