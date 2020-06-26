//variable that holds the different publish as csv links from google, and the layer name. WIll need to serve these through a proxy currently
const sheetUrls = {
  'layer 1' : 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIjkijwlK4eW_L9nm6AWjTWstza4BWXLT-tCm3eAZ83ljqk0K-EZccQHLJUotq9WE-_donmArGCjuR/pub?gid=0&single=true&output=csv',
  'Each tab is a layer': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIjkijwlK4eW_L9nm6AWjTWstza4BWXLT-tCm3eAZ83ljqk0K-EZccQHLJUotq9WE-_donmArGCjuR/pub?gid=1389646946&single=true&output=csv',
  'Photos': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXIbc51VbzJwWJYN88y_ZWFKGygsbGxyBG93h4oaQ11FYMujbNAjRhXSbgE9YqroT1hNPh2LR9-ruZ/pub?gid=1125356036&single=true&output=csv'
}
const mapInfo = {
  'lat' : 48.753331,
  'long' : -122.476487,
  'zoom' : 13,
}

// O: KEEP
const map = L.map('mapid').setView([mapInfo.lat,mapInfo.long], mapInfo.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
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

//function to get the specified data located in sheetUrls variable
const init = () => {
  const data = {};
  for (const property in sheetUrls ){
    Papa.parse('https://cors-anywhere.herokuapp.com/'+sheetUrls[property], {
      download: true,
      header: true,
      complete: (results) =>{
        data[property] = results
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
        //check to see if there is an image array in the data, if there is we will attach a slideshow optio
        if(e.images){
          let data = Papa.parse(e.images)
          data.data[0].forEach( e =>{
            const index = data.data[0].indexOf(e)
            //this snippit is needed to use url as img src, instead of opening it in a viewer
            const newImg = e.replace(/open/, 'uc')
            data.data[0][index] = newImg
          })
          e.images = data.data[0]
        }
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

//setup a variable that will get the clicked feature loaded into it, being a global variable we can then access that feature via sub functions
let clickedFeature ={}

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
      //load the clicked feature into global variable object
      clickedFeature = layer.feature 
      if(layer.feature.properties.images){
        const images = layer.feature.properties.images
        //setup slideshow image from the dom
        const theImage = document.getElementById("main-image");
        startImg = images[0]
        let index = 0 
        //does work to make sure the arrow buttons scroll through the image array, and displays image location
        const showImage = (direction) =>{
          if (direction == "left")
          {
            index--;
            document.getElementById("imgNumber").innerHTML = `${index+1} of ${images.length}`;
          }
          else
          {
            index++;
            index %= images.length;
            document.getElementById("imgNumber").innerHTML = `${index+1} of ${images.length}`;
          }
          
          if (index < 0)
          {
            index = images.length - 1;
            document.getElementById("imgNumber").innerHTML = `${index+1} of ${images.length}`;
          }
          
          theImage.src = images[index];
        }
        document.getElementById("left").onclick = function(){
          showImage('left');
        }
        document.getElementById("right").onclick = function(){
          showImage('right');
        }  
        return `<div class="popup">
        <h2>${layer.feature.properties.name}</h2>
        <p>${layer.feature.properties.popup}</p>
        <!-- Trigger/Open The Modal -->
        <button id="myBtn">See Slideshow</button>
        </div>`
      }else{
        return `<div class="popup"><h2>${layer.feature.properties.name}</h2><p>${layer.feature.properties.popup}</p></div>`
      }
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

const slideshow = (event) =>{
  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal, set the initial image and location
  btn.onclick = function() {
    modal.style.display = "block";
    const theImage = document.getElementById("main-image");
    const images = clickedFeature.properties.images
    const src = images[0]
    theImage.src = src;
    document.getElementById("imgNumber").innerHTML = `1 of ${images.length}`;
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it. This fires erros that I think are ok but might need to be fixed dow nthe road
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  } 
  const element = event.target;
    if(element.id == 'myBtn'){
      
    }

    
}



// O: KEEP
map.on("overlayadd", changeBackground);
window.addEventListener('DOMContentLoaded', init)
document.addEventListener("click", slideshow);
