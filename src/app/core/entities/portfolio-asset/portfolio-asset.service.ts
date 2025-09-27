import { Injectable } from '@angular/core';
import { EntitiesService } from '../entitie.service';
import { PortfolioAssetDTO } from './portfolio-asset.dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PortfolioAssetService extends EntitiesService<PortfolioAssetDTO> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/portfolio-assets', messageService, confirmationService);
    }
}
