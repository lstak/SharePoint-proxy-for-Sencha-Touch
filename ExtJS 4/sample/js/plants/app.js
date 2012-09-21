Ext.Loader.setConfig({
    enabled: true
});

Ext.require([
            'Ext.selection.CellModel',
            'Ext.grid.*',
            'Ext.data.*',
            'Ext.util.*',
            'Ext.state.*',
            'Ext.form.*',
            'Ext.toolbar.Paging'
        ]);

Ext.onReady(function () {
    var grid,
        cellEditing,
        store;

    function convertDate(value) {
        if (typeof value == 'string')
            return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));

        return value;
    }

    function formatDate(value) {
        return value ? Ext.Date.dateFormat(value, 'M d, Y') : '';
    }


    // model representing a list item
    Ext.define('My.data.Plant', {
        extend: 'Ext.data.Model',
        fields: [
                    { name: 'Id', persist: false },
                    { name: 'CommonName', type: 'string' },
                    { name: 'Light' },
                    { name: 'LightValue', type: 'string' },
                    { name: 'Price', type: 'float' },
                    { name: 'Available', type: 'date', dateFormat: 'm/d/Y', convert: convertDate }, // dates can be automatically converted by specifying dateFormat
                    {name: 'Indoor', type: 'bool' }
                ],
        idProperty: 'Id',
        proxy: {
            type: 'odata',
            site: 'http://localhost',
            list: 'Plants'
        }
    });

    // store with the odata proxy pointing to the list
    store = Ext.create('Ext.data.Store', {
        model: 'My.data.Plant',
        proxy: {
            type: 'odata',
            site: 'http://localhost',
            list: 'Plants'
        },
        remoteSort: true,
        sorters: [{
            property: 'CommonName',
            direction: 'ASC'
        }],
        pageSize: 10,
        autoDestroy: true
    });

    cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    // grid with fields representing list fields    
    grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
                    {
                        header: 'ID',
                        dataIndex: 'Id'
                    },
                    {
                        header: 'Common Name',
                        dataIndex: 'CommonName',
                        flex: 1,
                        field: {
                            allowBlank: false
                        }
                    },
                    {
                        header: 'Light',
                        dataIndex: 'LightValue',
                        width: 130,
                        field: {
                            xtype: 'combobox',
                            triggerAction: 'all',
                            selectOnTab: true,
                            store: [
                                ['Shade', 'Shade'],
                                ['Mostly Shady', 'Mostly Shady'],
                                ['Sun or Shade', 'Sun or Shade'],
                                ['Mostly Sunny', 'Mostly Sunny'],
                                ['Sunny', 'Sunny']
                            ],
                            listClass: 'x-combo-list-small'
                        }
                    },
                    {
                        header: 'Price',
                        dataIndex: 'Price',
                        width: 70,
                        align: 'right',
                        renderer: 'usMoney',
                        field: {
                            xtype: 'numberfield',
                            allowBlank: false,
                            minValue: 0,
                            maxValue: 100000
                        }
                    },
                    {
                        header: 'Available',
                        dataIndex: 'Available',
                        width: 95,
                        renderer: formatDate,
                        field: {
                            xtype: 'datefield',
                            format: 'm/d/y',
                            minValue: '01/01/06',
                            disabledDays: [0, 6],
                            disabledDaysText: 'Plants are not available on the weekends'
                        }
                    }
                ],
        renderTo: 'ctl00_MSO_ContentDiv', // <- make sure you update this if you use a different sharepoint master page
        loadMask: true,
        width: 600,
        height: 300,
        title: 'Edit Plants',
        frame: true,
        selModel: {
            selType: 'cellmodel'
        },
        tbar: [{
            text: 'Add Plant',
            handler: function () {
                // create a record instance 
                var r = Ext.create('My.data.Plant', {
                    CommonName: 'Enter Name',
                    Light: { "__metadata": { "uri": "http://localhost/_vti_bin/listdata.svc/PlantsLight('Sunny')"} },
                    LightValue: 'Sunny',
                    Price: 10,
                    Available: '/Date(1144886400000)/',
                    Indoor: false
                });

                store.insert(0, r);
                cellEditing.startEditByPosition({ row: 0, column: 1 });                
            }
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        }),
        plugins: [cellEditing],
        listeners: {
            edit: function (editor, e) {
                store.sync({
                    success: function (batch, options) {
                        // sync up etags with what was sent by the server
                        // will look into making that part of the proxy
                        var op = batch.operations[0],
                            meta = { etag: op.response.getResponseHeader('etag') };

                        if (op.action === 'create') {
                            op.records[0].raw.__metadata = meta;
                        }
                        else if (op.action === 'update') {
                            op.records[0].raw.__metadata.etag = meta.etag;
                        }

                        if (op.request.headers['If-Match']) {
                            delete op.request.headers['If-Match'];
                        }
                    }
                });
            }
        }
    });

    store.load();

});