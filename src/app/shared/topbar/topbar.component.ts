import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

type TopItem = { label: string; route: string };

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  items: TopItem[] = [
    { label: 'Notificações', route: '/notifications' },
    { label: 'Ajuda',        route: '/help' },
    { label: 'Perfil',       route: '/profile' },
  ];
}