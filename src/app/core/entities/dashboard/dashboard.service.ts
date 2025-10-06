import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { EntitiesService, HttpMethod, PageRequest } from '../entitie.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PortfolioDailyReturnDTO } from './dto/portfolio-daily-return.dto';
import { OverviewDashboardDTO } from './dto/overview-dashboard.dto';

@Injectable({
    providedIn: 'root',
})
export class DashboardService extends EntitiesService<any> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService,
    ) {
        super(
            http,
            router,
            '/api/dashboard',
            messageService,
            confirmationService,
        );
    }

    getPortfolioDailyReturns(): Observable<PortfolioDailyReturnDTO[]> {
        return this.executeRequest<PortfolioDailyReturnDTO[]>(
            HttpMethod.GET,
            '/portfolio-daily-returns',
        ).pipe(
            map((event: any) =>
            (event as PortfolioDailyReturnDTO[]).map(item => ({
                ...item,
                cumulativeReturnPercent: item.cumulativeReturnPercent >= 0
                    ? Math.ceil(item.cumulativeReturnPercent * 100) / 100
                    : Math.floor(item.cumulativeReturnPercent * 100) / 100,
            }))
            ),
        );
    }

    getDashboardOverview(): Observable<OverviewDashboardDTO> {
        return this.executeRequest<OverviewDashboardDTO>(
            HttpMethod.GET,
            '/overview',
        ).pipe(
            map((event: any) => event as OverviewDashboardDTO),
            tap((data: OverviewDashboardDTO) => {
                data.totalReturnPercent = data.totalReturnPercent >= 0
                    ? Math.ceil(data.totalReturnPercent * 100) / 100
                    : Math.floor(data.totalReturnPercent * 100) / 100;
                if (Array.isArray(data.dailyReturns)) {
                    data.dailyReturns = data.dailyReturns.map(ret => ({
                        ...ret,
                        cumulativeReturnPercent: ret.cumulativeReturnPercent >= 0
                            ? Math.ceil(ret.cumulativeReturnPercent * 100) / 100
                            : Math.floor(ret.cumulativeReturnPercent * 100) / 100
                    }));
                }
            })
        );
    }

    /**
     * Sobrescreve os métodos herdados para evitar pois nao devem ser usados
     *
     * @param data
     */
    override create(data: any): any {
        throw new Error('Method not implemented.');
    }

    override getById(id: string): any {
        throw new Error('Method not implemented.');
    }

    override update(id: string, data: any): any {
        throw new Error('Method not implemented.');
    }

    override delete(id: string): any {
        throw new Error('Method not implemented.');
    }

    override list(params?: PageRequest): any {
        throw new Error('Method not implemented.');
    }
}
