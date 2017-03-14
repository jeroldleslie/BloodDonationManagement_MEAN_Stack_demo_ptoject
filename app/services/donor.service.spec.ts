import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { DonorService } from '../services/donor.service';

describe('DonorServiceTests', () => {
    let backend;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DonorService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            imports: [
                HttpModule
            ]
        });
    });



    it('should construct', async(inject(
        [DonorService, MockBackend], (service, mockBackend) => {

            expect(service).toBeDefined();
        })));



    describe('getDonor', () => {
        const mockData = {
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        };
        it('should get single donor', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Get);
                    expect(conn.request.url).toEqual('/api/donor/5896a1d117fb1c3e74567b11');
                    //expect(conn.request.text()).toEqual(JSON.stringify(mockData));
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');

                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockData) })));
                });
                const result = service.getDonor("5896a1d117fb1c3e74567b11");
                result.subscribe(res => {
                    expect(res).toEqual(mockData);
                });
            })));
    });


    describe('filterDonors', () => {
        const mockData = [{
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        }];

        const mockBody = {
            location: {
                $geoWithin:
                {
                    $geometry:
                    {
                        type: "Polygon",
                        coordinates: [[
                            [-138.68999999998366, 48.46347505316579],
                            [-26.19000000001358, 48.46347505316579],
                            [-26.19000000001358, 20.31066306671325],
                            [-138.68999999998366, 20.31066306671325],
                            [-138.68999999998366, 48.46347505316579]]]
                    }
                }
            }
        };
        it('should get filtered donors', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Post);
                    expect(conn.request.url).toEqual('/api/donors');
                    expect(conn.request.text()).toEqual(JSON.stringify(mockBody));
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');

                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockData) })));
                });
                const result = service.filterDonors(mockBody);
                result.subscribe(res => {
                    expect(res).toEqual(mockData);
                });
            })));
    });


    describe('getAllDonors', () => {
        const mockData = [{
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        }];
        it('should get all donors', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Get);
                    expect(conn.request.url).toEqual('/api/donors');
                    //expect(conn.request.text()).toEqual(JSON.stringify(mockData));
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');
                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockData) })));
                });
                const result = service.getAllDonors();
                result.subscribe(res => {
                    expect(res).toEqual(mockData);
                });
            })));
    });

    describe('addDonor', () => {
        const mockBody = {
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        };
        const mockResponse = {
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        };

        it('should add donor', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Post);
                    expect(conn.request.url).toEqual('/api/donor');
                    expect(conn.request.text()).toEqual(JSON.stringify(mockBody));
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');

                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
                });
                const result = service.addDonor(mockBody);
                result.subscribe(res => {
                    expect(res).toEqual(mockResponse);
                });
            })));
    });

    describe('updateDonor', () => {
        const mockData = {
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        };
        it('should update donor', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Put);
                    expect(conn.request.url).toEqual('/api/donor/' + mockData._id);
                    expect(conn.request.text()).toEqual(JSON.stringify(mockData));
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');

                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockData) })));
                });
                const result = service.updateDonor(mockData);
                result.subscribe(res => {
                    expect(res).toEqual(mockData);
                });
            })));
    });


    describe('deleteDonor', () => {
        const mockData = {
            "_id": "5896a1d117fb1c3e74567b11",
            "fname": "sfasf",
            "lname": "asf",
            "contactNum": "0099 999 9999 999",
            "email": "sadf@sdf.com",
            "address": {
                "addr": null,
                "city": "sdf",
                "state": null,
                "country": "sf",
                "pcode": null
            },
            "bloodGroup": "AB Unknown",
            "location": {
                "coordinates": [
                    -100.44659179686892,
                    42.05992354947267
                ],
                "type": "Point"
            }
        };

        it('should delete donor', async(inject(
            [DonorService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.method).toEqual(RequestMethod.Delete);
                    expect(conn.request.url).toEqual('/api/donor/' + mockData._id);
                    expect(conn.request.headers.get('Content-Type')).toEqual('application/json');

                    conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockData) })));
                });
                const result = service.deleteDonor(mockData._id);
                result.subscribe(res => {
                    expect(res).toEqual(mockData);
                });
            })));
    });





});
