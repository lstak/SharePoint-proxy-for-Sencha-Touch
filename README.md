# SharePoint proxies for Sencha Touch #
This repository contains 2 data proxies to work with SharePoint lists and libraries from Sencha Touch. 
1. The [OData proxy] uses the SharePoint ListData.svc REST service which is based on [OData](http://www.odata.org). 
2. The [Soap proxy] uses 



## ODataProxy for SharePoint [OData proxy] ##
Ext.ux.SP.ODataProxy is an OData proxy for Sencha Touch. It is designed to let Sencha Touch access SharePoint data using the SharePoint ListData.svc REST service which is based on [OData](http://www.odata.org). You may use it for other OData sources.


Ext.ux.ODataProxy features:

* create, read, update and delete SharePoint items as Sencha Touch models
* fetch multiple SharePoint items from a list in a Sencha Touch store
* support for remote filtering and sorting
* JSON payloads
* partial updates: only changed attributes are sent to the server during an update



### Getting started
Because of the Same Origin Policy, your html file must be served from the same domain as the SharePoint site you want to access. 
You can place your html file containing your app on the server file system or in an asset library. 

Tip: if you are using SharePoint online (Office365), you will notice that when you select a .html file in a doc library, it is presented as a download, not opened in the browser. This is due
to SharePoint setting in SP online which can't be changed.
As a workaround, just use an .aspx file extension, instead of .html. This way, you can start your single page SharePoint application 
from a file in an asset library. 


Here is a basic file which contains all the html to get started. The example.js file contains example code for all CRUD operations.

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

### <a name="examples"/>Examples

Now let's look at some examples how you can use the SharePoint proxy. In these examples we will assume you have 
a subsite '/teamsite' in which you have 
created a Contacts list based on the standard contacts list template. 

First we need to define the Model. In this example we will connect to a SharePoint list based on Contacts list template 

```js
var Contact = Ext.regModel('Contact', {
  fields: [
      // please note CamelCase convention for SharePoint column names
      { name: 'Id', type: 'int' },
      'LastName',
      'FirstName'
    ],

  idProperty: 'Id',

  
  proxy: {
	// use the special odata proxy defined in OdataProxy.js
    type: 'odata',

    // the proxy will connect to the List named 'Contacts' in the /teamsite subsite
    url: '/teamsite/_vti_bin/ListData.svc/Contacts'
  }
});
```

We can now use the CRUD operations on the Contact data model: 

```js


// Create an instance
var contact = new Contact({ LastName: 'Johnson', FirstName: 'Al' })
contact.save();
...


// Read an instance from the server by id
var id = 200;
Contact.load(id);
...


// Update an instance, loaded from the server
Contact.load(id, {
	success: function (contact) {
		contact.set("LastName", "Maxwell");
		contact.save();
	}
});
...


// Delete an instance
Contact.load(id, {
	success: function (contact) {
		contact.destroy()
	}
});
...
```

Using the Contact model you can now easily define a Store to fetch multiple items: 

```js


var store = new Ext.data.Store({
	model: 'Contact'
});

store.load()
```


## <a name="limitations"/>Known limitations

* only works with Sencha Touch 1.1.x. Will not work with Ext 3.x/4.x, due to differences in Ext data model implementation.  I plan to port to ExtJs once ExtJs 4.1 is out of Beta.
* store.sync() doesn't work correctly due to bugs in ST. Please use Ext.data.Model CRUD functions instead
* will work on SharePoint 2010 only (ListData.svc is available on SP2010 only)
* requires authenticated users: ListData.svc is not allowed for anonymous users


## SoapProxy for SharePoint
Ext.ux.SP.ODataProxy is an OData proxy for Sencha Touch. It is designed to let Sencha Touch access SharePoint data using the SharePoint ListData.svc REST service which is based on [OData](http://www.odata.org). You may use it for other OData sources.


Ext.ux.SP.SoapProxy features:

* create, read, update and delete SharePoint items as Sencha Touch models
* fetch multiple SharePoint items from a list in a Sencha Touch store
* support for remote filtering and sorting
* JSON payloads
* partial updates: only changed attributes are sent to the server during an update



### Getting started
Because of the Same Origin Policy, your html file must be served from the same domain as the SharePoint site you want to access. 
You can place your html file containing your app on the server file system or in an asset library. 

Tip: if you are using SharePoint online (Office365), you will notice that when you select a .html file in a doc library, it is presented as a download, not opened in the browser. This is due
to SharePoint setting in SP online which can't be changed.
As a workaround, just use an .aspx file extension, instead of .html. This way, you can start your single page SharePoint application 
from a file in an asset library. 


Here is a basic file which contains all the html to get started. The example.js file contains example code for all CRUD operations.

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

### <a name="examples"/>Examples

Now let's look at some examples how you can use the SharePoint proxy. In these examples we will assume you have 
a subsite '/teamsite' in which you have 
created a Contacts list based on the standard contacts list template. 

First we need to define the Model. In this example we will connect to a SharePoint list based on Contacts list template 

```js
var Contact = Ext.regModel('Contact', {
  fields: [
      // please note CamelCase convention for SharePoint column names
      { name: 'Id', type: 'int' },
      'LastName',
      'FirstName'
    ],

  idProperty: 'Id',

  
  proxy: {
	// use the special odata proxy defined in OdataProxy.js
    type: 'odata',

    // the proxy will connect to the List named 'Contacts' in the /teamsite subsite
    url: '/teamsite/_vti_bin/ListData.svc/Contacts'
  }
});
```

We can now use the CRUD operations on the Contact data model: 

```js


// Create an instance
var contact = new Contact({ LastName: 'Johnson', FirstName: 'Al' })
contact.save();
...


// Read an instance from the server by id
var id = 200;
Contact.load(id);
...


// Update an instance, loaded from the server
Contact.load(id, {
	success: function (contact) {
		contact.set("LastName", "Maxwell");
		contact.save();
	}
});
...


// Delete an instance
Contact.load(id, {
	success: function (contact) {
		contact.destroy()
	}
});
...
```

Using the Contact model you can now easily define a Store to fetch multiple items: 

```js


var store = new Ext.data.Store({
	model: 'Contact'
});

store.load()
```


## Known limitations

* only works with Sencha Touch 1.1.x. Will not work with Ext 3.x/4.x, due to differences in Ext data model implementation.  I plan to port to ExtJs once ExtJs 4.1 is out of Beta.
* store.sync() doesn't work correctly due to bugs in ST. Please use Ext.data.Model CRUD functions instead
* will work on SharePoint 2010 only (ListData.svc is available on SP2010 only)
* requires authenticated users: ListData.svc is not allowed for anonymous users









Hopefully this is enough to get you started!




