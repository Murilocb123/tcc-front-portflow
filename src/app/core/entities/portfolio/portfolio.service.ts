import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EntitiesService, HttpMethod } from '../entitie.service';
import { PortfolioDTO } from './portfolio.dto';

@Injectable({
    providedIn: 'root',
})
export class PortfolioService extends EntitiesService<PortfolioDTO> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/portfolio', messageService, confirmationService);
    }

    listAll(): any {
        return this.executeRequest<PortfolioDTO[]>(HttpMethod.GET, '/all');
    }
}
