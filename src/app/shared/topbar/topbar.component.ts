import { Component, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';

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
export class TopbarComponent {
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

  @ViewChild('popover')
  notificationPanel!: Popover;
  @ViewChild('notificationButton')
  notificationButton!: Button;

  constructor() {
    // Simulação de recebimento de notificações
  }

  openNotificationPanel(event: MouseEvent) {
    this.notificationPanel.toggle(event);
  }
}