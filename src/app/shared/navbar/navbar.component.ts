import { Component, effect, OnInit, signal } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

type NavItem = {
    label: string;
    route: string;
    icon: string;
    exact?: boolean;
    position: 'top' | 'bottom';
};

@Component({
    selector: 'app-navbar',
    standalone: false,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
    // estado (persistido em localStorage)
    collapsed = signal<boolean>(true);

    // exemplo de rotas (substitua pelas suas)
    items: NavItem[] = [
        {
            label: 'Dashboard',
            route: '/dashboard',
            exact: true,
            icon: PrimeIcons.HOME,
            position: 'top',
        },
        {
            label: 'Estratégia',
            route: '/strategy',
            icon: PrimeIcons.CHART_BAR,
            position: 'top',
        },
        {
            label: 'Transações',
            route: '/transaction',
            icon: PrimeIcons.ARROW_RIGHT_ARROW_LEFT,
            position: 'top',
        },
        {
            label: 'Eventos',
            route: '/events',
            icon: PrimeIcons.CALENDAR,
            position: 'top',
        },
        {
            label: 'Configurações',
            route: '/settings',
            icon: PrimeIcons.COG,
            position: 'bottom',
        },
    ];

    constructor() {
        // atualiza largura global para o layout reagir (margin-left do conteúdo)
        effect(() => {
            const w = this.collapsed() ? '70px' : '240px';
            document.documentElement.style.setProperty('--nav-w', w);
            localStorage.setItem('nav-collapsed', String(this.collapsed()));
        });
    }

    ngOnInit() {}

    toggle() {
        this.collapsed.update((v) => !v);
    }

    // Removido: sempre começa recolhido

    getTopItems(): NavItem[] {
        return this.items.filter((item) => item.position === 'top');
    }

    getBottomItems(): NavItem[] {
        return this.items.filter((item) => item.position === 'bottom');
    }
}
