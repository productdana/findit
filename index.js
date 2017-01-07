var map;
var infowindow;

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  infowindow = new google.maps.InfoWindow();

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  // searchBox.addListener('places_changed', function() {
  $('#searchbutton').click(newSearch);
  function newSearch() {  
    // map.addListener('bounds_changed', function() {
    //   searchBox.setBounds(map.getBounds());
    // });

    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    
    // Clear out the old list.
    $('#list').empty();
    
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      });

      //change marker upon mouseover of search result
      // function changeMarker(marker) {
      //   var icon = new Google.maps.MarkerImage({ url:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|ffffff|c41200"});
      //   marker.setIcon(icon);
      // }


      //mouseover a marker for the marker to bounce
      google.maps.event.addListener(marker,'mouseover', function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });

      google.maps.event.addListener(marker,'mouseout', function() {
        marker.setAnimation(null);
      });

      //write the name of the place in the list
      $('#list').append(`<li ><a class="searchresult" href="#" onmouseover="">${place.name}</a></li>`);
      
      // Create a marker for each place.
      // markers.push(new google.maps.Marker({
      //   map: map,
      //   icon: icon,
      //   title: place.name,
      //   position: place.geometry.location
      // }));

      markers.push(marker);

      // markers.forEach(function(marker){
        google.maps.event.addListener(marker, 'click', function(e) {
          infowindow.setContent('<p>' + place.name + '<br>' + place.formatted_address + '</p>');
          infowindow.setPosition(e.latLng);
          infowindow.open(map);
          
          $('#moreinfo').empty();
          $('#moreinfo').append(place.name + '<p>Price Level: ' + place.price_level + '</p><p>URL: ' + place.website + '</p><p>more info: ' + place.reviews + '</p>');
          // infowindow.open(map, marker);
        });
      // });
        
      

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  };

}
