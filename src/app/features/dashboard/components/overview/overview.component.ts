import { Component, OnDestroy, OnInit } from '@angular/core';
import ptBrApex from 'apexcharts/dist/locales/pt-br.json';
import { ChartType } from 'ng-apexcharts';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../../core/entities/dashboard/dashboard.service';
import { OverviewDashboardDTO } from '../../../../core/entities/dashboard/dto/overview-dashboard.dto';
import { LoadingPageService } from '../../../../shared/loading-page/loading-page.service';
import { ChartOptions } from '../../../../shared/model/chart-options';

@Component({
    selector: 'app-overview',
    standalone: false,
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, OnDestroy {
    totalPortfolioValue: number = 0;
    totalReturnPercent: number = 0;
    totalIncomeValue: number = 0;

    rentabilidadeDiariaOptions: ChartOptions = {
        series: [],
        chart: {
            locales: [ptBrApex],
            defaultLocale: 'pt-br',
            type: 'line' as ChartType,
            height: 350,
            toolbar: { show: true, tools: { zoom: false } },
            zoom: { enabled: true, autoScaleYaxis: true, type: 'x' },
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            labels: {
                formatter: (value: number) =>
                    new Intl.NumberFormat('pt-BR', {
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value / 100),
                style: {
                    //  colors: ['#088c4f'],
                },
            },
        },
        stroke: {
            show: true,
            curve: 'smooth',
            width: 3,
            colors: ['#088c4f'],
        },
        tooltip: {
            x: { format: 'dd/MM/yyyy' },
            y:{
                formatter: (value: number, { w , seriesIndex, dataPointIndex}) => {
                    //path w.config.series.0.data.0.cumulativeValueGain
                    const point = w.config.series[seriesIndex].data[dataPointIndex];

                    const cumulativeValueGain = point?.cumulativeValueGain || '';
                    return `${new Intl.NumberFormat('pt-BR', {
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value / 100)} (${cumulativeValueGain})`;
                }
            }
        },
        annotations: {
            yaxis: [
                {
                    y: 0,
                    borderColor: '#1DD65A',
                    strokeDashArray: 4,
                    label: {
                        style: {
                            color: '#fff',
                            background: '#1DD65A',
                        },
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

    rendaMensalOptions: ChartOptions = {
        series: [],
        chart: {
            locales: [ptBrApex],
            defaultLocale: 'pt-br',
            type: 'bar' as ChartType,
            height: 350,
            toolbar: { show: true, tools: { zoom: false } },
        },
        xaxis: {
            type: 'category',
            labels: {
                format: 'MMM/yyyy',
            },
        },
        yaxis: {
            labels: {
                formatter: (value: number) => {
                    return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(value);
                },
            },
        },
        stroke: {
            show: false,
            width: 2,
            colors: ['#088c4f'],
        },
        tooltip: {
            x: { format: 'MMM/yyyy' },
        },
        annotations: {},
        dataLabels: {
            enabled: true,
            formatter: (val: number) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(val);
            },
        },
        markers: { size: 0 },
        title: { text: '' },
        fill: { type: 'solid' },
        colors: ['#088c4f'],
        toolbar: { show: false },
        options: {
            bar: { borderRadius: 4, borderRadiusApplication: 'end' },
        },
    };

    private unSubscribe$ = new Subject<void>();

    constructor(
        private readonly loadingService: LoadingPageService,
        private readonly dashboardService: DashboardService,
    ) {
        console.log(ptBrApex);
    }

    ngOnInit(): void {
        this.initializeChartsOverview();
    }
    ngOnDestroy(): void {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }

    private initializeChartsOverview(): void {
        this.loadingService.show();
        this.dashboardService
            .getDashboardOverview()
            .pipe(
                takeUntil(this.unSubscribe$),
                finalize(() => this.loadingService.hide()),
                catchError((error: any) => {
                    console.error(
                        'Erro ao buscar rentabilidade diária:',
                        error,
                    );
                    return [];
                }),
            )
            .subscribe((data: OverviewDashboardDTO | null) => {
                this.totalPortfolioValue = data?.totalPortfolioValue || 0;
                this.totalReturnPercent = data?.totalReturnPercent || 0;
                this.totalIncomeValue = data?.totalIncomeValue || 0;

                const dailyReturns = data?.dailyReturns || [];
                const monthlyIncomes = data?.monthlyIncomes || [];

                this.rentabilidadeDiariaOptions.series = [
                    {
                        name: 'Rentabilidade Diária',
                        data: dailyReturns.map((item) => ({
                            x: new Date(item.priceDate).toISOString(),
                            y: item.cumulativeReturnPercent,
                            cumulativeValueGain: new Intl.NumberFormat(
                                'pt-BR',
                                { style: 'currency', currency: 'BRL' },
                            ).format(item.cumulativeValueGain),
                        })),
                    },
                ];
                // Atualiza xaxis se necessário
                // Atualiza yaxis se necessário

                // Agrupa por mês/ano e soma os valores
                const rendaPorMes: { [key: string]: number } = {};
                monthlyIncomes.forEach((item) => {
                    // Cria uma data para formatar o mês por extenso
                    const date = new Date(item.year, item.month - 1, 1);
                    const key = `${date.toLocaleString('pt-BR', { month: 'short' })} ${item.year}`;
                    rendaPorMes[key] =
                        (rendaPorMes[key] || 0) + item.totalIncome;
                });
                const categorias = Object.keys(rendaPorMes);
                const valores = Object.values(rendaPorMes);
                this.rendaMensalOptions.series = [
                    {
                        name: 'Renda Mensal',
                        data: valores,
                    },
                ];
                this.rendaMensalOptions.xaxis.categories = categorias;
            });
    }

    // Removido método configureChartOptions e referências antigas

    /** Função para verificar se há dados gerais disponíveis */
    hasGeralData(): boolean {
        return (
            this.rentabilidadeDiariaOptions.series?.some(
                (dataset: any) => dataset.data.length > 0,
            ) &&
            this.rendaMensalOptions.series?.some(
                (dataset: any) => dataset.data.length > 0,
            )
        );
    }
}
