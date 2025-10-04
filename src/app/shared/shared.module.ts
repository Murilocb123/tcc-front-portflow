import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PanelModule } from 'primeng/panel';
import { PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PanelInfoComponent } from './panel-info/panel-info.component';
import { TopbarComponent } from './topbar/topbar.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PlotlyChartComponent } from './plottly/plotly.component';

@NgModule({
    declarations: [
        MainLayoutComponent,
        NavbarComponent,
        TopbarComponent,
        PanelInfoComponent,
        PlotlyChartComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        PopoverModule,
        OverlayBadgeModule,
        BadgeModule,
        AvatarModule,
        PanelModule,
        DividerModule,
        ConfirmDialogModule,
        ToastModule,
        ProgressSpinnerModule,
        FormsModule,
        SelectModule,
        DialogModule,
        FloatLabelModule,
        InputTextModule,
        CheckboxModule 
    ],
    exports: [MainLayoutComponent, PanelInfoComponent, PlotlyChartComponent],
})
export class SharedModule {}
