describe("ExtJS", function () {

    it("should be defined", function () {
        expect(window.Ext).toBeDefined();
    });

});

describe("odata proxy", function () {

    var proxy, request, url;
    beforeEach(function () {
        proxy = new My.data.ODataProxy(),
        request = {
            operation: {}
        };
    });

    it("should be defined", function () {
        expect(proxy).toBeDefined();
    });

    describe("when configured with proxy url", function () {
        it("builds odata url pointing to the url", function () {
            proxy.url = "http://test";

            url = proxy.buildUrl(request);

            expect(url).toBe("http://test");
        });
    });

    describe("when configured with site and list", function () {

        beforeEach(function () {
            proxy.site = "http://site";
            proxy.list = "list";
        });

        it("builds odata url ponting to the list", function () {
            url = proxy.buildUrl(request);

            expect(url).toBe("http://site/_vti_bin/listdata.svc/list");
        });

        describe("and operation id", function () {
            it("appends the id to the end of the url", function () {
                request.operation.id = 1;

                url = proxy.buildUrl(request);

                expect(url).toBe("http://site/_vti_bin/listdata.svc/list(1)");
            });
        });

        describe("and record id", function () {
            it("appends the id to the end of the url", function () {

                Ext.define('My.data.Record', {
                    extend: 'Ext.data.Model',
                    fields: ['id'],
                    idProperty: 'id'
                });

                var record = new My.data.Record({ id: 1 });
                request.operation.records = [
                    record
                ];

                url = proxy.buildUrl(request);

                expect(url).toBe("http://site/_vti_bin/listdata.svc/list(1)");
            });
        });

    });

});

describe("store with odata proxy", function () {

    var store, proxy, model, request, url, sutReq;

    Ext.define('My.data.Record', {
        extend: 'Ext.data.Model',
        fields: ['id', 'name'],
        idProperty: 'id'
    });

    beforeEach(function () {
        proxy = new My.data.ODataProxy({
            site: 'site',
            list: 'list'
        }),
        request = {
            operation: {}
        };

        spyOn(Ext.Ajax, 'request').andCallFake(function (req) {
            sutReq = req;
        });
    });

    describe("when remote sorting and sorter specified", function () {

        beforeEach(function () {
            store = new Ext.data.Store({
                proxy: proxy,
                remoteSort: true,
                model: 'My.data.Record',
                sorters: [{
                    property: 'name',
                    direction: 'asc'
                }]
            });
        });

        it("should include encoded sort parameters in params", function () {

            store.load();

            expect(sutReq.url).toBe('site/_vti_bin/listdata.svc/list');
            expect(sutReq.params.$orderby).toBe('name');
        });

    });

    describe("when remote sorting and multiple sorters specified", function () {

        beforeEach(function () {
            store = new Ext.data.Store({
                proxy: proxy,
                remoteSort: true,
                model: 'My.data.Record',
                sorters: [
                    {
                        property: 'name',
                        direction: 'asc'
                    },
                    {
                        property: 'zipcode',
                        direction: 'DESC'
                    }
                ]
            });
        });

        it("should include encoded sorters in params", function () {

            store.load();

            expect(sutReq.url).toBe('site/_vti_bin/listdata.svc/list');
            expect(sutReq.params.$orderby).toBe('name,zipcode desc');
        });

    });

    describe("when remote filtering and string filter is specified", function () {

        beforeEach(function () {
            store = new Ext.data.Store({
                proxy: proxy,
                remoteFilter: true,
                model: 'My.data.Record',
                filters: [
                    {
                        property: 'name',
                        value: 'tim'
                    }
                ]
            });
        });

        it("should include encoded and quoted filters in params", function () {

            store.load();

            expect(sutReq.url).toBe('site/_vti_bin/listdata.svc/list');
            expect(sutReq.params.$filter).toBe('name eq "tim"');
        });

    });

    describe("when remote filtering and number filter is specified", function () {

        beforeEach(function () {
            store = new Ext.data.Store({
                proxy: proxy,
                remoteFilter: true,
                model: 'My.data.Record',
                filters: [
                    {
                        property: 'age',
                        value: 20
                    }
                ]
            });
        });

        it("should include encoded filters in params", function () {

            store.load();

            expect(sutReq.url).toBe('site/_vti_bin/listdata.svc/list');
            expect(sutReq.params.$filter).toBe('age eq 20');
        });

    });

    describe("when remote filtering and multiple filters are specified", function () {

        beforeEach(function () {
            store = new Ext.data.Store({
                proxy: proxy,
                remoteFilter: true,
                model: 'My.data.Record',
                filters: [
                    {
                        property: 'name',
                        value: 'Tim'
                    },
                    {
                        property: 'age',
                        value: 20
                    }
                ]
            });
        });

        it("should include encoded filters with and operator", function () {

            store.load();

            expect(sutReq.url).toBe('site/_vti_bin/listdata.svc/list');
            expect(sutReq.params.$filter).toBe('name eq "Tim" and age eq 20');
        });

    });   

});