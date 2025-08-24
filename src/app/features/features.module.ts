import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAndRegisterComponent } from './login-and-register/login-and-register.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StrategyComponent } from './strategy/strategy.component';

@NgModule({
    declarations: [LoginAndRegisterComponent, DashboardComponent, StrategyComponent],
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
    ],
})
export class FeaturesModule {}
