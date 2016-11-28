import {Component, Inject, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Store, AppStore, AppState, getMenuState } from '../../redux_barrel';

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
                <li [ngClass]="{'active': routerLink === '/dashboard/parts', 'inactive': routerLink !== '/dashboard/parts'}">
                    <a #parts routerLink="/dashboard/parts">part</a>
                </li>
                <li [ngClass]="{'active': routerLink === '/dashboard/aml', 'inactive': routerLink !== '/dashboard/aml'}">
                    <a #aml routerLink="/dashboard/aml">aml</a>
                </li>
                <li [ngClass]="{'active': routerLink === '/dashboard/dwgs', 'inactive': routerLink !== '/dashboard/dwgs'}">
                    <a #dwgs routerLink="/dashboard/dwgs">dwgs</a>
                </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>`
})

export class Dashboard {

    routerLink: string;
    @ViewChild('parts') parts: ElementRef;
    @ViewChild('aml') aml: ElementRef;
    @ViewChild('dwgs') dwgs: ElementRef;

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        private renderer: Renderer
        ) {
            store.subscribe(() => {
                let ms = getMenuState(store.getState());
                this.routerLink = ms.currentMenu.path;
                this.renderer.invokeElementMethod(this[ms.currentMenu.id].nativeElement, 'focus');
            });
    }
}
