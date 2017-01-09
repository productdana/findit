var map;
var infowindow;

function initAutocomplete() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7739, lng: -122.4312},  //san francisco
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  //pixelOffset corrects position of infowindow to display above the marker directly
  infowindow = new google.maps.InfoWindow({
    pixelOffset: new google.maps.Size(-20, 0)
  });

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
  
  //since it's an autocomplete search, it requires user to select the appropriate phrase from the dropdown that autocompletes before hitting enter, or hitting enter twice instead
  $('#pac-input').keypress(function(event) {
    if (event.which === 13 && $('#pac-input').val() !== undefined) {
       event.preventDefault();
       newSearch();
    }
  });

  function newSearch() {  
    // map.addListener('bounds_changed', function() {
    //   searchBox.setBounds(map.getBounds());
    // });

    var places = searchBox.getPlaces();
    console.log('places:',places);
    if (places.length === 0) {
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

      var placeNameString = `${place.name}`;
      var placeName = placeNameString.match(/[A-Z,0-9]/gi).join('');

      //mouseover a marker for the marker to bounce & highlight corresponding search result from list
      google.maps.event.addListener(marker,'mouseover', function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });

      google.maps.event.addListener(marker,'mouseout', function() {
        marker.setAnimation(null);
        $(`#${placeName}`).css("color", ""); 
      });
      
      //append the name of the place in the list
      $('#list').append(`<button id=${placeName} class="searchresult btn btn-default btn-info btn-sm list-group-item-info" role="button">${place.name}</a>`);
      
      //event handlers added to markers and corresponding search result

      $(`#${placeName}`).on('click',clickMarker);

      $(`#${placeName}`).on('mouseenter', function(){
        google.maps.event.trigger(marker, 'mouseover')
      });

      $(`#${placeName}`).on('mouseout', function(){
        google.maps.event.trigger(marker, 'mouseout')
      });

      google.maps.event.addListener(marker, 'click', clickMarker);

      //shows info when marker or corresponding search result is clicked
      function clickMarker(e) {
        console.log('place.name:',place.name);
        infowindow.setContent('<p>' + place.name + '<br>' + place.formatted_address + '</p>');
        infowindow.setPosition(e.latLng);
        infowindow.open(map, marker);
        $('#moreinfo').empty();
        $('div.searchresultname').html('<h4>' + place.name + '</h4>');
        $('#moreinfo').append('<img src="' + place.photos[0]['getUrl']({maxWidth: 500, maxHeight: 450}) + '" class="img-responsive">');
      };

      markers.push(marker);

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
