import {Parts} from '../parts/Parts';
import {Aml} from '../aml/Aml';
import {Dwgs} from '../dwgs/Dwgs';
import {Routes} from '@angular/router';

export const dashboardRoutes: Routes = [
    { path: '', redirectTo: 'aml' },
    { path: 'aml', component: Aml },
    { path: 'parts', component: Parts },
    { path: 'dwgs', component: Dwgs }
];
