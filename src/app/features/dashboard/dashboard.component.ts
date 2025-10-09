import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardService } from '../../core/entities/dashboard/dashboard.service';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';

@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    // ---------------- Alternância de visão (RF009.3) ----------------
    valueSelected: 'overview' | 'detailed' = 'overview';
    stateOptions = [
        { label: 'Visão geral', value: 'overview' },
        { label: 'Visão detalhada', value: 'detailed' },
    ];

    // =================================================================
    // =                           VISÃO GERAL                         =
    // =================================================================

    totalPortfolioValue: number = 0;
    totalReturnPercent: number = 0;
    totalIncomeValue: number = 0;

    rentabilidadeDiariaChartData: any;
    rentabilidadeDiariaChartOptions: any;

    rendaMensalChartData: any;
    rendaMensalChartOptions: any;

    private unSubscribe$ = new Subject<void>();

    constructor(
        private readonly loadingService: LoadingPageService,
        private readonly dashboardService: DashboardService,
    ) {}

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }
    onValueSelectedChange() {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 0);
    }
}
