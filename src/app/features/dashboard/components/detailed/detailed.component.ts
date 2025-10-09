import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import ptBrApex from 'apexcharts/dist/locales/pt-br.json';
import { ChartComponent, ChartType } from 'ng-apexcharts';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AssetService } from '../../../../core/entities/asset/asset.service';
import { LoadingPageService } from '../../../../shared/loading-page/loading-page.service';
import { AssetDTO } from '../../../../core/entities/asset/asset.dto';
import { DashboardService } from '../../../../core/entities/dashboard/dashboard.service';
import { ChartOptions } from '../../../../shared/model/chart-options';

@Component({
    selector: 'app-detailed',
    standalone: false,
    templateUrl: './detailed.component.html',
    styleUrl: './detailed.component.scss',
})
export class DetailedComponent implements OnInit, OnDestroy {
    filteredAtivos: any[] = [];
    ativoSelecionado: any;
    rentabilidadeAtivoOptions: ChartOptions = {
        series: [],
        chart: {
            locales: [ptBrApex],
            defaultLocale: 'pt-br',
            type: 'line' as ChartType,
            height: 350,
            toolbar: { show: true, tools: { zoom: false } },
            zoom: { enabled: true, autoScaleYaxis: true, type: 'x' },
        },
        xaxis: { type: 'datetime' },
        yaxis: {
            labels: {
                formatter: (value: number) =>
                    new Intl.NumberFormat('pt-BR', {
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value / 100),
            },
        },
        stroke: { show: true, curve: 'smooth', width: 3, colors: ['#088c4f'] },
        tooltip: {
            x: { format: 'dd/MM/yyyy' },
            y: {
                formatter: (
                    value: number,
                    { w, seriesIndex, dataPointIndex },
                ) => {
                    //path w.config.series.0.data.0.cumulativeValueGain
                    const point =
                        w.config.series[seriesIndex].data[dataPointIndex];

                    const cumulativeValueGainAsset =
                        point?.cumulativeValueGainAsset || '';
                    return `${new Intl.NumberFormat('pt-BR', {
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value / 100)} (${cumulativeValueGainAsset})`;
                },
            },
        },
        annotations: {
            yaxis: [
                {
                    y: 0,
                    borderColor: '#1DD65A',
                    strokeDashArray: 4,
                    label: {
                        style: { color: '#fff', background: '#1DD65A' },
                    },
                },
            ],
        },
        dataLabels: { enabled: false },
        markers: { size: 0 },
        title: { text: '' },
        fill: { type: 'solid' },
        colors: ['#088c4f'],
        toolbar: { show: true },
        options: {},
    };

    private unSubscribe$ = new Subject<void>();

    constructor(
        private assetService: AssetService,
        private loadingService: LoadingPageService,
        private dashboardService: DashboardService,
    ) {}

    ngOnInit(): void {
        this.initializeData();
    }

    ngOnDestroy(): void {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }

    initializeData(): void {
        this.initilizeAssetsAvailable();
    }

    initilizeAssetsAvailable(): void {
        this.loadingService.show();
        this.assetService
            .listAllAvailable()
            .pipe(
                takeUntil(this.unSubscribe$),
                finalize(() => this.loadingService.hide()),
            )
            .subscribe((ativos: AssetDTO[]) => {
                this.filteredAtivos = ativos.map((a) => ({
                    value: a.id,
                    ticker: a.ticker,
                    name: a.name,
                }));
                this.ativoSelecionado = this.filteredAtivos[0]?.value;
                this.onAtivoSelecionadoChange();
            });
    }

    onAtivoSelecionadoChange(): void {
        if (!this.ativoSelecionado) {
            this.rentabilidadeAtivoOptions.series = [];
            return;
        }
        this.loadingService.show();
        this.dashboardService
            .getPortfolioAssetDailyReturns(this.ativoSelecionado)
            .pipe(
                takeUntil(this.unSubscribe$),
                finalize(() => this.loadingService.hide()),
            )
            .subscribe((data) => {
                this.rentabilidadeAtivoOptions.series = [
                    {
                        name: 'Rentabilidade Diária',
                        data: data.map((item) => ({
                            x: new Date(item.priceDate).toISOString(),
                            y: item.cumulativeReturnPercentAsset,
                            cumulativeValueGainAsset: new Intl.NumberFormat(
                                'pt-BR',
                                { style: 'currency', currency: 'BRL' },
                            ).format(item.cumulativeValueGainAsset),
                        })),
                    },
                ];
            });
    }

    hasDailyReturn(): boolean {
        return this.rentabilidadeAtivoOptions.series?.some(
            (dataset: any) => dataset.data.length > 0,
        );
    }
}
