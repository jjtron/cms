import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardMain} from './DashboardMain';
import {Parts} from '../parts/Parts';
import {Aml} from '../aml/Aml';
import {Dwgs} from '../dwgs/Dwgs';
import {User} from '../user/User';
import { MaterialModule } from '@angular/material';

@NgModule({
    declarations: [
        DashboardMain,
        Parts,
        Aml,
        Dwgs,
        User
    ],
    imports: [
        RouterModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule.forRoot()
    ]
})
export class DashboardModule { }
