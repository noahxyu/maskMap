let map;
let maskData;
let infoWindow;

function pharmacyInfo(name='', phone='', add='', adult='', child='', updated=''){
  return `<div>
    <p><strong>${ name }</strong></p>
    <p>電話：${ phone }<br>
       地址：${ add }<br>
       成人口罩剩餘數量：${ adult }<br>
       兒童口罩剩餘數量：${ child }<br>
    </p>
    <p>最後更新時間：${ updated }</p>
  </div>
  `
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.58, lng: 120.58},
    zoom: 13
  });

  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('我所在的位置');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } 


  fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
    .then(res => {
      return res.json();
    })
    .then(res => {
      maskData = res.features;

      var markers = maskData.map(function(location, i) {
        return new google.maps.Marker({
          position: {
            lat: location.geometry.coordinates[1],
            lng: location.geometry.coordinates[0]
          },
          map: map,
        });
      });

      var markerCluster = new MarkerClusterer(map, markers, {
        imagePath: '/dist/images/m'
      });

      markers.forEach((marker, i) => {
        marker.addListener('click', function(){
          infoWindow.close();
          let maskDataItem = maskData[i].properties
          infoWindow = new google.maps.InfoWindow({
            content: pharmacyInfo(maskDataItem.name,
                                  maskDataItem.phone,
                                  maskDataItem.address,
                                  maskDataItem.mask_adult,
                                  maskDataItem.mask_child,
                                  maskDataItem.updated)
          })
          infoWindow.open(map, marker);
        })
      })
    })
    .catch( err => {})
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

