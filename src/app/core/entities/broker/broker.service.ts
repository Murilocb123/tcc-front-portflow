import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EntitiesService, HttpMethod } from '../entitie.service';
import { BrokerDTO } from './broker.dto';

@Injectable({
    providedIn: 'root',
})
export class BrokerService extends EntitiesService<BrokerDTO> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/broker', messageService, confirmationService);
    }

    listAll(): any {
        return this.executeRequest<BrokerDTO[]>(HttpMethod.GET, '/all');
    }
}
