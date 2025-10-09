import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, Observable, tap } from 'rxjs';
import { EntitiesService, HttpMethod, PageRequest } from '../entitie.service';
import { OverviewDashboardDTO } from './dto/overview-dashboard.dto';
import { PortfolioAssetDailyReturnDTO } from './dto/portfolio-asset-daily-return.dto';

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

    getPortfolioAssetDailyReturns(idAsset:string): Observable<PortfolioAssetDailyReturnDTO[]> {
        return this.executeRequest<PortfolioAssetDailyReturnDTO[]>(
            HttpMethod.GET,
            '/portfolio-asset-daily-returns/'+ idAsset,
        ).pipe(
            map((event: any) =>
                (event as PortfolioAssetDailyReturnDTO[]).map((item) => ({
                    ...item,
                    cumulativeReturnPercentAsset:
                        item.cumulativeReturnPercentAsset >= 0
                            ? Math.ceil(item.cumulativeReturnPercentAsset * 100) /
                              100
                            : Math.floor(item.cumulativeReturnPercentAsset * 100) /
                              100,
                })),
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
                data.totalReturnPercent =
                    data.totalReturnPercent >= 0
                        ? Math.ceil(data.totalReturnPercent * 100) / 100
                        : Math.floor(data.totalReturnPercent * 100) / 100;
                if (Array.isArray(data.dailyReturns)) {
                    data.dailyReturns = data.dailyReturns.map((ret) => ({
                        ...ret,
                        cumulativeReturnPercent:
                            ret.cumulativeReturnPercent >= 0
                                ? Math.ceil(ret.cumulativeReturnPercent * 100) /
                                  100
                                : Math.floor(
                                      ret.cumulativeReturnPercent * 100,
                                  ) / 100,
                    }));
                }
            }),
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
