/**
* @author of ExtJS 4.* version: Tomek Stojecki
* @author of Sencha Touch version: Luc Stakenborg, see https://github.com/lstak/SharePoint-proxy-for-Sencha-Touch
*
* OData proxy used for interacting with SharePoint 2010 lists and libraries using the built-in REST service.
* Based on Sencha Touch version created by Luc Stakenborg.
* 
* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
*/

Ext.ns('My');

Ext.define('My.data.ODataWriter', {

    extend: 'Ext.data.JsonWriter',
    alias: 'writer.odata',
    allowSingle: true,

    write: function (request) {
        var me = this,
        record = request.records[0];

        // for updates, set the if-match header to a matching etag
        if (request.proxy) {
            if (request.action === 'update') {
                request.proxy.headers['If-Match'] = record.raw.__metadata.etag;
            }
            else {
                if (request.headers['If-Match']) {
                    delete request.headers['If-Match'];
                }
            }
        }

        return me.callParent(arguments);
    }

});

Ext.define('My.data.ODataProxy', {

    extend: 'Ext.data.RestProxy',
    alias: 'proxy.odata',
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

    // do not append the id of the record to the end of the string, use odata (id) convention instead
    appendId: false,

    // don't use cache busting
    noCache: false,

    limitParam: '$top',

    startParam: '$skip',

    sortParam: '$orderby',

    filterParam: '$filter',

    // encode $orderby value for remote sorting
    encodeSorters: function (sorters) {
        var sort = [],
            length = sorters.length,
            i;

        for (i = 0; i < length; i++) {
            sort[i] = sorters[i].property +
                    (sorters[i].direction == 'DESC' ? ' desc' : '')
        }

        return sort.join(',');
    },

    // encode $filter value for remote filtering
    encodeFilters: function (filters) {
        var filter = [],
            length = filters.length,
            sq,
            i;

        for (i = 0; i < length; i++) {                        
            sq = (typeof filters[i].value == 'string') ? '"' : '';
            filter[i] = filters[i].property + ' eq ' + sq + filters[i].value + sq
        }

        return filter.join(' and ');
    },

    // provide odata style urls
    // .../resouce(id) instead of ../resource/id 
    buildUrl: function (request) {
        var me = this,
            operation = request.operation,
            records = operation.records || [],
            record = records[0],
            url = this.site
                ? this.site + '/_vti_bin/listdata.svc/' + this.list
                : me.getUrl(request),
            id = record ? record.getId() : operation.id;

        if (id) {
            url += '(' + id + ')';
        }

        request.url = url;

        return me.callParent(arguments);
    },


    reader: {
        type: 'json',
        root: 'd'
    },

    writer: {
        type: 'odata'
    }
});