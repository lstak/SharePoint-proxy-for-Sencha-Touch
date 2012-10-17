# SharePoint proxy for ExtJS 4.1 #
OData proxy is a specialization of the RestProxy that ships with ExtJS 4.x which constructs the actions and the urls to work against the odata service available in SharePoint 2010.
Once you have referenced the odataproxy.js in your page, you configure it with the site and list you want to work against:

```
proxy: {
    type: 'odata',
    site: 'http://localhost',
    list: 'Plants'
}
```

Everything else is a standard ExtJS code. See the Sample section for more information and code.

This proxy is for ExtJS version 4.1 or newer. For Sencha Touch proxy go to:
https://github.com/lstak/SharePoint-proxy-for-Sencha-Touch.
See the History section for more information.

## Sample ##
The easiest way to see the proxy in action is to upload the content of the Sample folder into a document library and browse to the sample.aspx page.
Assuming you have the list set up properly, you should see the following grid that lets you view, page, sort, add and edit list items. 
You will also notice in the dev tools at the bottom that it executes the correct REST operations as data is being fetched, added or edited.

![SharePoint sample page](https://raw.github.com/tstojecki/SharePoint-proxy-for-Sencha-Touch/master/readme/img/sp-extjs-plants.png "SharePoint" "SharePoint sample page")
 
The folder contains all the dependencies such as the ExtJS 4.1.1 GPL library, css and images.
If you organize the files in a different way, make sure you update the sample.aspx file accordingly.

The sample was modeled after Sencha's Cell Editing Grid example http://dev.sencha.com/deploy/ext-4.0.0/examples/grid/cell-editing.html
that uses a custom SharePoint list as a data store. 

The Plants list contains the following columns:
```
Common Name - Single line of text
Light -	Choice
Price -	Currency
Available -	Date and Time
Indoor - Yes/No
```

### Details ###
The ExtJS application code is contained in js/plants/app.js, which is referenced within the AdditionalPageHead placeholder of the sample.aspx page.
The grid references the store which in turn references the odata proxy.

<link href="js/ext-4.1.1.a-gpl/resources/css/ext-all.css" rel="stylesheet" type="text/css">

<script type="text/javascript" src="js/ext-4.1.1.a-gpl/ext-all.js"></script>

<script type="text/javascript" src="js/plants/odataproxy.js"></script>
<script type="text/javascript" src="js/plants/app.js"></script>

The proxy points to the Plants list under the default site - http://localhost.
Make sure you adjust the settings as needed per your local environment. 
The settings (site and list) are part of the proxy config as shown above.

## History ##
This project was initially forked off of SharePoint proxy for Sencha Touch: 
https://github.com/lstak/SharePoint-proxy-for-Sencha-Touch which provides an odata proxy for Sencha Touch. 
I have initiated a pull request to host the ExtJS 4.1 proxy there, but haven't heard back so far.
I am still mulling it over as to whether it is a good idea to host it there, mainly I wanted to make sure the author of the original library gets the credit he deserves.
If I don't hear back though, I will likely create another repo or rename this one so I doesn't imply Sencha Touch in its name.