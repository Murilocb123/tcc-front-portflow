// src/app/shared/plotly-chart/plotly-chart.component.ts
import { Component, ElementRef, Input, Signal, signal, effect, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { PlotlyService } from './plotly.service';

@Component({
  selector: 'app-plotly-chart',
  standalone: false,
  template: `<div #chart class="plotly-host"></div>`,
  styles: [`
    :host { display: block; width: 100%; height: 420px; }
    .plotly-host { width: 100%; height: 100%; }
    /* modo escuro opcional */
    :host-context(.dark) .plotly-host { background: transparent; }
  `]
})
export class PlotlyChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: true }) chartEl!: ElementRef<HTMLDivElement>;

  // API reativa (moderna): passe dados e layout como Inputs
  private _dataSignal = signal<Partial<Plotly.PlotData>[]>([]);
  private _layoutSignal = signal<Partial<Plotly.Layout>>({});

  @Input() set data(v: Partial<Plotly.PlotData>[] | null) { this._dataSignal.set(v ?? []); }
  @Input() set layout(v: Partial<Plotly.Layout> | null)    { this._layoutSignal.set(v ?? {}); }

  private ro?: ResizeObserver;
  private plotted = false;

  constructor(private plotlySvc: PlotlyService) {
    // Re-render leve quando data/layout mudarem (após 1º plot)
    effect(async () => {
      if (!this.plotted) return;
      const Plotly = this.plotlySvc.plotly;
      await Plotly.react(
        this.chartEl.nativeElement,
        this._dataSignal(),
        this.mergeLayout(this._layoutSignal()),
        this.panOnlyConfig()
      );
    });
  }

  async ngAfterViewInit() {
    const Plotly = this.plotlySvc.plotly;

    await Plotly.newPlot(
      this.chartEl.nativeElement,
      this._dataSignal(),
      this.mergeLayout(this._layoutSignal()),
      this.panOnlyConfig()
    );
    this.plotted = true;

    // Responsivo com ResizeObserver
    this.ro = new ResizeObserver(() => {
      Plotly.Plots.resize(this.chartEl.nativeElement);
    });
    this.ro.observe(this.chartEl.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }

  /** Layout base “clean”, pronto para dark/light */
  private mergeLayout(user: Partial<Plotly.Layout>): Partial<Plotly.Layout> {
    const base: Partial<Plotly.Layout> = {
      margin: { t: 40, r: 20, b: 40, l: 50 },
      title: { text: user?.title as any ?? '' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12 },
      // dica: NÃO usar fixedrange aqui, pois isso também bloqueia pan.
      // xaxis: { fixedrange: true }, yaxis: { fixedrange: true }
    };
    return { ...base, ...user };
  }

  /** Config para permitir somente pan (mover) */
  private panOnlyConfig(): Partial<Plotly.Config> {
    return {
      responsive: true,
      displaylogo: false,
      scrollZoom: false,     // sem zoom por scroll
      doubleClick: false,    // desativa reset/zoom por double-click
      // deixa só o pan na modebar:
      modeBarButtonsToRemove: [
        'zoom2d','zoomIn2d','zoomOut2d','autoScale2d','resetScale2d',
        'select2d','lasso2d','zoom3d','pan3d','orbitRotation','tableRotation',
        'hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines','toImage'
      ],
      // drag inicial já em pan
      // (alternativamente use no layout: { dragmode: 'pan' })
    } as Partial<Plotly.Config>;
  }
}
