Ext.ux.ODataProxy
===================

Ext.ux.ODataProxy is a Sencha Touch user
extension. It provides full CRUD access to SharePoint list data through the 
ListData.svc REST service which is based on [OData](http://www.odata.org). 


Ext.ux.ODataProxy features:

* create, read, update and delete SharePoint items as Sencha Touch models
* fetch multiple SharePoint items from a list in a Sencha Touch store
* support for OData query string options (orderby, filter, select, etc)
* JSON payloads
* partial updates: only changed attributes are sent to the server during an update



Contents
--------
* [Getting started](#installation)
* [Examples](#examples)



Getting started
---------------
Because of the Same Origin Policy, your html file must be served from the same domain as the SharePoint site you want to access. 
You can place your html file containing your app on the server file system or in an asset library. 

Tip: if you are using SharePoint online (Office365), you will notice that .html files are downloaded, not opened in the browser.
As a workaround, just use an .aspx file extension, instead of .html. This way, you can start your single page SharePoint application 
from a file in an asset library. 


example.apsx:
 
```html


<!DOCTYPE html>
<html>
	<head>
	<title>SharePoint OData proxy example</title>

	<!-- Sencha Touch include -->
	<script src="sencha-touch.js"></script> 

	<!-- app includes -->
	<script src="odataproxy.js"></script>
	<script src="example.js"></script>
	</head>
	<body>
	...
	</body>
</html>


```

## <a name="examples"/>Examples

Now let's look at some examples how you can use Backbone.SharePoint. In these examples we will assume you have 
a subsite '/teamsite' in which you have 
created a Contacts list based on the standard contacts list template. 



Hopefully this is sufficient to get you going!




