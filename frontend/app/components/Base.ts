import {Store, AppState, MenuActions, Menu} from '../redux_barrel';
import {JwtHelper} from 'angular2-jwt';
import {Router} from '@angular/router';

export class Base {

    jwtHelper: JwtHelper = new JwtHelper();
    decodedJwt: any = {};

    constructor (
        protected store: Store<AppState>,
        protected basepath: string,
        protected path: string,
        protected router: Router) {
            let token: string = localStorage.getItem('token');
            let currentMenu: Menu;
            if (token) {
                this.decodedJwt = this.jwtHelper.decodeToken(token);
            }
            let permissions: any = this.decodedJwt.permissions;
            if (!'problem with permissions') {
                this.router.navigate(['']);
                return;
            } else {
                currentMenu = {
                    id: path,
                    path: basepath + path,
                    access: permissions
                };
            }
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
