// O: KEEP
const map = L.map('mapid').setView([48.753331,-122.476487], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '<a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    // O: KEEP
    }).addTo(map);
  // show the scale bar on the lower left corner
  // O: KEEP
  L.control.scale().addTo(map);
  
  const overlayMaps = {};
  
  const changeBackground = () =>{
    
    //now loop through the dom array and find the colorHex keys
    const updateColor = (array) =>{
        array.forEach(e =>{{
          const draw = e.replace('colorHex','#')
          const domArray = document.querySelectorAll('.'+e)
            domArray.forEach(e =>{
              e.style.backgroundColor=draw;
            })

          }
       //access the dom and change the background color of the markers to match their colorHex
        })
      }
    
    var allClasses = [];
    //get the dom elements
    var allElements = document.querySelectorAll('img[class*="colorHex"');
    //loop through and populate the array with dom elements
    for (var i = 0; i < allElements.length; i++) {
      var classes = allElements[i].className.toString().split(/\s+/);
      for (var j = 0; j < classes.length; j++) {
        var cls = classes[j];
        if (cls.indexOf("colorHex") === 0)
          allClasses.push(cls);
      }
    }
    if(i === allElements.length){
      updateColor(allClasses);
    }    
  }

  const addWhatcomData = () =>{
    const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1t6poxASwttk19eWoOlzpBMjfLuZlzFfzgI14zxbQT0I/edit?usp=sharing';

    const init = () =>{
      Tabletop.init(
        { key: publicSpreadsheetUrl,
        parseNumber:false,
        callback: loadData,
        simpleSheet: true 
        } 
      )
    }

    const loadData = (spreadsheet, tabletop) =>{
      const layers = {
        'Grocery Stores':[], 
        'Food Services':[],
        'Civic Services':[],
        'Health Services':[],
        'Other Services':[],
        'Department Stores':[]
        }
      
      let i=0

      const pushLayers = (item) =>{
        if (item.type === 'GroceryStores'){
          layers['Grocery Stores'].push(item);
        }else if (item.type === 'FoodServices'){
          layers['Food Services'].push(item);
        }else if (item.type === 'CivicServices'){
          layers['Civic Services'].push(item);
        }else if (item.type === 'HealthServices'){
          layers['Health Services'].push(item);
        }else if (item.type === 'Other'){
          layers['Other Services'].push(item);
        }else if (item.type === 'DepartHardware'){
          layers['Department Stores'].push(item);
        }
      }
      
      spreadsheet.forEach(e =>{
        e.geometry = JSON.parse(e.geometry)
        if (e.geoType === 'Point'){
          e.point = e.geometry;
          i++
        }else if(e.geoType === 'Line'){
          e.line = e.geometry;
          i++
        }else {
          e.polygon = e.geometry;
          i++
        }
        pushLayers(e);
      });
      if (i === spreadsheet.length){
        toGeo(layers);
        return;
      }
    };
    window.addEventListener('DOMContentLoaded', init)
    //window.addEventListener('DOMContentLoaded', init)
    
    const geoArray = []

    const toGeo = (layers) => {
      const layerLength = Object.keys(layers).length
      const keys = (Object.keys(layers));
      keys.forEach(e =>{
        const feature = layers[e];
        const geoJSON = GeoJSON.parse(feature, {'Point': 'point', 'LineString': 'line', 'Polygon': 'polygon'});
        geoJSON.id = e;
        geoArray.push(geoJSON);
      })
      if (layerLength === geoArray.length){
        addGeoJsonLayers(geoArray);
        return;
      }
    };
    
    const addGeoJsonLayers = (arr) =>{
      var geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
      };
      
      arr.forEach(e =>{
        let layerName= e.id
        e.id = new L.geoJSON(e, {
          style: function (feature) {
            return {
              "color":feature.properties.color,
              }
            },
          pointToLayer: function (feature, latlng) {
            const myIcon = L.icon({
              iconUrl: 'restaurant-15.svg',
              iconSize: [20, 20],
            // iconAnchor: [22, 94],
              //popupAnchor: [-3, -76],
              //shadowUrl: 'my-icon-shadow.png',
              //shadowSize: [68, 95],
              //shadowAnchor: [22, 94]
            });
            let color = feature.properties.color;
            let newColor = color.replace('#','colorHex'); 
            myIcon.options.className = newColor;
            myIcon.options.iconUrl = './icons/'+feature.properties.icon+'.svg';
            return L.marker(latlng,{icon:myIcon});
          }
        
        }).bindPopup(function (layer) {
          //let template = {'<>':'div', 'class':'popup','html':'${name} ${year}'};
          //return json2html.transform(layer)
          return `<div class="popup"><h2>${layer.feature.properties.name}</h2><p>${layer.feature.properties.popup}<p></div>`
        // O: KEEP
        }).addTo(map);
        overlayMaps[layerName] = e.id;
      })
      addLayerControl(overlayMaps);
      changeBackground();
    };
  }

  const addUserData = () =>{
    const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1k3OMK24UklLxTvYhF-qH2e1IW3BE89DlgyiCJwRvBGY/edit?usp=sharing';

    const init = () =>{
      Tabletop.init(
        { key: publicSpreadsheetUrl,
        parseNumber:false,
        callback: loadData,
        //simpleSheet: true 
        } 
      )
    }

    const loadData = (spreadsheet, tabletop) =>{
      const spreadsheetLength = Object.keys(spreadsheet).length-1;
      const layers = {};
      let numOfLayers = Object.keys(layers).length;
      for (const sheet in spreadsheet){
        if(sheet !== 'Validation' && numOfLayers < spreadsheetLength){
          const layer = tabletop.sheets(sheet).all();
        // const layer1 =tabletop.sheets("Layer 1").all();
          layer.forEach(e => {
            //This is where the geometery field is parsed into geoJSON format
            e.geometry = JSON.parse(e.geometry);
            if (e.geoType === 'Point'){
              e.point = e.geometry;
            }else if(e.geoType === 'Line'){
              e.line = e.geometry;
            }else {
              e.polygon = e.geometry;
            }
          });
          layers[sheet] = layer;
          numOfLayers ++;
        }
        if (numOfLayers === spreadsheetLength){
          toGeo(layers);
          break;
        }
      }
    };
    window.addEventListener('DOMContentLoaded', init)
    //window.addEventListener('DOMContentLoaded', init)
    
    const geoArray = []
    
    const toGeo = (layers) => {
      const layerLength = Object.keys(layers).length
      const keys = (Object.keys(layers));
      keys.forEach(e =>{
        const feature = layers[e];
        const geoJSON = GeoJSON.parse(feature, {'Point': 'point', 'LineString': 'line', 'Polygon': 'polygon'});
        geoJSON.id = e;
        //addGeoJsonLayers(geoJSON);
        geoArray.push(geoJSON);
      })
      if (layerLength === geoArray.length){
        addGeoJsonLayers(geoArray);
        return;
      }
    };
    
    const addGeoJsonLayers = (arr) =>{
      var geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
      };
      
      arr.forEach(e =>{
        let layerName= e.id
        e.id = new L.geoJSON(e, {
          style: function (feature) {
            return {
              "color":feature.properties.color,
              }
            },
          pointToLayer: function (feature, latlng) {
            const myIcon = L.icon({
              iconUrl: 'restaurant-15.svg',
              iconSize: [20, 20],
            // iconAnchor: [22, 94],
              //popupAnchor: [-3, -76],
              //shadowUrl: 'my-icon-shadow.png',
              //shadowSize: [68, 95],
              //shadowAnchor: [22, 94]
            });
            let color = feature.properties.color;
            let newColor = color.replace('#','colorHex'); 
            myIcon.options.className = newColor;
            myIcon.options.iconUrl = './icons/'+feature.properties.icon+'.svg';
            return L.marker(latlng,{icon:myIcon});
          }
        
        }).bindPopup(function (layer) {
          //let template = {'<>':'div', 'class':'popup','html':'${name} ${year}'};
          //return json2html.transform(layer)
          return `<div class="popup"><h2>${layer.feature.properties.name}</h2><p>${layer.feature.properties.popup}</p></div>`
        // O: KEEP
        }).addTo(map);
        overlayMaps[layerName] = e.id;
        changeBackground();
      })
    };
  }
  const addLayerControl = (overlay) =>{
    // O: KEEP
    L.control.layers(null,overlay).addTo(map);
  }
// O: KEEP
map.on("overlayadd", changeBackground);
addUserData();
addWhatcomData();