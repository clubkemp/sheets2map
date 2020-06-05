"use strict";

//variable that holds the different publish as csv links from google, and the layer name
var sheetUrls = {
  'layer 1': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIjkijwlK4eW_L9nm6AWjTWstza4BWXLT-tCm3eAZ83ljqk0K-EZccQHLJUotq9WE-_donmArGCjuR/pub?gid=0&single=true&output=csv',
  'Each tab is a layer': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIjkijwlK4eW_L9nm6AWjTWstza4BWXLT-tCm3eAZ83ljqk0K-EZccQHLJUotq9WE-_donmArGCjuR/pub?gid=1389646946&single=true&output=csv'
};
var mapInfo = {
  'lat': 48.753331,
  'long': -122.476487,
  'zoom': 13
}; // O: KEEP

var map = L.map('mapid').setView([mapInfo.lat, mapInfo.long], mapInfo.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '<a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' // O: KEEP

}).addTo(map); // show the scale bar on the lower left corner
// O: KEEP

L.control.scale().addTo(map);
var overlayMaps = {};

var changeBackground = function changeBackground() {
  //console.log('background style fired')
  //now loop through the dom array and find the colorHex keys
  var updateColor = function updateColor(array) {
    var _a = array;

    var _f = function _f(e) {
      {
        var draw = e.replace('colorHex', '#');
        var domArray = document.querySelectorAll('.' + e); //console.log(domArray);

        var _a2 = domArray;

        var _f2 = function _f2(e) {
          e.style.backgroundColor = draw;
        };

        for (var _i2 = 0; _i2 < _a2.length; _i2++) {
          _f2(_a2[_i2], _i2, _a2);
        }

        undefined;
      } //access the dom and change the background color of the markers to match their colorHex
    };

    for (var _i = 0; _i < _a.length; _i++) {
      _f(_a[_i], _i, _a);
    }

    undefined;
  };

  var allClasses = []; //get the dom elements

  var allElements = document.querySelectorAll('img[class*="colorHex"'); //loop through and populate the array with dom elements

  var i = 0;

  for (i = 0; i < allElements.length; i++) {
    var classes = allElements[i].className.toString().split(/\s+/);

    for (var j = 0; j < classes.length; j++) {
      var cls = classes[j];

      if (cls.indexOf("colorHex") === 0) {
        allClasses.push(cls);
      }
    }
  }

  if (i === allElements.length) {
    //console.log(allClasses);
    updateColor(allClasses);
  }
}; //function to get the specified data located in sheetUrls variable


var init = function init() {
  var data = {};

  var _loop = function _loop(property) {
    Papa.parse(
    /*'https://cors-anywhere.herokuapp.com/'+*/
    sheetUrls[property], {
      download: true,
      header: true,
      complete: function complete(results) {
        data[property] = results;

        if (Object.keys(data).length === Object.keys(sheetUrls).length) {
          loadData(data);
        }
      }
    });
  };

  for (var property in sheetUrls) {
    _loop(property);
  }
}; //taking the data we get from papa parse and doing a bit of munging


var loadData = function loadData(data) {
  //console.log('Load data running')
  var spreadsheetLength = Object.keys(data).length;
  var layers = {};
  var numOfLayers = Object.keys(layers).length;

  var _loop2 = function _loop2(sheet) {
    //setting up the layers list
    if (numOfLayers < spreadsheetLength) {
      var fullLayer = data[sheet].data; //but first let's get rid of any features without geo that will break it

      var layer = fullLayer.filter(function (obj) {
        if (obj.geometry.length < 1) {
          console.log("feature \"".concat(obj.name, "\" in \"").concat(sheet, "\" was missing geometry, it can't be added to map"));
        }

        return obj.geometry.length > 0;
      });
      var _a3 = layer;

      var _f3 = function _f3(e) {
        //This is where the geometery field is parsed into geoJSON format
        e.geometry = JSON.parse(e.geometry);

        if (e.geoType === 'Point') {
          e.point = e.geometry;
        } else if (e.geoType === 'Line') {
          e.line = e.geometry;
        } else {
          e.polygon = e.geometry;
        }
      };

      for (var _i3 = 0; _i3 < _a3.length; _i3++) {
        _f3(_a3[_i3], _i3, _a3);
      }

      undefined;
      layers[sheet] = layer;
      numOfLayers++;
    }

    if (numOfLayers === spreadsheetLength) {
      // console.log('load data fired');
      toGeo(layers);
      return "break";
    }
  };

  for (var sheet in data) {
    var _ret = _loop2(sheet);

    if (_ret === "break") {
      break;
    }
  }
}; //setup a blank array that we will load our geoJSON into


var geoArray = [];

var toGeo = function toGeo(layers) {
  //console.log('toGeo running...')
  var layerLength = Object.keys(layers).length;
  var keys = Object.keys(layers);
  var _a4 = keys;

  var _f4 = function _f4(e) {
    //but first, let's add only the feature from the sheet that are active
    var unfilteredFeature = layers[e];
    var feature = unfilteredFeature.filter(function (obj) {
      return obj.active === 'yes';
    });
    var geoJSON = GeoJSON.parse(feature, {
      'Point': 'point',
      'LineString': 'line',
      'Polygon': 'polygon'
    });
    geoJSON.id = e;
    geoArray.push(geoJSON);
  };

  for (var _i4 = 0; _i4 < _a4.length; _i4++) {
    _f4(_a4[_i4], _i4, _a4);
  }

  undefined;

  if (layerLength === geoArray.length) {
    // console.log('toGeo fired');
    addGeoJsonLayers(geoArray);
    return;
  }
};

var addGeoJsonLayers = function addGeoJsonLayers(arr) {
  var geoIndex = arr.length;
  var geojsonMarkerOptions = {
    radius: 10,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var _a5 = arr;

  var _f5 = function _f5(e) {
    geoIndex = geoIndex - 1; //console.log(geoIndex);

    var layerName = e.id;
    e.id = new L.geoJSON(e, {
      style: function style(feature) {
        return {
          "color": feature.properties.color
        };
      },
      pointToLayer: function pointToLayer(feature, latlng) {
        var myIcon = L.icon({
          iconUrl: 'restaurant-15.svg',
          iconSize: [20, 20]
        });
        var color = feature.properties.color;
        var newColor = color.replace('#', 'colorHex');
        myIcon.options.className = newColor;
        myIcon.options.iconUrl = './icons/' + feature.properties.icon + '.svg';
        return L.marker(latlng, {
          icon: myIcon
        });
      }
    }).bindPopup(function (layer) {
      return "<div class=\"popup\"><h2>".concat(layer.feature.properties.name, "</h2><p>").concat(layer.feature.properties.popup, "</p></div>"); // O: KEEP
    }).addTo(map);
    overlayMaps[layerName] = e.id;
    changeBackground();

    if (geoIndex === 0) {
      addLayerControl(overlayMaps);
    }
  };

  for (var _i5 = 0; _i5 < _a5.length; _i5++) {
    _f5(_a5[_i5], _i5, _a5);
  }

  undefined;
};

var addLayerControl = function addLayerControl(overlay) {
  // O: KEEP
  L.control.layers(null, overlay).addTo(map);
}; // O: KEEP


map.on("overlayadd", changeBackground);
window.addEventListener('DOMContentLoaded', init);