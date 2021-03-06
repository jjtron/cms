import {Injectable} from '@angular/core';
import {Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

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
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);

        return this.http.put(
            this.dbUrl + 'user',
            JSON.stringify({ username: username, permissions: permissions }),
            { headers: this.getHeaders()}
        );
    }

    getUserPermissions (username: string) {
        let headers = new Headers();
        headers.append('Content-Type', this.contentType);

        return this.http.get(
            this.dbUrl + 'user?name=' + username,
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
