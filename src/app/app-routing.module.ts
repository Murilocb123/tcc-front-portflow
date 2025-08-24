import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAndRegisterComponent } from './features/login-and-register/login-and-register.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StrategyComponent } from './features/strategy/strategy.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginAndRegisterComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        //canActivateChild: [authGuard], // protege todas as rotas filhas
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'strategy',
                component: StrategyComponent,
            },
            // ... demais features
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
