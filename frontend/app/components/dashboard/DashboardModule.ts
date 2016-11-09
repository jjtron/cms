import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Dashboard} from './Dashboard';
import {Parts} from '../parts/Parts';
import {Aml} from '../aml/Aml';
import {Dwgs} from '../dwgs/Dwgs';

@NgModule({
    declarations: [
        Dashboard,
        Parts,
        Aml,
        Dwgs
    ],
    imports: [
        RouterModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DashboardModule { }
