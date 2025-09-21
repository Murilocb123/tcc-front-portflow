import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EntitiesService, HttpMethod } from '../entitie.service';
import { EventDto } from './event.dto';

@Injectable({
    providedIn: 'root',
})
export class EventService extends EntitiesService<EventDto> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/event', messageService, confirmationService);
    }

}
