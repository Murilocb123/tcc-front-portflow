import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
      MainLayoutComponent,
      NavbarComponent,
      TopbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        PopoverModule,
        OverlayBadgeModule,
        BadgeModule,
        AvatarModule,
    ],
    exports: [
      MainLayoutComponent
    ]
})
export class SharedModule {}
