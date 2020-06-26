//variable that holds the different publish as csv links from google, and the layer name
const sheetUrls = {
  'Chalk & Music' : 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThOhBFj6ObeXRegw3d-_ZxNk6OI7NDWUVxJVeewr9Mm4eqTkV7LtBlvgO4w27kMKG37nNmR6hDRX3E/pub?gid=1115221644&single=true&output=csv',
  'Little Free Libraries': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThOhBFj6ObeXRegw3d-_ZxNk6OI7NDWUVxJVeewr9Mm4eqTkV7LtBlvgO4w27kMKG37nNmR6hDRX3E/pub?gid=1580666816&single=true&output=csv'
}
const mapInfo = {
  'lat' : 48.763551,
  'long' : -122.494758,
  'zoom' : 15,
}
// O: KEEP
const map = L.map('mapid').setView([mapInfo.lat,mapInfo.long], mapInfo.zoom);
L.tileLayer('https://api.mapbox.com/styles/v1/clubkemp/ckbomm5673hyj1ioeu3ojv3ay/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2x1YmtlbXAiLCJhIjoiY2luNmtvOXg3MDB4OHVjbHl0YjQ1bjc2dyJ9.Bj-bF_xeXkbQmC8Zf87z2A', {
    maxZoom: 19,
    attribution: '<a href="https://www.mapbox.com/about/maps/">Mapbox</a>,<a href="http://www.openstreetmap.org/about/">OpenStreetMap</a>'
  // O: KEEP
}).addTo(map);
// show the scale bar on the lower left corner
// O: KEEP
L.control.scale().addTo(map);

//Setup the objec that will hold the map layers legend data, load data into it via addGeoJsonLayers function
const overlayMaps = {};

//This function fires the styling of the points
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
  let i = 0;
  for (i = 0; i < allElements.length; i++) {
    const classes = allElements[i].className.toString().split(/\s+/);
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
};

//function to get the specified data located in sheetUrls variable. Sending the url through cors-anywhere to get over cors error. This is a temp fix, need to figure out a better solution
const init = () => {
  const data = {};
  for (const property in sheetUrls ){
    Papa.parse('https://cors-anywhere.herokuapp.com/'+sheetUrls[property], {
      download: true,
      header: true,
      complete: (results) =>{
        data[property] = results
        console.log(results);
        if(Object.keys(data).length === Object.keys(sheetUrls).length){
          loadData(data);
        }
      }
    })
  }
};

//taking the data we get from papa parse and doing a bit of munging
const loadData = (data) =>{
  //console.log('Load data running')
  const spreadsheetLength = Object.keys(data).length;
  const layers = {};
  let numOfLayers = Object.keys(layers).length;
  for (const sheet in data){
    //setting up the layers list
    if(numOfLayers < spreadsheetLength){
      const fullLayer = data[sheet].data;
      //but first let's get rid of any features without geo that will break it
      const layer = fullLayer.filter((obj) =>{
        if (obj.geometry.length < 1){
          console.log(`feature "${obj.name}" in "${sheet}" was missing geometry, it can't be added to map`)
        }
        return obj.geometry.length > 0;
      })
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
//setup a blank array that we will load our geoJSON into
const geoArray = []

const toGeo = (layers) => {
  //console.log('toGeo running...')
  const layerLength = Object.keys(layers).length
  const keys = (Object.keys(layers));
  keys.forEach(e =>{
    //but first, let's add only the feature from the sheet that are active
    const unfilteredFeature = layers[e];
    const feature = unfilteredFeature.filter((obj) =>{
      return obj.active === 'yes'
    })
    const geoJSON = GeoJSON.parse(feature, {'Point': 'point', 'LineString': 'line', 'Polygon': 'polygon'});
    geoJSON.id = e;
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
        });
        let color = feature.properties.color;
        let newColor = color.replace('#','colorHex'); 
        myIcon.options.className = newColor;
        myIcon.options.iconUrl = './icons/'+feature.properties.icon+'.svg';
        return L.marker(latlng,{icon:myIcon});
      }
    
    }).bindPopup(function (layer) {
      return `<div class="popup"><h4>${layer.feature.properties.name}</h4><p>${layer.feature.properties.popup}</p></div>`
    // O: KEEP
    }).addTo(map);
    overlayMaps[layerName] = e.id;
    changeBackground();
    if (geoIndex === 0){
      addLayerControl(overlayMaps);
    }
  })
};
const addLayerControl = (overlay) =>{
// O: KEEP
L.control.layers(null,overlay).addTo(map);
}
// O: KEEP
map.on("overlayadd", changeBackground);
window.addEventListener('DOMContentLoaded', init)