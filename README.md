# Sheets2Map
### Turning your Google Sheets to Maps 

sheet2map is a lightweight mapping platform using [leaflet](https://leafletjs.com/) and [papaparse](https://www.papaparse.com/), that can give your spredsheet a visual map with minimal amount of steps, and zero coding experience needed. The current version requires the use of some additional tools, but hopefully these will be built into sheet2map in futher iterations.

We love non-profits and activists! If you are trying to do some good, and need help getting setup or additional functionality. Reach out to kempj2.jk@gmail.com subject line Sheet2Map Help.

## Example Map - how it works

Vist the template google spreadsheet below
[Template sheet](https://docs.google.com/spreadsheets/d/1k3OMK24UklLxTvYhF-qH2e1IW3BE89DlgyiCJwRvBGY/edit?usp=sharing)

At the same time have a look at the map this sheet is powering
[Example map](https://clubkemp.github.io/sheet2map/)

In the spreadsheet, each sheet, or tab, at the bottom will be mapped as a seperate layer on the map. Notice the layer list in the top right corner of the map. Each row of data in each sheet will be a point, line, or polygon that is mapped in that layer.

Let's dig into the spreadsheet columns to see how things are mapped. **Unless specified a value in each column is required.**

- **name**: *Your mapped element name, this will be the title in your popup box when the item is clicked*

- **popup**(optional): *Descriptive text that will appear in the popup box when an item is clicked. If you want your text to appear on different lines you must begin the text with `<span>` and end it with `</span>`.* 
   
            Example: `<span>`Line 1`<span><span>`Line2`<span><span>`Line2`</span>`

            renders as:

            Line 1

            Line 2

            Line 3

- **address**(optional): *If your mapped entity is a discrete location (a point), you can put in the address then geocode it. Select the address, lat, and long cells. On the spreadsheet nav bar, next to help, you should see an option to Geocode. Once run, you should have lat and Long values in the respective columns. You can now use these lat/long valuse in the geometry column*

 ![alt text](https://raw.githubusercontent.com/clubkemp/sheets2map/master/images/geocode.JPG)

- **lat/long**(optional): *Latitude and Longitude respectively*

- **geoType**: *Specify wether your geometry is going to be a point, line, or polygon*

- **geometry**: *Stores the coordinates for mapping, if using information geocoded from an address the format is `[long, lat]`. More information on getting point, line, polygon geometry in 'Let's Start Mapping' section using [geoman.io](geoman.io)*

- **color**: *A hex color specifying the color you want your feature to be mapped with.* **Make sure to include the #**

- **icon**: *If you are mapping a point, choose what icon you want to represent your point. You can choose any of [Mapbox's Maki icons](https://labs.mapbox.com/maki-icons/), for a visual list follow the link*

#### Additional data
It's tottaly legit to add yoour own columns to the spreadsheet, these can be helpful for organizing data elements that drive styling and pop up generation, or just record keeping. See 'Sheet-Fu' section for tips

## So how do I setup a spreadsheet and a map?

### Step 1: Copy the spreadsheet template
1. With the spreadsheet open, go to file -> 'Make a Copy'
2. With your Copy open, go to file -> click Publish
3. In the upper right corner, click share, get shareable link. This will be the link you will use in step 3 below

### Step 2: Setup your hosting environment
1. From this repository click 'Clone or download', and choose to download a zip of the repo

2. If you have a hosting environment, your ahead of the curve, upload the sheet2map-master you just downloaded to wherever you want to host it.

2. If you don't have a hosting environment, no problem just use github pages.
    1. Head over to [GitHub](https://github.com/), sign up for an account(it's free), and [create a new repository](https://github.com/new) named username.github.io, where username is your username (or organization name) on GitHub. You must choose to Initialize your repo with a readme.
    
    ![alt text](https://raw.githubusercontent.com/clubkemp/sheets2map/master/images/gitPages.JPG) 
    
    *If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.*

    2. Now that you have a pages repo, click create new file, in the name your file field give it a short name of your map with no spaces, example being myMap. Add a / at the end. This is going to create a sub-directory with that specified name. Now name your file init and commit the file.

    3. In this new sub-directory choose to upload files, and select the files you just downloaded above.

if you used the myMap example above, Your map should should now be live at yourusername.github.io/myMap

### step 3: configure your script file
1. Go to [BBoxfinder.com](bboxfinder.com). Center your map on the area you want to map, this will be the dafault extent your map opens to.
    - in the bottomr right toggle to Lat/Lng
    - copy the value in the bottom left for 'Center'
    - copy the value for Zoom

2. In the folder list you have setup on your hosting environment, navigate to lib/script.js. If on github use the pencil in the top right to start editing your document

3. on line line 2, replace `48.753331,-122.476487` with the center value from step 1

4. on line 4, replace `19` with your zoom value from step 1

2. on line 70, replace  `'https://docs.google.com/spreadsheets/d/1k3OMK24UklLxTvYhF-qH2e1IW3BE89DlgyiCJwRvBGY/edit?usp=sharing'` with your spreadsheet url from Section 1

3. At the bottom of the page, click commit changes

*That's it! You now have a live map connected to your live google spreadsheet. So now let's start mapping!*

## Let's start mapping
In your spreadsheet, go ahead and delete the sample data, and get rid of the additional 'Each tab is a layer' sheet. Don't touch Validation, this contains the information used to generate the dropdown lists in your spreadsheet.

To get lat/long data off of addresses you can use the Geocode function built into your sheet and outlined above in the example map, under the address item

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


## Extra Sheet-Fu to power your mapping
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
![alt text](https://github.com/clubkemp/sheets2map/blob/master/images/iconLookup.JPG)

`=VLOOKUP(D16,Validation!I$2:J$7,2, FALSE)`