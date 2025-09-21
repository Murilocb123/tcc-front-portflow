import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export interface PageRequest {
    page: number;
    size: number;
    sort?: string;
    filter: { [key: string]: any };
}

@Injectable({
    providedIn: 'root',
})
export abstract class EntitiesService<T> {
    private readonly API_URL = environment.BACKEND_URL;
    constructor(
        protected httpClient: HttpClient,
        protected router: Router,
        protected readonly BASE_ROUTE: string,
        protected readonly messageService: MessageService,
        protected readonly confirmationService: ConfirmationService,
    ) {}

    create(data: T): any {
        return this.executeRequest<T>(HttpMethod.POST, '', data);
    }

    getById(id: string): any {
        return this.executeRequest<T>(HttpMethod.GET, `/${id}`);
    }

    update(id: string, data: T): any {
        return this.executeRequest<T>(HttpMethod.PUT, `/${id}`, data);
    }

    delete(id: string): any {
        return this.executeRequest<void>(HttpMethod.DELETE, `/${id}`);
    }

    list(params?: PageRequest): any {
        const page = params?.page || 0;
        const size = params?.size || 10;
        const sort = params?.sort;
        const filter = params?.filter || {};
        // Monta os parâmetros de query
        const queryParams: any = { page, size };
        if (sort) queryParams.sort = sort;
        // Adiciona cada campo do filtro como parâmetro individual
        Object.keys(filter).forEach((key) => {
            if (
                filter[key] !== undefined &&
                filter[key] !== null &&
                filter[key] !== ''
            ) {
                queryParams[key] = filter[key];
            }
        });
        return this.executeRequest<T[]>(
            HttpMethod.GET,
            '',
            undefined,
            queryParams,
        );
    }

    executeRequest<T = any>(
        method: HttpMethod,
        endpoint: string,
        body?: any,
        params?: any,
    ) {
        const url = `${this.API_URL}${this.BASE_ROUTE}${endpoint}`;
        let headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`,
        };
        if (sessionStorage.getItem('selectedPortfolio')) {
            headers['selectedPortfolio'] =
                sessionStorage.getItem('selectedPortfolio') || '';
        }
        const options: any = { headers };
        if (method === HttpMethod.GET && params) {
            options.params = params;
        } else if (body) {
            options.body = body;
        }
        return this.httpClient.request<T>(method, url, options).pipe(
            catchError((error) => {
                this.defaultCatchError(error);
                return throwError(() => error);
            }),
        );
    }

    private defaultCatchError(error: any) {
        if (error.status === 401 || error.status === 403) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Sessão expirada. Faça login novamente.',
            });
            this.confirmationService.confirm({
                header: 'Sessão Expirada',
                message: 'Você será redirecionado para a página de login.',
                accept: () => {
                    this.router.navigate(['/login']);
                    sessionStorage.clear();
                },
                acceptButtonProps: { label: 'OK' },
                closable: false,
                rejectVisible: false,
            });
        } else if (error.status === 400) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: error.error?.message || 'Requisição inválida.',
            });
        } else if (error.status === 404) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Recurso não encontrado.',
            });
        } else if (error.status === 500) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro no servidor. Tente novamente mais tarde.',
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
        }
        console.error('Erro na requisição HTTP:', error);
    }

    private getToken(): string | null {
        return sessionStorage.getItem('auth-token');
    }
}
