import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';

// Se estiver usando @types/plotly.js-dist-min, você pode tipar assim:
import type * as Plotly from 'plotly.js-dist-min';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';
import { DashboardService } from '../../core/entities/dashboard/dashboard.service';
import { PortfolioDailyReturnDTO } from '../../core/entities/dashboard/dto/portfolio-daily-return.dto';
import { OverviewDashboardDTO } from '../../core/entities/dashboard/dto/overview-dashboard.dto';

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
    /** Rentabilidade diária consolidada (RF009.1 / Visão geral) */
    rentabilidadeDiariaData: Partial<Plotly.PlotData>[] = [];
    get rentabilidadeDiariaLayout(): Partial<Plotly.Layout> {
        const ticketFormat = '.2f%';
        return this.baseLayout('', ticketFormat);
    }

    /** Renda mensal (RF009.1 / Visão geral) */
    rendaMensalData: Partial<Plotly.PlotData>[] = [];
    get rendaMensalLayout(): Partial<Plotly.Layout> {
        const ticketText = 'R$,.2f'; // Formato brasileiro com separador de milhar
        return this.baseLayout('', ticketText);
    }

    /** Mensagens quando não houver dados (RF009.2 / Visão geral) */
    hasGeralData = (): boolean =>
        !!(this.rentabilidadeDiariaData?.[0]?.y as number[] | undefined)
            ?.length &&
        !!(this.rendaMensalData?.[0]?.y as number[] | undefined)?.length;

    // =================================================================
    // =                         VISÃO DETALHADA                       =
    // =================================================================

    /** Watchlist: filtro de busca */
    watchFilter = '';

    /** Watchlist estilo TradingView (mock) */
    ativos = [
        { value: 'PETR4', name: 'Petrobras PN', last: 37.12, change: +1.24 },
        { value: 'VALE3', name: 'Vale ON', last: 67.8, change: -0.85 },
        {
            value: 'ITUB4',
            name: 'Itaú Unibanco PN',
            last: 31.42,
            change: +0.35,
        },
        { value: 'BBDC4', name: 'Bradesco PN', last: 13.25, change: -0.12 },
        {
            value: 'BBAS3',
            name: 'Banco do Brasil ON',
            last: 28.05,
            change: +0.78,
        },
    ];

    /** Lista filtrada da watchlist (campo de busca) */
    get filteredAtivos() {
        const f = (this.watchFilter || '').toLowerCase();
        if (!f) return this.ativos;
        return this.ativos.filter(
            (a) =>
                a.value.toLowerCase().includes(f) ||
                a.name.toLowerCase().includes(f),
        );
    }

    /** Ativo selecionado na visão detalhada */
    ativoSelecionado: string | null = 'PETR4';

    /** Séries de rentabilidade por ativo (mock) */
    private seriesAtivos: Record<string, Partial<Plotly.PlotData>[]> = {
        PETR4: [
            {
                x: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ],
                y: [
                    1, 1.2, 1.1, 1.3, 1.25, 1.35, 1.5, 1.55, 1.52, 1.6, 1.7,
                    1.68, 1.75, 1.8, 1.78, 1.85, 1.9, 1.95, 2.0, 2.05,
                ],
                type: 'scatter',
                mode: 'lines',
                name: 'PETR4',
            },
        ],
        VALE3: [
            {
                x: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ],
                y: [
                    0.8, 0.85, 0.9, 0.88, 0.92, 0.95, 1.0, 1.02, 1.05, 1.07,
                    1.1, 1.12, 1.15, 1.13, 1.18, 1.2, 1.22, 1.25, 1.27, 1.3,
                ],
                type: 'scatter',
                mode: 'lines',
                name: 'VALE3',
            },
        ],
        ITUB4: [
            {
                x: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ],
                y: [
                    0.5, 0.55, 0.6, 0.58, 0.62, 0.65, 0.7, 0.72, 0.73, 0.75,
                    0.78, 0.8, 0.82, 0.85, 0.87, 0.9, 0.92, 0.94, 0.96, 1.0,
                ],
                type: 'scatter',
                mode: 'lines',
                name: 'ITUB4',
            },
        ],
        BBDC4: [
            {
                x: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ],
                y: [
                    0.6, 0.61, 0.62, 0.63, 0.64, 0.66, 0.67, 0.69, 0.7, 0.71,
                    0.72, 0.73, 0.74, 0.75, 0.76, 0.78, 0.79, 0.8, 0.81, 0.82,
                ],
                type: 'scatter',
                mode: 'lines',
                name: 'BBDC4',
            },
        ],
        BBAS3: [
            {
                x: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ],
                y: [
                    0.9, 0.92, 0.93, 0.95, 0.96, 0.98, 1.0, 1.01, 1.03, 1.05,
                    1.06, 1.08, 1.09, 1.11, 1.12, 1.14, 1.15, 1.17, 1.18, 1.2,
                ],
                type: 'scatter',
                mode: 'lines',
                name: 'BBAS3',
            },
        ],
    };

    /** Gráfico: Rentabilidade por ativo (RF009.1 / Visão detalhada) */
    get rentPorAtivoData(): Partial<Plotly.PlotData>[] {
        return this.ativoSelecionado
            ? (this.seriesAtivos[this.ativoSelecionado] ?? [])
            : [];
    }
    rentPorAtivoLayout: Partial<Plotly.Layout> = this.baseLayout(
        'Rentabilidade por ativo',
    );

    /** Gráfico: Previsão por ativo com intervalo de confiança (RF009.1 / Visão detalhada) */
    get forecastData(): Partial<Plotly.PlotData>[] {
        if (!this.ativoSelecionado) return [];
        const x = Array.from({ length: 10 }, (_, i) => i + 21); // próximos 10 dias
        const base =
            this.ativoSelecionado === 'PETR4'
                ? 2.05
                : this.ativoSelecionado === 'VALE3'
                  ? 1.3
                  : this.ativoSelecionado === 'ITUB4'
                    ? 1.0
                    : this.ativoSelecionado === 'BBDC4'
                      ? 0.82
                      : 1.2;

        const mean = x.map((_, i) => base + i * 0.03);
        const low = mean.map((v) => v - 0.06);
        const high = mean.map((v) => v + 0.06);

        return [
            {
                x,
                y: low,
                type: 'scatter',
                mode: 'lines',
                line: { width: 0 },
                showlegend: false,
                name: 'IC baixo',
            },
            {
                x,
                y: high,
                type: 'scatter',
                mode: 'lines',
                fill: 'tonexty',
                line: { width: 0 },
                showlegend: false,
                name: 'IC alto',
            },
            {
                x,
                y: mean,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Média prevista',
            },
        ];
    }
    forecastLayout: Partial<Plotly.Layout> = this.baseLayout(
        'Previsão por ativo (IC)',
    );

    private unSubscribe$ = new Subject<void>();
    /** Mensagens quando não houver dados (RF009.2 / Visão detalhada) */
    hasDetalheData = (): boolean =>
        !!this.ativoSelecionado &&
        (this.seriesAtivos[this.ativoSelecionado]?.length ?? 0) > 0;

    /** Ao trocar o ativo na watchlist */
    onAssetChange(symbol: string) {
        this.ativoSelecionado = symbol;
        // Aqui você pode colocar telemetria, refresh de dados do back, etc.
    }

    constructor(
        private readonly loadingService: LoadingPageService,
        private readonly dashboardService: DashboardService,
    ) {}

    ngOnInit(): void {
        this.loadingService.hide();
        this.fetchRentabilidadeDiaria();
    }
    ngOnDestroy(): void {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }

    private fetchRentabilidadeDiaria(): void {
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
                if (dailyReturns.length > 0) {
                    this.rentabilidadeDiariaData = [
                        {
                            x: dailyReturns.map((item) => item.priceDate),
                            y: dailyReturns.map((item) => item.cumulativeReturnPercent),
                            customdata: dailyReturns.map(
                                (item) => item.cumulativeValueGain,
                            ),
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: '',
                            hovertemplate:
                                '<b>Data:</b> %{x}<br>' +
                                '<b>Rentabilidade:</b> %{y:.2f}%<br>' +
                                '<b>Valor acumulado:</b> R$%{customdata:.2f}',
                        },
                    ];
                } else {
                    console.warn('Nenhum dado válido foi retornado da API.');
                    this.rentabilidadeDiariaData = [];
                }
                if (monthlyIncomes.length > 0) {
                    this.rendaMensalData = [
                        {
                            x: monthlyIncomes.map((item) => `${item.month}/${item.year}`),
                            y: monthlyIncomes.map((item) => item.totalIncome),
                            type: 'bar',
                            name: '',
                            marker: { color: '#4caf50' },
                            hovertemplate:
                                '<b>Mês/Ano:</b> %{x}<br>' +
                                '<b>Renda:</b> R$%{y:,.2f}', // Formato brasileiro com separador de milhar
                        },
                    ];
                } else {
                    console.warn('Nenhum dado válido foi retornado da API.');
                    this.rendaMensalData = [];
                }

            });
    }

    /**
     * Layout base para todos os gráficos (pan only + estética clean)
     * Observação: permitir apenas mover = 'dragmode: pan'
     * Evite usar fixedrange nos eixos, pois isso bloquearia o pan.
     */
    private baseLayout(title: string, ticketFormat: string =""): Partial<Plotly.Layout> {
        return {
            title: {
                text: title,
                font: {
                    size: 22,
                    family: 'Segoe UI, sans-serif',
                    color: '#333',
                },
            },
            margin: { t: 50, r: 30, b: 50, l: 60 },
            dragmode: 'pan', // pan only
            hovermode: 'closest',
            plot_bgcolor: '#f8f9fa',
            paper_bgcolor: '#ffffff',
            font: { family: 'Segoe UI, sans-serif', color: '#444' },
            xaxis: {
                gridcolor: '#e0e0e0',
                zeroline: false,
                linecolor: '#888',
                tickfont: { size: 13 },
                tickformat: '%d/%m/%Y', // Formato de data brasileiro
            },
            yaxis: {
                gridcolor: '#e0e0e0',
                zeroline: false,
                linecolor: '#888',
                tickfont: { size: 13 },
                tickformat: ticketFormat,
            },
        };
    }
}
