import {Component, Inject, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Store, AppStore, AppState, getMenuState } from '../../redux_barrel';
import {BASEPATH} from './config';
import {Router} from '@angular/router';

@Component({
  selector: 'dashboard-component',
  styleUrls: [
    'app/css/styles.css'
  ],
  template: `
    <nav class="navbar navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle"
                  data-toggle="collapse" data-target="#menu-navbar"
                  style="border: 1px solid white !important; margin-top: 4px !important;
                         margin-bottom: 0px !important; padding-top: 2px; padding-bottom: 3px">
            <span class="icon-bar" style="background-color: white"></span>
            <span class="icon-bar" style="background-color: white"></span>
            <span class="icon-bar" style="background-color: white"></span> 
          </button>
          <div class="navbar-brand"  style="color: white">Menu</div>
        </div>
        <div class="collapse navbar-collapse" id="menu-navbar">
          <ul class="nav navbar-nav">
                <li [class.inactive]="!path.home" [class.active]="path.home" *ngIf="userAccess.home === 'true'">
                    <a #home routerLink="{{basepath}}home">home</a>
                </li>
                <li [class.inactive]="!path.parts" [class.active]="path.parts" *ngIf="userAccess.parts !== 'noaccess'">
                    <a #parts routerLink="{{basepath}}parts">part</a>
                </li>
                <li [class.inactive]="!path.aml" [class.active]="path.aml" *ngIf="userAccess.aml !== 'noaccess'">
                    <a #aml routerLink="{{basepath}}aml">aml</a>
                </li>
                <li [class.inactive]="!path.dwgs" [class.active]="path.dwgs" *ngIf="userAccess.dwgs !== 'noaccess'">
                    <a #dwgs routerLink="{{basepath}}dwgs">dwgs</a>
                </li>
                <li [class.inactive]="!path.user" [class.active]="path.user" *ngIf="userAccess.admin === 'true'">
                    <a #user routerLink="{{basepath}}user">user</a>
                </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>`
})

export class DashboardMain {

    routerLink: string;
    @ViewChild('parts') parts: ElementRef;
    @ViewChild('aml') aml: ElementRef;
    @ViewChild('dwgs') dwgs: ElementRef;
    @ViewChild('user') user: ElementRef;
    @ViewChild('home') home: ElementRef;
    path: any = {
        home:  true,
        parts: false,
        aml:   false,
        dwgs:  false,
        user:  false,
    };
    userAccess: any = {
        home:       'false',
        parts:      'noaccess',
        aml:        'noaccess',
        dwgs:       'noaccess',
        admin:      'false'
    };

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) private basepath: string,
        private renderer: Renderer,
        private router: Router
        ) {
            store.subscribe(() => {
                let ms = getMenuState(store.getState());
                this.userAccess = Object.assign(this.userAccess, ms.currentMenu.access);
                this.routerLink = ms.currentMenu.path;
                Object.keys(this.path).map((k: string) => {
                    this.path[k] = (this.routerLink === this.basepath + k) ? true : false;
                });
                setTimeout(() => {
                    if (this[ms.currentMenu.id] !== 'undefined') {
                        this.renderer.invokeElementMethod(this[ms.currentMenu.id].nativeElement, 'focus');
                    }
                }, 0);
            });
    }
}
