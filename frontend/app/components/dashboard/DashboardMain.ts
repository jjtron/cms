import {Component, Inject, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Store, AppStore, AppState, getMenuState } from '../../redux_barrel';
import {BASEPATH} from './config';

@Component({
  selector: 'dashboard-component',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: `
    <nav class="navbar navbar-static-top">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="nav navbar-nav">
                <li [class.inactive]="!path.home" [class.active]="path.home">
                    <a #home routerLink="{{basepath}}home">home</a>
                </li>
                <li [class.inactive]="!path.parts" [class.active]="path.parts">
                    <a #parts routerLink="{{basepath}}parts">part</a>
                </li>
                <li [class.inactive]="!path.aml" [class.active]="path.aml">
                    <a #aml routerLink="{{basepath}}aml">aml</a>
                </li>
                <li [class.inactive]="!path.dwgs" [class.active]="path.dwgs">
                    <a #dwgs routerLink="{{basepath}}dwgs">dwgs</a>
                </li>
                <li [class.inactive]="!path.user" [class.active]="path.user">
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
        home: true,
        parts: false,
        aml: false,
        dwgs: false,
        user: false,
    };

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) private basepath: string,
        private renderer: Renderer
        ) {
            store.subscribe(() => {
                let ms = getMenuState(store.getState());
                this.routerLink = ms.currentMenu.path;
                Object.keys(this.path).map((k: string) => {
                    this.path[k] = (this.routerLink === this.basepath + k) ? true : false;
                });
                this.renderer.invokeElementMethod(this[ms.currentMenu.id].nativeElement, 'focus');
            });
    }
}
