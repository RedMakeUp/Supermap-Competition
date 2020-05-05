var quanjuobj;
var quanjulist = [];
var e = 0;
var oo = L.geoJSON();
var YYY, XXX;
var startx, starty;
var endx, endy;
var myIconstart;
var route = L.geoJSON();
var arr;
var listt = [];
var routepng;
var layertest = [];
var myGrouptest = L.layerGroup();
var myGroupstart = L.layerGroup();
var myGroupend = L.layerGroup();
var kk, kkk;
var carName = [];
var bn = 0;
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});

// 控制左边菜单栏滑入滑出
$('.button-left-control').click(function() {
    if (n == 1) {
        $('#test').animate({
            'margin-left': '0px'
        },
        250);
        $('#map').animate({},
        2500);
        n = n - 1;

    } else {
        $('#test').animate({
            'margin-left': '-300px'
        },
        250);
        $('#map').animate({
            // 'margin-left': '50px'
        },
        350);
        n = n + 1;
    }
});



var n=0;
var w1,w2,w3,w4,c1,c2,c3,c4;
var handler1='null';
var handler2='null';
var handler3='null';
var objid=[];
var ally;
var newresultLayer='null';
var allresultLayer='null';
var editableLayerss;
