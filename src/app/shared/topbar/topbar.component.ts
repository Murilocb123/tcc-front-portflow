import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { AuthService } from '../../core/auth/auth.service';
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

    darkClass = "";

    constructor(private authService: AuthService) {
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
