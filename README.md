# Sheets2Map
### Turning your Google Sheets to Mapping using Leaflet and Tabletop

sheet2map is a lightweight mapping platform that can give your spredsheet a visual map with minimal amount of steps, and zero coding experience needed. The current version requires some use of great tools, but hopefully will be built into sheet2map in futher iterations.

## Example Map

Vist the template google spreadsheet below
[Template sheet](shorturl.at/cexS3)

At the same time have a look at the map this sheet is powering
[Example map](https://clubkemp.github.io/sheet2map/)

In the spreadsheet, each sheet, or tab, at the bottom will be mapped as a seperate layer on the map. Notice the layer list in the top right corner of the map. Each row of data in each sheet will be a point, line, or polygon that is mapped. Let's dig into the spreadsheet columns to see how things are mapped, unless specified a value in each column is required.

- name: *Your mapped element name, and will be the title in your popup box when the item is clicked*

- popup(optional): *Descriptive text that will appear in the popup box when an item is clicked. If you want your text to appear on different lines you must begin the text with `<span>` and end it with `</span>`.* 

Example: `<span>`Line 1`</span><span>`Line2`</span><span>`Line2`</span>`
renders as:
Line 1

Line 2

Line 3

- address(optional): *If your mapped entity is a discrete location (a point), you can put in the address then geocode it. Select the address, lat, and long cells*
 (./images/geocode.jpg)
*on the spreadsheet nav bar, next to help, you should see an option to Geocode. You can now use these lat/long valuse in the geometry column*

- lat/long(optional): *Latitude and Longitude respectively*

- geoType: *Specify wether your geometry is going to be a point, line, or polygon*

- geometry: *Stores the coordinates for mapping, if using information geocoded above for point the format is `[long, lat]`. More information on getting point, line, polygon geometry below using (geoman.io)*

- color: *A hex color specifying the color you want your feature to be mapped with.* **Make sure to include the #**

- icon:*If you are mapping a point, choose what icon you want to represent your point. You can choose any of [Mapbox's Maki icons](https://labs.mapbox.com/maki-icons/), for a visual list follow the link

## So how do I setup a spreadsheet and a map?

### Step 1: Copy the spreadsheet template
- With the spreadsheet open, go to file -> 'Make a Copy'
- With your Copy open, go to file -> click Publish
- In the upper right corner, click share, get shareable link. This will be the link you will use in step 3 below

### Step 2: Clone the sheet2map repo
- From this repository click 'Clone or download', and choose to download a zip of the repo

- If you have a hosting environment, your ahead of the curve, upload the sheet2map-master you just downloaded to wherever you want to host it.

- If you don't have a hosting environment, no problem just use github pages.
    - Head over to [GitHub](https://github.com/) and [create a new repository](https://github.com/new) named username.github.io, where username is your username (or organization name) on GitHub. You must choose to Initialize your repo with a readme.
    (./images/gitpages.jpg) 
    
    *If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.*

    - Now that you have a pages repo, click create new file, in the name your file field give it a short name of your map with no spaces, example being myMap. Add a / at the end. This is going to create a sub-directory with that specified name. Now name your file init and commit the file.

    -In this new sub-directory choose to upload files, and select the files you just downloaded above.

if you used the myMap example above, Your map should should now be live at yourusername.github.io/myMap

### step 3: Connect your sheet
