// 医院查询
// --------------------------------------------------------------
// "医院查询-查询"按钮点击
$('#hospital-query').click(() => {
  addHospitals();
});
// "医院查询-清除"按钮点击
$('#hospital-clean').click(() => {
  removeHospitals();
});
// --------------------------------------------------------------


// 毒气扩散区分析
// --------------------------------------------------------------
$('#radio-cancel').prop("checked", true);
// "毒气扩散区分析-致死区域"按钮点击
$('#radio-die').change(() => {
  resetAllArea();
  addAreaToMap("die");
  map.flyTo(chemicalWorkPos, 2);
});
// "毒气扩散区分析-重伤区域"按钮点击
$('#radio-severe').change(() => {
  resetAllArea();
  addAreaToMap("severe");
  map.flyTo(chemicalWorkPos, 2);
});
// "毒气扩散区分析-轻伤区域"按钮点击
$('#radio-minor').change(() => {
  resetAllArea();
  addAreaToMap("minor");
  map.flyTo(chemicalWorkPos, 2);
});
// "毒气扩散区分析-吸入反应区域"按钮点击
$('#radio-inhalation').change(() => {
  resetAllArea();
  addAreaToMap("inhalation");
  map.flyTo(chemicalWorkPos, 2);
});
// "毒气扩散区分析-取消"按钮点击
$('#radio-cancel').change(() => {
  resetAllArea();
});
// --------------------------------------------------------------


// 最短救援路线
// --------------------------------------------------------------
// “最短救援路线-下拉菜单”点击
$(".dropdown-menu").on('click', 'li a', function(){
  $("#hospital-select-control").text($(this).text());
  $("#hospital-select-control").val($(this).text());
});

// “最短救援路线-清除结果”按钮点击
$('#result-clean').click(() => {
  $("#hospital-select-control").text("请选择一家医院");
  $("#hospital-select-control").val("请选择一家医院");
  removeCurrentRoute();
});

// “最短救援路线-获取路线”按钮点击
$('#retrive-route').click(() => {
  // 获得当前所选医院的名字
  let srcHospitalName = $('#hospital-select-control')[0].value;

  // 如果输入值正确，则获取路线
  $(".progress-line").show();
  for(let i = 0; i < hospitals.length; i++){
    let hospital = hospitals[i];
    if(srcHospitalName === hospital.name){
      findCloestRoute(hospital.latLngPos);

      return;
    }
  }

  // 否则，添加警告动画
  $("#hospital-select-control").addClass('shadow-pulse');
  $("#hospital-select-control").on('animationend', function(){    
    $("#hospital-select-control").removeClass('shadow-pulse');
  });
  $(".progress-line").hide();
});
// --------------------------------------------------------------
