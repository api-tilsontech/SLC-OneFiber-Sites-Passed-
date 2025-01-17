// STREET MAP LAYER

var mapboxOSM = L.tileLayer('http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWNvdHJ1c3QiLCJhIjoibGo4TG5nOCJ9.QJnT2dgjL4_4EA7WlK8Zkw', {
    maxZoom: 22,
    opacity: 0.7
});


// SATELLITE MAP LAYER

var mapboxSat = L.tileLayer('https://api.mapbox.com/v4/cfritz1387.573ca1ee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2ZyaXR6MTM4NyIsImEiOiJjaWphZTZ0eHkwMDVwdWlseGx5aWhhbXlwIn0._lgb3vbGMSx1-jdZCufdgg', {
    maxZoom: 22,
    opacity: 0.7
});


// HIGHLIGHT LAYERS

var highlightLayer = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#00d0ff",
      weight: 6,
      opacity: 1,
      fillColor: "#00d0ff",
      fillOpacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.sitetracker_id) {
      if (feature.properties.sitetracker_id.toLowerCase().indexOf("slc_seg") === 0) {
        if (feature.properties.fqn_id.toLowerCase().indexOf("fib:bur") === 0) {
          layer.bindTooltip(feature.properties.fqn_id + " -- Underground", {sticky: 'false', direction: 'top'});
        } else if (feature.properties.fqn_id.toLowerCase().indexOf("fib:aer") === 0) {
          layer.bindTooltip(feature.properties.fqn_id + " -- Aerial", {sticky: 'false', direction: 'top'});
        }
      } else if (feature.properties.sitetracker_id.toLowerCase().indexOf("slc_sit") === 0) {
        layer.bindTooltip(feature.properties.nfid + " -- " + feature.properties.site_name, {sticky: 'false', direction: 'top'});
      }
    } else if (feature.properties.WO_ID) {
      layer.bindTooltip(feature.properties.workordername, {sticky: 'false', direction: 'top'});
    }
    layer.on({
      click: function (e) {
        if (feature.properties.sitetracker_id.toLowerCase().indexOf("slc_seg") === 0) {
          $("#gisSegmentsInfo_Title").html(feature.properties.fqn_id);
          gisSegmentsHighlightInfo(L.stamp(layer));
          gisSitesSidebar.hide();
          gisSegmentsSidebar.show();
        } else if (feature.properties.sitetracker_id.toLowerCase().indexOf("slc_sit") === 0) {
          gisSitesHighlightInfo(L.stamp(layer));
          gisSitesSidebar.show();
          gisSegmentsSidebar.hide();
        }
      }
    });
  }
});



// BASE LAYERS

var baseLayers = {
  "Street Map": mapboxOSM,
  "Satellite Map": mapboxSat
};


// OVERLAY LAYERS

var overlayLayers = {
  "<span id='layer-name'>Sites</span>": gisSitesLayer,
  "<span id='layer-name'>Segments</span>": gisSegmentsLayer
};


// ADD LAYERS TO MAP

var map = L.map("map", {
  layers: [mapboxOSM, gisSitesLayer, gisSegmentsLayer, highlightLayer],
  minZoom: 5,
  zoomControl: false
});


// SET VIEW TO SALT LAKE CITY, UT

map.setView([40.758, -111.876], 5)


// MAP CLICKING

map.clicked = 0;

map.on('click', function(event){
    map.clicked = map.clicked + 1;
    setTimeout(function(){
        if(map.clicked == 1){             
            map.clicked = 0;
        }
     }, 300);
});
map.on('dblclick', function(event){
    map.clicked = 0;
    highlightLayer.clearLayers();
    gisSitesSidebar.hide();
    gisSitesSearch.hide();
    gisSegmentsSidebar.hide();
    gisSegmentsSearch.hide();
});


map.doubleClickZoom.disable();


// LARGER SCREENS

if (document.body.clientWidth <= 767) {
  isCollapsed = true;
} else {
  isCollapsed = false;
}


// CREATED BY

L.control.attribution({
  prefix: "Created By: Tanner Anz",
  position: "bottomright"
}).addTo(map);


// EXPAND LAYERS

if (L.Browser.mobile) {
  isCollapsed = true;
} else {
  isCollapsed = false;
}


// LAYERS

var layerControl = L.control.layers(baseLayers, overlayLayers, {
  collapsed: isCollapsed
}).addTo(map);


// MAP SCALE

L.control.scale().addTo(map);


// MAP VIEW

$("#map-only").click(function(){
  $("#map-container").show();
  $(window).resize();
});


// SITES SIDEBAR MAP

sidebarMap = new L.map(document.getElementById("gisSites-map"), {
    zoomControl: false
});
sidebarMap.addLayer(mapboxSat);