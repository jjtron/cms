import {Injectable} from '@angular/core';
import {Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Part} from '../models/Part';
import {Amp} from '../models/Amp';

@Injectable()
export class DataService {

    dbUrl: string;
    contentType: string;

    constructor(private http: Http) {
        let protocol: string = window.location.protocol + '//';
        let hostname: string = window.location.hostname;
        this.dbUrl = protocol + hostname + ':3000/';
        this.contentType = 'application/json';
    }

    login (username: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);

        return this.http.post(
            this.dbUrl + 'login',
            JSON.stringify({ username: username, password: password }),
            { headers: headers }
        )
        // .timeout(5000, 'Error: excessive response time from server')
        .map((res: Response) => res.json());
    }

    register (username: string, password: string, permissions: any) {
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);

        return this.http.post(
            this.dbUrl + 'user',
            JSON.stringify({ username: username, password: password, permissions: permissions }),
            { headers: headers }
        );
    }

    updateUser (username: string, permissions: any) {
        return this.http.put(
            this.dbUrl + 'user',
            JSON.stringify({ username: username, permissions: permissions }),
            { headers: this.getHeaders()}
        );
    }

    getUserPermissions (username: string) {
        return this.http.get(
            this.dbUrl + 'user?name=' + username,
            { headers: this.getHeaders()}
        )
        .map((res: Response) => res.json());
    }

    postPart (part: Part) {
        return this.http.post(
            this.dbUrl + 'part',
            JSON.stringify(part),
            { headers: this.getHeaders()}
        );
    }

    putPart (part: Part) {
        return this.http.put(
            this.dbUrl + 'part',
            JSON.stringify(part),
            { headers: this.getHeaders()}
        );
    }

    getPart (partname: string) {
        return this.http.get(
            this.dbUrl + 'part?partname=' + partname,
            { headers: this.getHeaders()}
        )
        .map((res: Response) => res.json());
    }

    postAmp (amp: Amp) {
        return this.http.post(
            this.dbUrl + 'amp',
            JSON.stringify(amp),
            { headers: this.getHeaders()}
        );
    }

    getSubset (setName: string, pattern: string) {
        return this.http.get(
            this.dbUrl + `subset?set=${setName}&pattern=${pattern}`,
            { headers: this.getHeaders()}
        )
        .map((res: Response) => res.json());
    }

    getExists (setName: string, pattern: string) {
        return this.http.get(
            this.dbUrl + `exists?set=${setName}&pattern=${pattern}`,
            { headers: this.getHeaders()}
        )
        .map((res: Response) => res.json());
    }

    getAuthToken () {
        return 'Bearer ' + localStorage.getItem('token');
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);
        headers.append('Authorization', this.getAuthToken ());
        return headers;
    }
    getAjaxRequestHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);
        headers.append('Jjtron-Ajax-Request', 'true');
        return headers;
    }
}
