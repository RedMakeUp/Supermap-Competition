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
  console.log("die");
  resetAllArea();
  addAreaToMap(areaDie);
});
// "毒气扩散区分析-重伤区域"按钮点击
$('#radio-severe').change(() => {
  console.log("severe");
  // resetAllArea();
  // addAreaToMap(areaSevere);
});
// "毒气扩散区分析-轻伤区域"按钮点击
$('#radio-minor').change(() => {
  console.log("minor");
  // resetAllArea();
  // addAreaToMap(areaMinor);
});
// "毒气扩散区分析-吸入反应区域"按钮点击
$('#radio-inhalation').change(() => {
  console.log("inhalation");
  // resetAllArea();
  // addAreaToMap(areaInhalation);
});
// "毒气扩散区分析-取消"按钮点击
$('#radio-cancel').change(() => {
  console.log("cancel");
  resetAllArea();
});
// --------------------------------------------------------------


// 最短救援路线
// --------------------------------------------------------------
// 初始化“最短救援路线-下拉菜单”
let hospitalList = $("#list-hospital");
hospitals.forEach((hospital) => {
  hospitalList.append("<li><a style='cursor: pointer;'>" + hospital.name + "</a></li>");
});
hospitalList.append("<li role='separator' class='divider'></li>\n<li><a style='cursor: not-allowed; opacity: 0.8;'>请选择一家医院</a></li>")

// “最短救援路线-下拉菜单”点击
$(".dropdown-menu").on('click', 'li a', function(){
  $("#hospital-select-control").text($(this).text());
  $("#hospital-select-control").val($(this).text());
});

// “最短救援路线-清除结果”按钮点击
$('#result-clean').click(() => {
  $("#hospital-select-control").text("请选择一家医院");
  $("#hospital-select-control").val("请选择一家医院");
});

// “最短救援路线-获取路线”按钮点击
$('#retrive-route').click(() => {
  // 获得当前所选医院的名字
  let srcHospitalName = $('#hospital-select-control')[0].value;

  // 如果输入值正确，则获取路线
  for(let i = 0; i < hospitals.length; i++){
    let hospital = hospitals[i];
    if(srcHospitalName === hospital.name){
      console.log(hospital.latLngPos);

      return;
    }
  }

  // 否则，添加警告动画
  $("#hospital-select-control").addClass('shadow-pulse');
  $("#hospital-select-control").on('animationend', function(){    
    $("#hospital-select-control").removeClass('shadow-pulse');
  });
});
// --------------------------------------------------------------
