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

@NgModule({
    declarations: [LoginAndRegisterComponent],
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
