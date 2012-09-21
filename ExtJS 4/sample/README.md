# SharePoint proxy for ExtJS 4.x #
Provides a proxy implementation to access SharePoint lists and libraries from an ExtJS 4.x application using odata protocol.

# Sample #
The sample folder contains the sample.aspx file that contains the ExtJS code to query a list in SharePoint 
using the proxy and display the data in the grid (Ext.grid.Panel).

# Set up instructions #
Upload the following files into the document library:
- sample.aspx
- ext-all-dev.js
- ext-all.css
- odataproxy.js (root of the repo)

The easiest way to make it work in SharePoint is to upload all the files into the same location.
If you upload to different folders or libraries or reference the ExtJS library and stylesheet in your master page, make sure you adjust the paths in sample.aspx appropriately.

The extjs code that renders the grid by querying the list is contained within the AdditionalPageHead place holder on the aspx page.
First we reference the stylesheet and extjs library, then our odata proxy.

<link href="ext-all.css" rel="stylesheet" type="text/css">    

<script type="text/javascript" src="ext-all-dev.js"></script>
<script type="text/javascript" src="odataproxy.js"></script>

It then creates the model, store and the grid. The store points at a sample Clients list under the default site - http://localhost.
Make sure you adjust those settings as needed per your local environment. 
The settings (site and list) are part of the proxy config:

```
proxy: {
    type: 'odata',
    site: 'localhost',
    list: 'Clients'
}
```

More detailed instructions to come...