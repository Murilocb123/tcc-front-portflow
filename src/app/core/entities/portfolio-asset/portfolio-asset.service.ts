import { Injectable } from '@angular/core';
import { EntitiesService, HttpMethod, PageRequest } from '../entitie.service';
import { PortfolioAssetDTO } from './portfolio-asset.dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StrategyDTO } from './strategy.dto';

@Injectable({
    providedIn: 'root',
})
export class PortfolioAssetService extends EntitiesService<PortfolioAssetDTO> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService,
    ) {
        super(
            http,
            router,
            '/api/portfolio-assets',
            messageService,
            confirmationService,
        );
    }

    listStrategies(params?: PageRequest): any {

        return this.executeRequest<StrategyDTO[]>(
            HttpMethod.GET,
            '/strategies',
            undefined,
            params  
        );
    }
}
