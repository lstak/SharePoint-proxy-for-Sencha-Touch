

// Define a Contact Model
// In this example we will connect to a SharePoint list based on Contacts list template 
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



// Kick-off the tests
doCreate();










