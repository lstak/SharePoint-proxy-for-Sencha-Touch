Ext.ux.ODataProxy
===================

Backbone.SharePoint extends Backbone Models and Collections so you can easily work with SharePoint Items and Lists.
Its custom sync() method is a wrapper around the SharePoint ListData.svc REST service which is based on [OData](http://www.odata.org). 


Backbone.SharePoint features:

* create, read, update and delete SharePoint items as Backbone models
* fetch multiple SharePoint items from a list as a Backbone collection
* support for OData query string options (orderby, filter, select, etc)
* JSON payloads
* custom sync() to communicate with the ListData service
* partial updates: only changed attributes are sent to the server during an update
* lightweight



Contents
--------
* [Getting started](#installation)
* [Examples](#examples)
* [Tests](#tests)


Getting started
---------------
Because of the Same Origin Policy, your html file must served from the same domain as the SharePoint site you want to access. 
You can place your html file containing your app on the server file system or in an asset library.  


index.html:
 
```html


<!doctype html>
<html>
   ....
<script src="jquery.js"></script> 
<!-- you can also use zepto.js -->

<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone-sharepoint.js"></script>
  ...

</html>

```

## <a name="examples"/>Examples

Now let's look at some examples how you can use Backbone.SharePoint. In these examples we will assume you have 
a subsite '/teamsite' in which you have 
created a Contacts list based on the standard contacts list template. 



Hopefully this is sufficient to get you going!




