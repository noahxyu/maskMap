"use strict";

var map;
var maskData;
var infoWindow;

function pharmacyInfo() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var phone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var add = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var adult = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var child = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var updated = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  return "<div>\n    <p><strong>".concat(name, "</strong></p>\n    <p>\u96FB\u8A71\uFF1A").concat(phone, "<br>\n       \u5730\u5740\uFF1A").concat(add, "<br>\n       \u6210\u4EBA\u53E3\u7F69\u5269\u9918\u6578\u91CF\uFF1A").concat(adult, "<br>\n       \u5152\u7AE5\u53E3\u7F69\u5269\u9918\u6578\u91CF\uFF1A").concat(child, "<br>\n    </p>\n    <p>\u6700\u5F8C\u66F4\u65B0\u6642\u9593\uFF1A").concat(updated, "</p>\n  </div>\n  ");
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 23.58,
      lng: 120.58
    },
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('我所在的位置');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }

  fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json').then(function (res) {
    return res.json();
  }).then(function (res) {
    maskData = res.features;
    var markers = maskData.map(function (location, i) {
      return new google.maps.Marker({
        position: {
          lat: location.geometry.coordinates[1],
          lng: location.geometry.coordinates[0]
        },
        map: map
      });
    });
    var markerCluster = new MarkerClusterer(map, markers);
    markers.forEach(function (marker, i) {
      marker.addListener('click', function () {
        infoWindow.close();
        var maskDataItem = maskData[i].properties;
        infoWindow = new google.maps.InfoWindow({
          content: pharmacyInfo(maskDataItem.name, maskDataItem.phone, maskDataItem.address, maskDataItem.mask_adult, maskDataItem.mask_child, maskDataItem.updated)
        });
        infoWindow.open(map, marker);
      });
    });
  })["catch"](function (err) {});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}