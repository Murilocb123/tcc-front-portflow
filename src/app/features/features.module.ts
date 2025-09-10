import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginAndRegisterComponent } from './login-and-register/login-and-register.component';
import { StrategyComponent } from './strategy/strategy.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    declarations: [LoginAndRegisterComponent, DashboardComponent, StrategyComponent, TransactionComponent],
    imports: [
        CommonModule,
        ButtonModule,
        PanelModule,
        FloatLabelModule,
        PasswordModule,
        InputTextModule,
        ReactiveFormsModule,
        MessagesModule,
        MessageModule,
        TabsModule,
        RouterModule,
        CardModule,
        SharedModule,
        ToastModule,
        TableModule,
        DialogModule
    ],
    providers: [MessageService
],
})
export class FeaturesModule {}
