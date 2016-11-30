import { LoginForm } from './components/login/LoginForm';
import { RegisterForm } from './components/login/RegisterForm';
import { Routes } from '@angular/router';
import { DashboardMain } from './components/dashboard/DashboardMain';
import { dashboardRoutes } from './components/dashboard/routes';

export const routes: Routes = [
    { path: '', component: LoginForm },
    { path: 'login', component: LoginForm },
    { path: 'register', component: RegisterForm },
    { path: 'dashboard', component: DashboardMain, children: dashboardRoutes }
];
