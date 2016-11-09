import {EventEmitter} from '@angular/core';

export class EventService {

    public rxEmitter: any;

    constructor() {
        this.rxEmitter = new EventEmitter();
    }
    notify(isLogin: boolean) {
        this.rxEmitter.next(isLogin);
    }
}
