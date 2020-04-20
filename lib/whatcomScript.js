"use strict";

// O: KEEP
var map = L.map('mapid').setView([48.753331, -122.476487], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '<a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' // O: KEEP

}).addTo(map); // show the scale bar on the lower left corner
// O: KEEP

L.control.scale().addTo(map);
var overlayMaps = {};

var changeBackground = function changeBackground() {
  //now loop through the dom array and find the colorHex keys
  var updateColor = function updateColor(array) {
    var _a = array;

    var _f = function _f(e) {
      {
        var draw = e.replace('colorHex', '#');
        var domArray = document.querySelectorAll('.' + e);
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

  for (var i = 0; i < allElements.length; i++) {
    var classes = allElements[i].className.toString().split(/\s+/);

    for (var j = 0; j < classes.length; j++) {
      var cls = classes[j];

      if (cls.indexOf("colorHex") === 0) {
        allClasses.push(cls);
      }
    }
  }

  if (i === allElements.length) {
    updateColor(allClasses);
  }
};

var addWhatcomData = function addWhatcomData() {
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1t6poxASwttk19eWoOlzpBMjfLuZlzFfzgI14zxbQT0I/edit?usp=sharing';

  var init = function init() {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      parseNumber: false,
      callback: loadData,
      simpleSheet: true
    });
  };

  var loadData = function loadData(spreadsheet, tabletop) {
    var layers = {
      'Grocery Stores': [],
      'Food Services': [],
      'Civic Services': [],
      'Health Services': [],
      'Other Services': [],
      'Department Stores': []
    };
    var i = 0;

    var pushLayers = function pushLayers(item) {
      if (item.type === 'GroceryStores') {
        layers['Grocery Stores'].push(item);
      } else if (item.type === 'FoodServices') {
        layers['Food Services'].push(item);
      } else if (item.type === 'CivicServices') {
        layers['Civic Services'].push(item);
      } else if (item.type === 'HealthServices') {
        layers['Health Services'].push(item);
      } else if (item.type === 'Other') {
        layers['Other Services'].push(item);
      } else if (item.type === 'DepartHardware') {
        layers['Department Stores'].push(item);
      }
    };

    var _a3 = spreadsheet;

    var _f3 = function _f3(e) {
      e.geometry = JSON.parse(e.geometry);

      if (e.geoType === 'Point') {
        e.point = e.geometry;
        i++;
      } else if (e.geoType === 'Line') {
        e.line = e.geometry;
        i++;
      } else {
        e.polygon = e.geometry;
        i++;
      }

      pushLayers(e);
    };

    for (var _i3 = 0; _i3 < _a3.length; _i3++) {
      _f3(_a3[_i3], _i3, _a3);
    }

    undefined;

    if (i === spreadsheet.length) {
      toGeo(layers);
      return;
    }
  };

  window.addEventListener('DOMContentLoaded', init); //window.addEventListener('DOMContentLoaded', init)

  var geoArray = [];

  var toGeo = function toGeo(layers) {
    var layerLength = Object.keys(layers).length;
    var keys = Object.keys(layers);
    var _a4 = keys;

    var _f4 = function _f4(e) {
      var feature = layers[e];
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
      addGeoJsonLayers(geoArray);
      return;
    }
  };

  var addGeoJsonLayers = function addGeoJsonLayers(arr) {
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
            iconSize: [20, 20] // iconAnchor: [22, 94],
            //popupAnchor: [-3, -76],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 95],
            //shadowAnchor: [22, 94]

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
        //let template = {'<>':'div', 'class':'popup','html':'${name} ${year}'};
        //return json2html.transform(layer)
        return "<div class=\"popup\"><h2>".concat(layer.feature.properties.name, "</h2><p>").concat(layer.feature.properties.popup, "<p></div>"); // O: KEEP
      }).addTo(map);
      overlayMaps[layerName] = e.id;
    };

    for (var _i5 = 0; _i5 < _a5.length; _i5++) {
      _f5(_a5[_i5], _i5, _a5);
    }

    undefined;
    addLayerControl(overlayMaps);
    changeBackground();
  };
};

var addUserData = function addUserData() {
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1k3OMK24UklLxTvYhF-qH2e1IW3BE89DlgyiCJwRvBGY/edit?usp=sharing';

  var init = function init() {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      parseNumber: false,
      callback: loadData //simpleSheet: true 

    });
  };

  var loadData = function loadData(spreadsheet, tabletop) {
    var spreadsheetLength = Object.keys(spreadsheet).length - 1;
    var layers = {};
    var numOfLayers = Object.keys(layers).length;

    for (var sheet in spreadsheet) {
      if (sheet !== 'Validation' && numOfLayers < spreadsheetLength) {
        var layer = tabletop.sheets(sheet).all(); // const layer1 =tabletop.sheets("Layer 1").all();

        var _a6 = layer;

        var _f6 = function _f6(e) {
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

        for (var _i6 = 0; _i6 < _a6.length; _i6++) {
          _f6(_a6[_i6], _i6, _a6);
        }

        undefined;
        layers[sheet] = layer;
        numOfLayers++;
      }

      if (numOfLayers === spreadsheetLength) {
        toGeo(layers);
        break;
      }
    }
  };

  window.addEventListener('DOMContentLoaded', init); //window.addEventListener('DOMContentLoaded', init)

  var geoArray = [];

  var toGeo = function toGeo(layers) {
    var layerLength = Object.keys(layers).length;
    var keys = Object.keys(layers);
    var _a7 = keys;

    var _f7 = function _f7(e) {
      var feature = layers[e];
      var geoJSON = GeoJSON.parse(feature, {
        'Point': 'point',
        'LineString': 'line',
        'Polygon': 'polygon'
      });
      geoJSON.id = e; //addGeoJsonLayers(geoJSON);

      geoArray.push(geoJSON);
    };

    for (var _i7 = 0; _i7 < _a7.length; _i7++) {
      _f7(_a7[_i7], _i7, _a7);
    }

    undefined;

    if (layerLength === geoArray.length) {
      addGeoJsonLayers(geoArray);
      return;
    }
  };

  var addGeoJsonLayers = function addGeoJsonLayers(arr) {
    var geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var _a8 = arr;

    var _f8 = function _f8(e) {
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
            iconSize: [20, 20] // iconAnchor: [22, 94],
            //popupAnchor: [-3, -76],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 95],
            //shadowAnchor: [22, 94]

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
        //let template = {'<>':'div', 'class':'popup','html':'${name} ${year}'};
        //return json2html.transform(layer)
        return "<div class=\"popup\"><h2>".concat(layer.feature.properties.name, "</h2><p>").concat(layer.feature.properties.popup, "</p></div>"); // O: KEEP
      }).addTo(map);
      overlayMaps[layerName] = e.id;
      changeBackground();
    };

    for (var _i8 = 0; _i8 < _a8.length; _i8++) {
      _f8(_a8[_i8], _i8, _a8);
    }

    undefined;
  };
};

var addLayerControl = function addLayerControl(overlay) {
  // O: KEEP
  L.control.layers(null, overlay).addTo(map);
}; // O: KEEP


map.on("overlayadd", changeBackground);
addUserData();
addWhatcomData();