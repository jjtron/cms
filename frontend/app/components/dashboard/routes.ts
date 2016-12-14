import {DashboardHome} from './DashboardHome';
import {Parts} from '../parts/Parts';
import {Aml} from '../aml/Aml';
import {Dwgs} from '../dwgs/Dwgs';
import {Routes} from '@angular/router';
import {User} from '../user/User';

export const dashboardRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: DashboardHome },
    { path: 'aml', component: Aml },
    { path: 'parts', component: Parts },
    { path: 'dwgs', component: Dwgs },
    { path: 'user', component: User }
];
