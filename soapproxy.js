/******************************************************************
 *  Ext.ux.SP.SoapProxy 
 * 
 *  Author: Luc Stakenborg
 *  Date: Jan 31, 2012
 * 
 *  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
 *  Copyright (c) 2012, Luc Stakenborg, Oxida B.V.
 ******************************************************************
 */

Ext.ns('Ext.ux.SP');

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



Ext.ux.SP.SoapProxy = Ext.extend(Ext.data.AjaxProxy, {

    tpl: new Ext.XTemplate(
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope ' +
        '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        '  xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        '  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<{method} xmlns="http://schemas.microsoft.com/sharepoint/soap/">' +
        '{params}' +
        '</{method}>' +
        '</soap:Body>' +
        '</soap:Envelope>'
      ),

    serializeParams: function (params) {
        var params = params || {},
            value,
            xml = '';


        for (key in params) {
            value = params[key];
            if (value) {
                xml += '<' + key + '>';
                switch (key) {
                    case 'viewFields2':
                        xml += this.viewFieldsToXml(value);
                        break;
                    default:
                        xml += params[key];
                        break;
                }

                xml += '</' + key + '>';
            }
        }

        return xml
    },

    serializeBatch: function (config) {
        var xml = '',
            cmd = config.cmd,
            attributes = config.attributes,
            key,
            batch;

        for (key in attributes) {
            xml += '<Field Name="' + key + '"><![CDATA[' + attributes[key] + ']]></Field>'
        };

        xml =
            '<Batch OnError="Continue" PreCalc="TRUE" ListVersion="1">' +
            '<Method ID="1" Cmd="' + cmd + '">' +
            xml +
            '</Method></Batch>'

        return xml;
    },

    serializeOrderBy: function (sorters) {
        var xml = '',
            i = 0,
            len = sorters.length,
            sorter;

        if (len > 0) {
            xml += '<OrderBy>';
            for (; i < len; i++) {
                sorter = sorters[i];
                xml += '<FieldRef Name="' +
                    sorter.property +
                    '" Ascending="' +
                    (sorter.direction === 'ASC' ? 'True' : 'False') +
                    '" />'
            }
            xml += '</OrderBy>';
        }

        return xml
    },





    serializeWhere: function (filters) {
        var xml = '',
            i = 0,
            len = filters.length,
            conditions = [],
            condition,
            filter;

        function nest(conditions, op) {
            var len = conditions.length,
                xml;

            if (len == 1) {
                return conditions;
            } else {
                return '<' + op + '>' + conditions.shift(1) + nest(conditions, op) + '</' + op + '>'
            }
        }

        if (len > 0) {
            xml += '<Where>';
            for (; i < len; i++) {
                filter = filters[i];

                condition = '<Eq>';
                condition += '<FieldRef Name="' + filter.property + '" />'
                condition += '<Value Type="Text">' + filter.value + '</Value>'
                condition += '</Eq>'

                conditions.push(condition);
            };
            xml += nest(conditions, 'And');
            xml += '</Where>';
        }

        return xml
    },

    getMethod: function () {
        return 'POST';
    },

    noCache: false,

    limitParam: undefined,

    buildUrl: function () {
        return this.site + '/_vti_bin/Lists.asmx'
    },

    buildRequest: function (operation, callback, scope) {
        var params = Ext.applyIf(operation.params || {}, this.extraParams || {}),
            id = operation.id,
            limit = operation.limit,
            store,
            queryOptions,
            method,
            batch,
            query,
            cmdMap,
            cmd;


        params = Ext.applyIf(params, this.getParams(params, operation));

        cmdMap = {
            'update': "Update",
            'destroy': "Delete",
            'create': "New"
        };



        if (operation.action === 'read') {
            method = 'GetListItems'
            if (id) {
                query = '<Query><Where><Eq><FieldRef Name="ID"/><Value Type="Counter">' +
                    id +
                    '</Value></Eq>' +
                    '</Where></Query>'
            } else {
                store = scope;

                orderBy = store.remoteSort
                    ? this.serializeOrderBy(store.sorters.items)
                    : '';

                where = store.remoteFilter
                    ? this.serializeWhere(store.filters.items)
                    : '';

                query = orderBy || where
                    ? '<Query>' + where + orderBy + '</Query>'
                    : ''
            }

        } else {
            method = 'UpdateListItems';
            cmd = cmdMap[operation.action];
            batch = this.serializeBatch({
                cmd: cmd,
                attributes: operation.records[0].data
            })
        }

        // set the proxy.headers property
        this.headers = {
            SOAPAction: 'http://schemas.microsoft.com/sharepoint/soap/' + method
        };

        var request = new Ext.data.Request({
            //params: params,
            xmlData: this.tpl.apply({
                method: method,
                params: this.serializeParams({
                    listName: this.list,
                    viewName: this.view,
                    updates: batch,
                    query: query,
                    queryOptions: queryOptions
                    
                })
            }),
            action: operation.action,
            records: operation.records,
            operation: operation
        });

        request.url = this.buildUrl(request);

        operation.request = request;

        return request;
    },

    reader: {
        type: 'xml',
        root: 'Body',
        record: 'row',
        extractValues: function (data) {
            var fields = this.model.prototype.fields.items,
                length = fields.length,
                output = {},
                field, value, i;

            for (i = 0; i < length; i++) {
                field = fields[i];
                value = data.attributes.getNamedItem('ows_' + field.name).nodeValue || field.defaultValue;

                output[field.name] = value;
            }

            return output;
        }
    },

    writer: {
        type: 'xml',
        write: function (request) {
            return request
        }
    }


});


// finally, register the proxy type 'soap'
Ext.data.ProxyMgr.registerType('soap', Ext.ux.SP.SoapProxy);
