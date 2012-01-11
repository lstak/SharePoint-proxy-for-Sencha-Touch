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
* [Known limitations](#limitations)



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

First we need to define the Model. In this example we will connect to a SharePoint list based on Contacts list template 

```js
var Contact = Ext.regModel('Contact', {
  fields: [
      // please note CamelCase convention for SharePoint columns
      { name: 'Id', type: 'int' },
      'LastName',
      'FirstName'
    ],

  idProperty: 'Id',

  // use the special Odata proxy defined in OdataProxy.js
  proxy: {
    type: 'odata',
    // please note: the proxy will connect to the List named 'Contacts' in the /teamsite subsite
    url: '/teamsite/_vti_bin/ListData.svc/Contacts'
  }
});
```

```js
// define a Store
var store = new Ext.data.Store({
  model: 'Contact',
  autoLoad: false
});


// the following CRUD functions exercise the odata proxy and are 
// chained together through the success handler
function doCreate() {
  var contact = new Contact({ LastName: 'Johnson', FirstName: 'Al' })
  console.log('Creating: ' + contact.get("LastName"))
  contact.save({
    success: doLoad
  });
}

function doLoad(contact) {
  // contact holds the previously created model,
  // including the Id provided by the SharePoint server
  console.log('Loading: ' + contact.getId())
  Contact.load(contact.getId(), {
    success: doUpdate
  });
}

function doUpdate(contact) {
  console.log('Updating: ' + contact.get("LastName"))
  contact.set("LastName", "Maxwell");
  contact.save({
    success: doDestroy
  });
}


function doDestroy(contact) {
  console.log('Destroying: ' + contact.get("LastName"))
  contact.destroy({
    success: doStoreLoad,
    
  });
}

function doStoreLoad() {
  store.load({
    callback: function () { console.log('store loaded') }
  })
}

```



## <a name="limitations"/>Known limitations

* only works with Sencha Touch 1.1.x. Will not work with Ext 3.x/4.x.  I will port to ExtJs once ExtJs 4.1 is out of Beta.
* store.sync() doesn't work correctly do to bugs in ST. Use Ext.data.Model CRUD functions instead.



Hopefully this is sufficient to get you going!




