import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EntitiesService, HttpMethod } from '../entitie.service';
import { TransactionDto } from './transaction.dto';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends EntitiesService<TransactionDto> {
    constructor(
        http: HttpClient,
        router: Router,
        messageService: MessageService,
        confirmationService: ConfirmationService
    ) {
        super(http, router, '/api/transaction', messageService, confirmationService);
    }
}
