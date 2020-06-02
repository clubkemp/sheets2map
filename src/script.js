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
    //console.log('background style fired')
    
    //now loop through the dom array and find the colorHex keys
    const updateColor = (array) =>{
        array.forEach(e =>{{
          const draw = e.replace('colorHex','#')
          const domArray = document.querySelectorAll('.'+e)
          //console.log(domArray);
            domArray.forEach(e =>{
              e.style.backgroundColor=draw;
            })

          }
       //access the dom and change the background color of the markers to match their colorHex
        })
      }
    
    const allClasses = [];
    //get the dom elements
    const allElements = document.querySelectorAll('img[class*="colorHex"');
    //loop through and populate the array with dom elements
    for (let i = 0; i < allElements.length; i++) {
      cibst classes = allElements[i].className.toString().split(/\s+/);
      for (let j = 0; j < classes.length; j++) {
        let cls = classes[j];
        if (cls.indexOf("colorHex") === 0)
          allClasses.push(cls);
      }
    }
    if(i === allElements.length){
      //console.log(allClasses);
      updateColor(allClasses);
    }    
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
      // console.log('Load data running')
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
          // console.log('load data fired');
          toGeo(layers);
          break;
        }
      }
    };
    window.addEventListener('DOMContentLoaded', init)
    //window.addEventListener('DOMContentLoaded', init)
    
    const geoArray = []
    
    const toGeo = (layers) => {
      // console.log('toGeo running...')
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
        // console.log('toGeo fired');
        addGeoJsonLayers(geoArray);
        return;
      }
    };
    
    const addGeoJsonLayers = (arr) =>{
      let geoIndex = arr.length;
      const geojsonMarkerOptions = {
      radius: 10,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
      };
      
      arr.forEach(e =>{
        geoIndex = geoIndex -1
        //console.log(geoIndex);
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
        if (geoIndex === 0){
          addLayerControl(overlayMaps);
        }
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