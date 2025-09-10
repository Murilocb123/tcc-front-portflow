import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAndRegisterComponent } from './features/login-and-register/login-and-register.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StrategyComponent } from './features/strategy/strategy.component';
import { AuthGuard } from './core/auth/auth-guard.service';
import { TransactionComponent } from './features/transaction/transaction.component';

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
        //canActivate: [AuthGuard], // protege todas as rotas filhas
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                component: DashboardComponent,
                title: 'Dashboard',
            },
            {
                path: 'strategy',
                component: StrategyComponent,
                title: 'Estratégia',
            },
            {
                path: 'transaction',
                component: TransactionComponent,
                title: 'Transações'
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
