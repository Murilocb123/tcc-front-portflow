import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../core/entities/dashboard/dashboard.service';
import { OverviewDashboardDTO } from '../../core/entities/dashboard/dto/overview-dashboard.dto';
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

    ngOnInit(): void {
        this.loadingService.hide();
        this.initializeChartsOverview();
        this.configureChartOptions();
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

                // Format date labels for better readability
                const formattedDailyLabels = dailyReturns.map((item) => {
                    const date = new Date(item.priceDate);
                    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                });

                // Atualizando dados do gráfico de rentabilidade diária
                this.rentabilidadeDiariaChartData = {
                    datasets: [
                        {
                            label: 'Rentabilidade Diária',
                            data: dailyReturns.map((item) => {
                                const date = new Date(item.priceDate);
                                const realValue = new Intl.NumberFormat(
                                    'pt-BR',
                                    {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 2,
                                    },
                                ).format(item.cumulativeValueGain);
                                const cumulativeReturnPercentBR =
                                    item.cumulativeReturnPercent?.toLocaleString(
                                        'pt-BR',
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        },
                                    );
                                return {
                                    x: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                                    y: item.cumulativeReturnPercent,
                                    tooltip: `${cumulativeReturnPercentBR}%  (Valor: ${realValue})`,
                                };
                            }),

                            borderColor: '#088c4f',
                            backgroundColor: 'rgba(29, 214, 90, 0.2)',
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                };

                // Atualizando dados do gráfico de renda mensal
                this.rendaMensalChartData = {
                    datasets: [
                        {
                            label: 'Renda Mensal',
                            data: monthlyIncomes.map((item) => {
                                return {
                                    x: `${item.month}/${item.year}`,
                                    y: item.totalIncome,
                                    tooltip: new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 2,
                                    }).format(item.totalIncome),
                                };
                            }),
                            backgroundColor: 'rgba(102, 187, 106, 0.7)',
                            hoverBackgroundColor: '#66BB6A',
                            borderRadius: 10,
                        },
                    ],
                };
            });
    }

    private configureChartOptions(): void {
        // Opções do gráfico de rentabilidade diária
        this.rentabilidadeDiariaChartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = context.raw;
                            return ' ' + (value.tooltip || `${value.y}%`);
                        },
                    },
                },
            },
            scales: {
                x: {
                    display: false, // Hide the x-axis label
                    title: {},
                },
                y: {
                    display: true,
                    ticks: {
                        callback: (value: any) =>
                            value !== undefined
                                ? value.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  }) + '%'
                                : '',
                    },
                    title: {
                        text: 'Rentabilidade (%)',
                    },
                    afterBuildTicks: this.getAfterBuildTicksFunction(),
                },
            },
        };

        // Opções do gráfico de renda mensal
        this.rendaMensalChartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = context.raw;
                            return ' ' + (value.tooltip || '');
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Mês/Ano',
                    },
                },
                y: {
                    ticks: {
                        // Usando o Angular currency pipe via Intl API para formatação
                        callback: (value: any) =>
                            new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                            }).format(value),
                    },
                    afterBuildTicks: this.getAfterBuildTicksFunction(4),
                },
            },
        };
    }

    getAfterBuildTicksFunction(size: number = 5) {
        return (axis: any) => {
            const ticks = axis.ticks;
            if (ticks.length > size) {
                // Get 5 evenly spaced tick values
                const values = ticks
                    .map((t: any) => t.value)
                    .sort((a: number, b: number) => a - b);
                const step = (values.length - 1) / (size - 1);
                const selectedValues = Array.from(
                    { length: size },
                    (_, i) => values[Math.round(i * step)],
                );
                axis.ticks = ticks.filter((t: any) =>
                    selectedValues.includes(t.value),
                );
            }
        };
    }

    /** Função para verificar se há dados gerais disponíveis */
    hasGeralData(): boolean {
        return (
            this.rentabilidadeDiariaChartData?.datasets?.some(
                (dataset: any) => dataset.data.length > 0,
            ) &&
            this.rendaMensalChartData?.datasets?.some(
                (dataset: any) => dataset.data.length > 0,
            )
        );
    }
}
