import { inject, fakeAsync, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { advance, createRoot, RootCmp, configureAppTests, BlankCmp } from '../helpers/AppTestsHelper';
import { FormGroup, FormControl } from '@angular/forms';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../app/redux_barrel';

describe('Dashboard routes', () => {
    beforeEach(async(() => {
        configureAppTests();
    }));

    describe('On route to Aml', () => {
        it('runs constructor', fakeAsync(
          inject([Router, Location],
                 (router: Router,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);

            router.navigateByUrl('aml');
            advance(fixture);
            expect(location.path()).toEqual('/aml');

            let component: any = fixture.debugElement.children[1].componentInstance;
            let appState: AppState = component.getState();
            let id: string = appState.menu.currentMenu.id;
            let path: string = appState.menu.currentMenu.path;
            expect(id).toEqual('aml');
            expect(path).toEqual('/dashboard/aml');
          })));
    });

    describe('On route to Parts', () => {
        it('runs constructor', fakeAsync(
          inject([Router, Location],
                 (router: Router,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);

            router.navigateByUrl('parts');
            advance(fixture);
            expect(location.path()).toEqual('/parts');

            let component: any = fixture.debugElement.children[1].componentInstance;
            let appState: AppState = component.getState();
            let id: string = appState.menu.currentMenu.id;
            let path: string = appState.menu.currentMenu.path;
            expect(id).toEqual('parts');
            expect(path).toEqual('/dashboard/parts');
          })));
    });

    describe('On route to Dwgs', () => {
        it('runs constructor', fakeAsync(
          inject([Router, Location],
                 (router: Router,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);

            router.navigateByUrl('dwgs');
            advance(fixture);
            expect(location.path()).toEqual('/dwgs');

            let component: any = fixture.debugElement.children[1].componentInstance;
            let appState: AppState = component.getState();
            let id: string = appState.menu.currentMenu.id;
            let path: string = appState.menu.currentMenu.path;
            expect(id).toEqual('dwgs');
            expect(path).toEqual('/dashboard/dwgs');
          })));
    });
});