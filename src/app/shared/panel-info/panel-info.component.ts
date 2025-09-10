import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-panel-info',
  standalone: false,
  templateUrl: './panel-info.component.html',
  styleUrl: './panel-info.component.scss'
})
export class PanelInfoComponent {
  @Input() title: string = '';
  @Input() contentPanel: TemplateRef<unknown> | undefined;


}
