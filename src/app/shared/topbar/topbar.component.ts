import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { finalize, skip } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { PortfolioDTO } from '../../core/entities/portfolio/portfolio.dto';
import { PortfolioService } from '../../core/entities/portfolio/portfolio.service';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { getTheme } from '../utils/theme.util';

type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
};

@Component({
    selector: 'app-topbar',
    standalone: false,
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    portfolios: PortfolioDTO[] = [];
    selectedPortfolio?: PortfolioDTO;
    showPortfolioDialog = false;

    @ViewChild('popover')
    notificationPanel!: Popover;
    @ViewChild('notificationButton')
    notificationButton!: Button;
    @ViewChild('userPopover')
    userPopover!: Popover;

    notifications: Notification[] = [
        {
            id: 1,
            title: 'Nova mensagem',
            message: 'Você tem uma nova mensagem de João.',
            read: false,
        },
        {
            id: 2,
            title: 'Atualização do sistema',
            message: 'O sistema foi atualizado com sucesso.',
            read: true,
        },
        {
            id: 3,
            title: 'Lembrete de reunião',
            message: 'Sua reunião com a equipe começa em 30 minutos.',
            read: false,
        },
    ];

    darkClass = '';

    constructor(
        private authService: AuthService,
        private portfolioService: PortfolioService,
        private router: Router,
        private loadingPageService: LoadingPageService,
    ) {
        // Simulação de recebimento de notificações
    }

    get username(): string {
        return sessionStorage.getItem('username') || 'Nome não disponível';
    }

    ngOnInit(): void {
        const colorScheme = getTheme();
        if (colorScheme === 'dark') {
            this.darkClass = 'dark-mode';
        }
        this.loadPortfolios();
    }

    loadPortfolios() {
        this.loadingPageService.show();
        this.portfolioService
            .listAll()
            .pipe(finalize(() => this.loadingPageService.hide()))
            .subscribe((data: PortfolioDTO[]) => {
                this.portfolios = data;
                const lastSelected = this.getLastSelectedPortfolio();
                this.selectedPortfolio =
                    data.find((p) => p.id === lastSelected?.id) ||
                    data.find((p) => p.defaultPortfolio) ||
                    undefined;
                if (this.selectedPortfolio) {
                    this.setPortfolioSession(this.selectedPortfolio);
                }
            });
    }

    onPortfolioChange(event: any) {
        this.setPortfolioSession(event.value);

        this.loadingPageService.triggerReloadChild();
    }

    setPortfolioSession(portfolio: PortfolioDTO) {
        sessionStorage.setItem('selectedPortfolio', portfolio.id || '');
        localStorage.setItem(
            'lastSelectedPortfolio',
            JSON.stringify(portfolio),
        );
    }

    getLastSelectedPortfolio(): PortfolioDTO | null | undefined {
        const stored = localStorage.getItem('lastSelectedPortfolio');
        return stored ? JSON.parse(stored) : null;
    }

    showAddPortfolioDialog() {
        this.showPortfolioDialog = true;
    }

    onPortfolioAdded() {
        this.showPortfolioDialog = false;
        this.loadPortfolios();
    }

    addPortfolio(form: any) {
        if (form.valid) {
            const newPortfolio: PortfolioDTO = {
                id: '', // id será gerado pelo backend
                name: form.value.name,
                defaultPortfolio: false,
            };
            this.portfolioService.create(newPortfolio).subscribe(() => {
                this.onPortfolioAdded();
            });
        }
    }

    openNotificationPanel(event: MouseEvent) {
        this.notificationPanel.toggle(event);
    }

    toggleUserPopover(event: MouseEvent) {
        this.userPopover.toggle(event);
    }

    toggleTheme() {}

    logout() {
        this.authService.logout();
    }
}
