import { inject, fakeAsync, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { advance, createRoot, RootCmp, configureAppTests, BlankCmp } from '../helpers/AppTestsHelper';
import { FormGroup, FormControl } from '@angular/forms';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../app/redux_barrel';
import { DataServiceMock } from '../mocks/DataServiceMock';
import { tick } from '@angular/core/testing';

describe('DashboardMain routes', () => {
    beforeEach(async(() => {
        localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjEyMyIsInBhc3N3b3JkIjoiMTIzIiwicGVybWlzc2lvbnMiOnsiYW1sIjoiZWRpdG9yIiwiZHdncyI6ImVkaXRvciIsInBhcnRzIjoiZWRpdG9yIiwiYWRtaW4iOiJ0cnVlIiwiaG9tZSI6InRydWUifSwiaWF0IjoxNDgwODA5MTQ5fQ.OEGk8XjOpRcofrLF2vJIqufTrCc4u6dNm0JIbUe5pvU');
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
                  location: Location,
                  ds: DataServiceMock) => {
            const fixture = createRoot(router, RootCmp);

            router.navigateByUrl('parts');
            advance(fixture);
            expect(location.path()).toEqual('/parts');

            // this gets over the .debounceTime(400) in the ngOnInit() method
            tick(400);
            tick(400);

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