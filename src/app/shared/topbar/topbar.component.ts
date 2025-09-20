import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../../core/entities/portfolio/portfolio.service';
import { PortfolioDTO } from '../../core/entities/portfolio/portfolio.dto';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { AuthService } from '../../core/auth/auth.service';
import { getTheme } from '../utils/theme.util';
import { ThemeUtils } from '@primeng/themes';

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
        this.portfolioService.listAll().subscribe((data: PortfolioDTO[]) => {
            this.portfolios = data;
            // Seleciona a principal ou mantém a selecionada
            const principal = data.find((p) => p.defaultPortfolio);
            if (principal) {
                this.selectedPortfolio = principal;
                this.setPortfolioSession(principal);
            } else if (this.selectedPortfolio) {
                this.setPortfolioSession(this.selectedPortfolio);
            }
        });
    }

    onPortfolioChange(event: any) {
        this.setPortfolioSession(event.value);
        // Recarrega a rota atual sem reload total
        this.router.navigate([this.router.url]);
    }

    setPortfolioSession(portfolio: PortfolioDTO) {
        sessionStorage.setItem('selectedPortfolio', JSON.stringify(portfolio));
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

    toggleTheme() {
    }

    logout() {
        this.authService.logout();
    }
}
