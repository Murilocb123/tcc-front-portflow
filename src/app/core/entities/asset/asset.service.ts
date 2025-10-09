import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntitiesService, HttpMethod } from '../entitie.service';
import { AssetDTO } from './asset.dto';

@Injectable({
    providedIn: 'root',
})
export class AssetService extends EntitiesService<AssetDTO> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/assets', messageService, confirmationService);
    }
    
    listAll(): any {
        return this.executeRequest<AssetDTO[]>(HttpMethod.GET, '/all');
    }
    
    listAllAvailable(): any {
        return this.executeRequest<AssetDTO[]>(HttpMethod.GET, '/available');
    }

}
