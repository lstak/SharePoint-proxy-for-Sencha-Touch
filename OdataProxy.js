/******************************************************************
 *  Ext.ux.ODataProxy 
 * 
 *  Author: Luc Stakenborg
 *  Date: Jan 11, 2012
 * 
 *  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
 *  Copyright (c) 2012, Luc Stakenborg, Oxida B.V.
 ******************************************************************
 */




// Sencha Touch 1.x doesn't implement the model.destroy() method,
// so we define it here in an override.
// The code is adapted from the save method.
Ext.override(Ext.data.Model, {
  destroy: function (options) {
    var me = this,
        action = 'destroy';

    options = options || {};

    Ext.apply(options, {
      records: [me],
      action: action
    });

    var operation = new Ext.data.Operation(options),
        successFn = options.success,
        failureFn = options.failure,
        callbackFn = options.callback,
        scope = options.scope,
        record;

    var callback = function (operation) {
        record = operation.getRecords()[0];

      if (operation.wasSuccessful()) {


        if (typeof successFn == 'function') {
          successFn.call(scope, record, operation);
        }
      } else {
        if (typeof failureFn == 'function') {
          failureFn.call(scope, record, operation);
        }
      }

      if (typeof callbackFn == 'function') {
        callbackFn.call(scope, record, operation);
      }
    };

    me.getProxy()[action](operation, callback, me);

    return me;
  }

})


// OData requires If-Match headers for MERGE/PUT requests
Ext.Ajax.on('beforerequest', function (conn, options) {
  options.headers = options.headers || {};
  if (options.etag) {
    // if etag is provided, add an If-Match HTTP header
    options.headers['If-Match'] = options.etag
  } else {
    // if no etag is provided, remove the If-Match HTTP header again
    delete options.headers['If-Match']
  }
}, this);


Ext.ux.ODataProxy = Ext.extend(Ext.data.RestProxy, {

  actionMethods: {
    create: 'POST',
    read: 'GET',
    // Please note: for updates, MERGE is used instead of PUT.
    // PUT expects all fields to be provided, resetting non-provided field to default values.
    // MERGE will only update provided fields
    update: 'MERGE',   
    destroy: 'DELETE'
  },

  // required, to tell OData service to respond in JSON format
  headers: {
    'Accept': 'application/json'
  },

  // don't use cache busting
  noCache: false,

  limitParam: undefined,

  // provide OData style RESTful urls
  // .../resouce(id) instead of ../resource/id 
  buildUrl: function (request) {
    var records = request.operation.records || [],
            record = records[0],
            url = request.url || this.url,
            id = record ? record.getId() : request.operation.id;

    if (id) {
      url += '(' + id + ')';
    }

    request.url = url;

    return Ext.data.RestProxy.superclass.buildUrl.apply(this, arguments);
  },

  writer: {
    type: 'json',
    writeRecords: function (request, data) {
      var record = request.records[0],
          etag;


      // We need pass the etag header required for the update (MERGE). 
      // The Ext.Ajax beforerequest event creates an 'If-Match' http header if etag is present in request.
      if (request.action == "update") {
        etag = record.raw.__metadata.etag;
        request.etag = etag ;
      }

      // changed to turn data array in single record
      request.jsonData = data[0];

      // override the getRecords function of operation
      request.operation.getRecords = function () {
        var resultSet = this.getResultSet();

        // if a nullResultSet is returned, use this.records
        return (resultSet == undefined || resultSet.count == 0 ? this.records : resultSet.records);
      };

      return request;
    }
  },


  reader: {
    type: 'json',
    root: 'd',

    // override to deal with 204 responses (NO CONTENT)
    read: function (response) {
      var data = response;

      if (response && response.responseText) {
        data = this.getResponseData(response);
      }

      // MERGE and DELETE respond with a 204 NO CONTENT
      // In this case the responseText is an empty string
      if (response && response.responseText == "") {
        data = null;
      }

      if (data) {
        return this.readRecords(data);
      } else {
        return this.nullResultSet;
      }
    },

    getData: function (response) {

      if (response && response.d && response.d.results) {
        response.d = response.d.results
      }

      // RestProxy always expects an array of results,
      // even if there is just a single record.
      if (!Ext.isArray(response.d)) {
        response.d = [response.d]
      }

      return response;

    }
  }
});


// finally, register the proxy type 'odata'
Ext.data.ProxyMgr.registerType('odata', Ext.ux.ODataProxy);
