import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, AuthGuard] // Aqui você registra o serviço, mas se usar providedIn: 'root', isso é desnecessário
})
export class CoreModule {}