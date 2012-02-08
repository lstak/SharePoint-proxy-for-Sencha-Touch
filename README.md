# SharePoint proxies for Sencha Touch #
This repository contains 2 data proxies to work with SharePoint lists and libraries from Sencha Touch. 

1. The [OData proxy](#odataproxy) uses the SP ListData.svc REST service which is based on [OData](http://www.odata.org). 
2. The [Soap proxy](#soapproxy) uses SP Web Services.



## <a name="odataproxy"/>ODataProxy  ##
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


### <a name="limitations"/>Known limitations

* only works with Sencha Touch 1.1.x. Will not work with Ext 3.x/4.x, due to differences in Ext data model implementation.  I plan to port to ExtJs once ExtJs 4.1 is out of Beta.
* store.sync() doesn't work correctly due to bugs in ST. Please use Ext.data.Model CRUD functions instead
* will work on SharePoint 2010 only (ListData.svc is available on SP2010 only) 
* requires authenticated users: ListData.svc is not allowed for anonymous users
* 


## <a name="soapproxy"/>SoapProxy for SharePoint
Ext.ux.SP.SoapProxy is an Soap proxy for Sencha Touch. It allows Sencha Touch apps access SharePoint data using the SharePoint WebServices service. Read operations are based on the [GetListItems](http://msdn.microsoft.com/en-us/library/websvclists.lists.getlistitems.aspx) method of Lists.asmx. Create, Update and Delere operations use the [UpdateListItems](http://msdn.microsoft.com/en-us/library/websvclists.lists.updatelistitems.aspx) method. 


Ext.ux.SP.SoapProxy features:

* create, read, update and delete SharePoint items as Sencha Touch models
* fetch multiple SharePoint items from a list in a Sencha Touch store
* support for remote filtering and sorting
* XML payloads
* partial updates: only changed attributes are sent to the server during an update

Differences between SOAP and OData access to SharePoint:

* SOAP access supported in SP 2007 and 2010. OData only in SP 2010
* Unauthenticated use of SP web services allowed (governed by site permission settings). Unauthenticed use of ListData.svc not allowed (even if site access is allowed for unauthenticated users).
* SOAP uses internal field names. OData uses display names (whitespace trimmed).
* SOAP provides PermMask (permission mark) info. OData does not.



### Getting started
Similar to the description above you need to have an .html (or .aspx) file containing the scripts for your application. Here we include the soapproxy.js file.


example.apsx:
 
```html


<!DOCTYPE html>
<html>
	<head>
	<title>SharePoint Soap proxy example</title>

	<!-- Sencha Touch include -->
	<script src="sencha-touch.js"></script> 

	<!-- app includes -->
	<script src="soapproxy.js"></script>
	<script src="soap_example.js"></script>
	</head>
	<body>
	...
	</body>
</html>

```

### Examples

Now let's look at some examples how you can use the SharePoint SOAP proxy. Again we will assume you have 
a subsite '/teamsite' in which you have created a Contacts list based on the standard contacts list template. 

First we need to define the Model. 

```js
var Contact = Ext.regModel('Contact', {
  fields: [
      // please note CamelCase convention for SharePoint column names
      { name: 'ID', type: 'int' },
      'Title',
      'FirstName'
    ],

  idProperty: 'ID',

  
  proxy: {
	// use the special SOAP proxy defined in soappproxy.js
    type: 'soap',

    // the proxy will connect to the List named 'Contacts' in the /teamsite subsite
    site: '/teamsite',
	list: 'Contacts'
	// optionally, you can specify a view by its GUID
	// otherwise the default view is used
	//view: '{VIEW-GUID}'
  }
});
```
Please note the differences with the OData example:

* use 'ID' (all caps) instead of 'Id'
* use internal field names, i.e. 'Title' instead of 'LastName'

We can now use the CRUD operations on the Contact data model: 

```js

// create new model instance
var contact = new Contact({
    Title: 'Davis',
    FirstName: 'John'
})

// save it to the server, creating a new SP item
contact.save({
	// after server response is received, the callback function is executed
    callback: function (record1, operation) {
        console.log('Record created', record1, operation);

		// change an attribute
        record1.set('FirstName', 'John-Paul');

		// persist change to the server 
        record1.save({
            callback: function (record2, operation) {
                console.log('Record changed', record2, operation);

				// now let's delete the item from the server
                record2.destroy({
                    callback: function (record3, operation) {
                        console.log('Record destroyed', record3, operation);
                    }
                })
            }
        })


    }
})


// here's how to load a specific instance:
Contact.load(230, {
    success: function (record, operation) {
        console.log('Single record load', record, operation);
    }
})

```

Using the Contact model you can now easily define a Store to fetch multiple items: 

```js


var store = new Ext.data.Store({
	model: 'Contact'
});

store.load()
```

Remote sorting and filtering is possible, by defining sorters and filters as described in Sencha Touch documentation. You must set remoteSort and remoteFilter to true, otherwise the store will use local sorting and filtering.

```js


var sorters = [{
    property: 'Title',
    direction: 'DESC'
}, {
    property: 'FirstName',
    direction: 'DESC'
}];

var filters = [{
    property: 'Title',
    value: 'Heisenberg'
}]


var store = new Ext.data.Store({
    model: 'Contact',
    sorters: sorters,
    filters: filters,
    remoteSort: true,
    remoteFilter: true
});


store.load();
```



### Known limitations

* only works with Sencha Touch 1.1.x. Will not work with Ext 3.x/4.x, due to differences in Ext data model implementation.  I plan to port to ExtJs once ExtJs 4.1 is out of Beta.
* store.sync() doesn't work correctly due to bugs in ST. Please use Ext.data.Model CRUD functions instead.
* paging not yet implemented








Hopefully this is enough to get you started!




