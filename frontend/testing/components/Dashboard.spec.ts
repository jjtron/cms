import { Component } from '@angular/core';
import { TestBed, fakeAsync, inject, tick, async } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DashboardMain } from '../../app/components/dashboard/DashboardMain';
import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AppStore } from '../../app/app-store';
import { AppState, default as reducer} from '../../app/reducers';
import { createStore, Store } from 'redux';
import {Menu} from '../../app/models';
import {MenuActions} from '../../app/actions';
import {BASEPATH} from '../../app/components/dashboard/config';

let store: Store<AppState> = createStore<AppState>(
  reducer
);

@Component({
    selector: 'root-cmp',
    template: `<router-outlet></router-outlet>`
})
export class RootCmp {
}

export const routes: Routes = [
    { path: 'login', component: RootCmp },
];

describe('DashboardMain', () => {
    
    let fixture: any;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot(routes)
            ],
            declarations: [
                DashboardMain,
                RootCmp
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: AppStore, useFactory: () => store },
                { provide: BASEPATH, useValue: '/dashboard/' }
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(DashboardMain);
        });
    }));

    describe('Menu action', () => {
        it('should make one active other inactive', () => {
            let currentMenu: Menu = {id: 'aml', path: '/dashboard/aml', access: true};
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
            fixture.detectChanges();
            
            let itema = fixture.debugElement.query(By.css("li[class='active'] a")).nativeElement;
            let itemb = fixture.debugElement.query(By.css("li[class='inactive'] a")).nativeElement;
            expect(itema.innerHTML).toContain('aml');
            expect(itemb.innerHTML).not.toContain('aml');
        });
    });
});
