import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, AuthGuard] 
})
export class CoreModule {}