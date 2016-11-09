import {SpyObject} from '../helpers/helper';
import {DataService} from '../../app/services/DataService';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export class DataServiceMock extends SpyObject {
    login: SpyObject;
    fakeResponse: any;

    constructor() {
        super(DataService);
        this.fakeResponse = null;
        this.login = this.spy('login').andReturn(this);
    }

    setAltLoginSpy () {
        this.login = this.spy('login')
            .andReturn(Observable.throw(new Error('login error!')));
    }

    subscribe(callback: any) {
        callback(this.fakeResponse);
    }

    setResponse(json: any): void {
        this.fakeResponse = json;
    }

    getProviders(): Array<any> {
        return [{ provide: DataService, useValue: this }];
    }
}