// src/app/services/plotly.service.ts
import { Injectable } from '@angular/core';
// importa o dist minificado, mas com typings vindos do @types
import Plotly from 'plotly.js-dist-min';

@Injectable({ providedIn: 'root' })
export class PlotlyService {
  get plotly() {
    return Plotly;
  }
}
