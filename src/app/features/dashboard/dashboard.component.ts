import { Component, OnInit } from '@angular/core';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

      tabs = [
        { route: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
        { route: 'transactions', label: 'Transactions', icon: 'pi pi-chart-line' },
        { route: 'products', label: 'Products', icon: 'pi pi-list' },
        { route: 'messages', label: 'Messages', icon: 'pi pi-inbox' }
    ];

    constructor(private loadingService: LoadingPageService) {}


    ngOnInit(): void {
    this.loadingService.hide();
    }

}
