import { inject,
    fakeAsync,
    tick,
    TestBed
} from '@angular/core/testing';

import {MockBackend} from '@angular/http/testing';

import {
    Http,
    ConnectionBackend,
    BaseRequestOptions,
    Response,
    ResponseOptions,
    RequestMethod
} from '@angular/http';

import {DataService} from '../../app/services/DataService';
import "rxjs/add/operator/map";

describe('DataService tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                DataService,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend,
                        defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }, deps: [MockBackend, BaseRequestOptions]
                },
            ]
        });
        localStorage.setItem('token', 'somejwt');
    });

    describe('login', () => {
        it('retrieves using the username and pw',
            inject([DataService, MockBackend], fakeAsync((dataService: DataService, mockBackend: MockBackend) => {
                var res: any; 
                mockBackend.connections.subscribe((c: any) => {
                    expect(c.request.url).toBe('http://localhost:3000/login');
                    expect(c.request.method).toBe(RequestMethod.Post);
                    expect(c.request._body).toEqual(JSON.stringify({username: 'u', password: 'p'}));
                    expect(c.request.headers.has('Content-Type')).toBeTruthy();
                    expect(c.request.headers.get('Content-Type')).toEqual('application/json');
                    
                    let response = new ResponseOptions({ body: '{"name": "any"}' });
                    c.mockRespond(new Response(response));
                });
                dataService.login('u','p')
                    .subscribe((_res: any) => {
                    res = _res;
                });
                tick();
                expect(res.name).toBe('any');
            }))
        );
    });

    describe('register', () => {
        it('posts using the username and pw and return 201',
            inject([DataService, MockBackend], fakeAsync((dataService: DataService, mockBackend: MockBackend) => {
                var res: any; 
                mockBackend.connections.subscribe((c: any) => {
                    expect(c.request.url).toBe('http://localhost:3000/user');
                    expect(c.request.method).toBe(RequestMethod.Post);
                    expect(c.request._body).toEqual(JSON.stringify({username: 'u', password: 'p', permissions: 'somegroup'}));
                    expect(c.request.headers.has('Content-Type')).toBeTruthy();
                    expect(c.request.headers.get('Content-Type')).toEqual('application/json');
                    
                    let response = new ResponseOptions({ status: 201 });
                    c.mockRespond(new Response(response));
                });
                dataService.register('u','p','somegroup')
                    .subscribe((_res: any) => {
                    res = _res;
                });
                tick();
                expect(res.status).toBe(201);
            }))
        );
    });

    describe('updateUser', () => {
        it('should put user',
            inject([DataService, MockBackend], fakeAsync((dataService: DataService, mockBackend: MockBackend) => {
                var res: any; 
                mockBackend.connections.subscribe((c: any) => {
                    expect(c.request.url).toBe('http://localhost:3000/user');
                    expect(c.request.method).toBe(RequestMethod.Put);
                    expect(c.request._body).toEqual(JSON.stringify({username: 'u', permissions: 'somegroup'}));
                    expect(c.request.headers.has('Content-Type')).toBeTruthy();
                    expect(c.request.headers.get('Content-Type')).toEqual('application/json');
                    expect(c.request.headers.get('Authorization')).toEqual('Bearer somejwt');
                    
                    let response = new ResponseOptions({ status: 204 });
                    c.mockRespond(new Response(response));
                });
                dataService.updateUser('u','somegroup')
                    .subscribe((_res: any) => {
                    res = _res;
                });
                tick();
                expect(res.status).toBe(204);
            }))
        );
    });
});