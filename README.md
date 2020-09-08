# Sheets2Map
* [Example Map](#Example-Map)
* [Installation](#Installation)
* [Mapping data](#Mapping-Data)
* [Extra shee-fu](#Extra-Sheet-Fu)
* [Credits](#credits)
* [License](#license)
### Turning your Google Sheets to Maps 

sheet2map is a lightweight mapping platform using [leaflet](https://leafletjs.com/) and [papaparse](https://www.papaparse.com/), that can give your spredsheet a visual map with minimal amount of steps, and zero coding experience needed. The current version requires the use of some additional tools, but hopefully these will be built into sheet2map in futher iterations.

We love non-profits and activists! If you are trying to do some good, and need help getting setup or additional functionality. Reach out to kempj2.jk@gmail.com subject line Sheet2Map Help.

## Example-Map

Vist the template google spreadsheet below
[Template sheet](https://docs.google.com/spreadsheets/d/1k3OMK24UklLxTvYhF-qH2e1IW3BE89DlgyiCJwRvBGY/edit?usp=sharing)

At the same time have a look at the map this sheet is powering
[Example map](https://clubkemp.github.io/sheets2map/.)

## Installation

### Step 1: Copy the spreadsheet template
1. With the spreadsheet open, go to file -> 'Make a Copy'
2. With your Copy open, go to file -> click Publish
3. in the upper left, choose link
4. select the tab you want, and choose comma-separated values. *Keep this URL handy for step 3*

### Step 2: Setup your hosting environment
1. From this repository click 'Clone or download', and choose to download a zip of the repo

2. If you have a hosting environment, your ahead of the curve, upload the sheet2map-master you just downloaded to wherever you want to host it.

3. If you don't have a hosting environment, no problem just use github pages (the non-coder way).
    1. Head over to [GitHub](https://github.com/), sign up for an account(it's free), and [create a new repository](https://github.com/new) named as you want your url to apper, my-awesome-map for example. Initialize your repo with a readme.

    2. In this new repo choose to upload files, and select the files you just downloaded above.
    
    3. at the top of your page, go into settings, and scroll down to enable your github pages link from your master branch. See [this tutorial](https://docs.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) if you get stuck

if you used the my-awesome-map example above, Your map should should now be live at yourusername.github.io/my-awesome-map

### step 3: configure your script file
1. Go to [BBoxfinder.com](bboxfinder.com). Center your map on the area you want to map, this will be the dafault extent your map opens to.
    - in the bottomr right toggle to Lat/Lng
    - copy the value in the bottom left for 'Center'
    - copy the value for Zoom

2. In the folder list you have setup on your hosting environment, navigate to **src/script.js**. If on github use the pencil in the top right to start editing your document

3. Using the values from step 1 configure your mapInfo settings...
    1. on line 10 replace `48.753331` with your new lat number
    2. on line 11 replace `-122.476487` with your new long number
    3. on line 12 replace `13` with your new zoom value

4. on line 6, replace `Layer 1` with the name you would like to call your layer, say My Awesome Points, for example  `'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIjkijwlK4eW_L9nm6AWjTWstza4BWXLT-tCm3eAZ83ljqk0K-EZccQHLJUotq9WE-_donmArGCjuR/pub?gid=0&single=true&output=csv'` with your spreadsheet url from Section 1

3. At the bottom of the page, click commit changes

*That's it! You now have a live map connected to your live google spreadsheet. So now let's start mapping!*

## Mapping-Data
In your spreadsheet, go ahead and delete the sample data, and get rid of the additional 'Each tab is a layer' sheet. Don't touch Validation, this contains the information used to generate the dropdown lists in your spreadsheet.

To get lat/long data off of addresses you can use the Geocode function built into your sheet and outlined above in the example map, under the address item

In the spreadsheet, each sheet, or tab, at the bottom can be mapped as a seperate layer on the map. Notice the layer list in the top right corner of the map. Each row of data in each sheet will be a point, line, or polygon that is mapped in that layer.

Let's dig into the spreadsheet columns to see how things are mapped. **Unless specified a value in each column is required.**

- **name**: *Your mapped element name, this will be the title in your popup box when the item is clicked*

- **popup**(optional): *Descriptive text that will appear in the popup box when an item is clicked. If you want your text to appear on different lines you must begin the text with `<span>` and end it with `</span>`.* 
   
            Example: `<span>`Line 1`<span><span>`Line2`<span><span>`Line2`</span>`

            renders as:

            Line 1

            Line 2

            Line 3
-**images** *If you would like to include a slideshow in your pop-up have a comma seperated list of image links in this column. You can link to images in your google drive, just make sure the permissions are set to anyone with a link*

- **address**(optional): *If your mapped entity is a discrete location (a point), you can put in the address then geocode it. Select the address, lat, and long cells. On the spreadsheet nav bar, next to help, you should see an option to Geocode. Once run, you should have lat and Long values in the respective columns. You can now use these lat/long valuse in the geometry column. Additionally you might also try using an add on like [awesometable](https://awesome-table.com/)*

 ![alt text](https://raw.githubusercontent.com/clubkemp/sheets2map/master/images/geocode.JPG)

- **lat/long**(optional): *Latitude and Longitude respectively*

- **geoType**: *Specify wether your geometry is going to be a point, line, or polygon*

- **geometry**: *Stores the coordinates for mapping, if using information geocoded from an address the format is `[long, lat]`. More information on getting point, line, polygon geometry in 'Let's Start Mapping' section using [geoman.io](geoman.io)*

- **color**: *A hex color specifying the color you want your feature to be mapped with.* **Make sure to include the #**

- **icon**: *If you are mapping a point, choose what icon you want to represent your point. You can choose any of [Mapbox's Maki icons](https://labs.mapbox.com/maki-icons/), for a visual list follow the link*

#### Additional data
It's totaly legit to add yoour own columns to the spreadsheet, these can be helpful for organizing data elements that drive styling and pop up generation, or just record keeping. See 'Sheet-Fu' section for tips

### Visually map
If you want to visually map points, lines, or polygons head over to [geoman.io's editor](https://geoman.io/geojson-editor). Sheet map supports Points, Lines, and Polygons. 
1. You can draw a marker, line, or polygon using the toggles on the left of the map.
2. once you draw a feature, it's code pops up in the text editor on the right. Don't let this code frightne you, all you need is to see the geometry section, you are going to copy everything inside the outermost brackets `[Geometry you are going to copy!]`

Examples:
Point: `[-73.999683, 40.715062]`

line: `[
                [-74.001187, 40.71324],
                [-73.998222, 40.7108],
                [-73.999855, 40.709597],
                [-74.00471, 40.707905]
            ]`

Polygon: `[
                [
                    [-74.001097, 40.725535],
                    [-73.995598, 40.722022],
                    [-73.985803, 40.724624],
                    [-73.983053, 40.730869],
                    [-73.983912, 40.735421],
                    [-73.990614, 40.733991],
                    [-73.99955, 40.733991],
                    [-74.00419, 40.731259],
                    [-74.001097, 40.725535]
                ]
            ]`

Again, this looks scarier than it is. A point is a pair of lat longs inside of brackets `[x,y]`. A line is a list of these these pairs inside of a set of brackets `[ [x1,y1], [x2,y2] ] `. A polygon is similar to a line, a list of ordered pairs, but it is additionally closed to make a polygon so it gets an extra set of brackets `[ [ [x1,y1],[x2,y2],[x3,y3] ] ]`

3. in all three cases, you are going to copy the coordinates you want to map from your cheet, and paste them into your geometry cell for that row of data. **Don't just paste in the cell, click the cell then paste it into the**

![alt text](https://raw.githubusercontent.com/clubkemp/sheets2map/master/images/Geometry2.png)

### Style your data
*Give your points, lines, and polygons some color*. Enter any Hex color into the color column. What'S a hex color? It's just a code for any color of the rainbow, you can figure out what color you want using a tool like [html color codes](https://htmlcolorcodes.com/color-picker/). Just copy and paste the HEX into the color column (example #DE20C7 is hot pink)

*Add icons to your points*. The icon dropdown let's you select any Maki icon for your points. Check out the visual list of icons [here](https://labs.mapbox.com/maki-icons/)


## Extra-Sheet-Fu
There are a few spreadsheet tricks you can use to extend your mapping capabilities with sheet2map.

### Adding data validation to fields
Data validation can be a powerful thing, it standardizes your data, and keeps our distracted brains from having a spelling error. Nothing is worth than having many categories of the same thing. Example: Camping, camping, capming, Camp, camp, Campin' & CAmping

Do yourself a favor a setup <a href="https://sites.google.com/site/herosheets/validation" target="_blank">Data Validation</a>.If it were me, I would create my validation list in the validation tab (that's why it is there)! You can see there is already a validation list setup for Icons and Geotype. use those as examples if you need!

### data driven pop-ups
Instead of writing out the pop up infor for each feature, you can have columns of data dynamically update your pop-up field in your sheet using [textjoin](https://support.google.com/docs/answer/7013992?hl=en)
In your popup cell you would enter something like:

`=TEXTJOIN("",TRUE,"<span>",J2,"</span>","<span>","Hours:",G2,"</span>","<span>","Amenity:",I2,"</span>","<span>","Website:",K2,"</span>","<span>","Email:",L2,"</span>","<span>","Phone:",M2,"</span>")`

First argument is a delimiter, we leave it empty because we are concatenating text. True

### Data driven styling
Say you have added a status column at column C and you want to drive the styling (either color,icon, or both) based off this field. 

Example: a column for shop status where status = open or status = closed.

Now being the good data munger that you are, you already have setup a validation on your status column so you know for a fact it will always either be 'open' or 'closed'. Rather than having to manually set the color to  blue (#4A80B7) for open and red (#E98C84) for closed, you want the status column to automatically drive that symbology

Get there with[VLOOKUP](https://support.google.com/docs/answer/3093318?hl=en), my favorite spreadsheet function! The Syntax for vlookup is:
`VLOOKUP(search_key, range, index, [is_sorted])`

So first in the validation tab create a lookup table whre one column is the key (status) and the other is value you want (color)
![alt text](https://github.com/clubkemp/sheets2map/blob/master/images/lookup.JPG)

now back in your data tab for feature in row 2, in that color column that chooses which color to map, rather than specifying an explicit color you can use

`=VLOOKUP(C2, Validation!G$2:H$3, 2, False)`

Let's break it down. 
- C2 is the cell that contains the lookup, remember your status column was at position C and we are on row 2 of the data.
- Validation!G$2:H$3 is saying the lookup table is in the Validation tab and contained between cells G2 and H3. The $ in front of the row numbers here keeps these numbers constant so if you drag the formula down to fill other cells these numbers wont change
- 2 specifys this is the inex of the value you want to grab, if you look at the lookup table example the status is at index 1 and the color is at index 2. We want color so 2
- False basically will make sure we get an exact match for our lookup. Since you setup a validation on your status column you know the values will always be 'open' or 'closed'.

That's it! You can do the same for Icons! Say off a service type column at position D in your data for row # 16

`=VLOOKUP(D16,Validation!I$2:J$7,2, FALSE)`

## Credits
This could not be built without:

* [leaflet](https://leafletjs.com/)
* [papaparse](https://www.papaparse.com/)
* [papaparse](https://www.papaparse.com/)
* [geojson](https://www.npmjs.com/package/geojson/)
* [OSM](https://www.openstreetmap.org/#map=4/38.01/-95.84)

## License
MIT License

Copyright (c) [2020] [Jonny Kemp]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




