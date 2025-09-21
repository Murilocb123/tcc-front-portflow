import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AssetService } from '../../core/entities/asset/asset.service';
import { BrokerService } from '../../core/entities/broker/broker.service';
import { EventType, EventDto } from '../../core/entities/event/event.dto';
import { EventService } from '../../core/entities/event/event.service';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: EventDto[] = [];
  first = 0;
  visible = false;
  eventForm!: FormGroup;
  assetOptions: any[] = [];
  brokerOptions: any[] = [];
  loadingAssets = false;
  loadingBrokers = false;
  assetTotalRecords = 0;
  brokerTotalRecords = 0;

  eventTypes = [
    { label: 'Dividendo', value: EventType.DIVIDEND },
    { label: 'JCP', value: EventType.JCP },
    { label: 'Outro', value: EventType.OTHER },
  ];

  constructor(
    private fb: FormBuilder,
    private brokerService: BrokerService,
    private assetService: AssetService,
    private loadingService: LoadingPageService,
    private eventService: EventService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      id: [null],
      asset: [null, Validators.required],
      type: [null, Validators.required],
      broker: [null],
      exDate: [null, Validators.required],
      payDate: [null],
      valuePerShare: [null, [Validators.required, Validators.min(0)]],
      totalValue: [null, [Validators.required, Validators.min(0)]],
      currency: ['BRL', Validators.required],
      notes: [null],
    });
    this.loadEvents();
  }

  loadEvents() {
    this.loadingService.show();
    this.eventService
      .list()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (res: any) => {
          this.events = res?.content;
        },
      });
  }

  pageChange(event: any) {
    this.first = event.first;
  }

  showDialog() {
    this.visible = true;
    this.findAllAssets();
    this.findAllBroker();
  }

  saveEvent() {
    if (this.eventForm.invalid) return;
    const formValue = this.eventForm.value;
    const dto: EventDto = {
      id: formValue.id,
      asset: formValue.asset,
      broker: formValue.broker || undefined,
      type: formValue.type.value || formValue.type,
      exDate:
        formValue.exDate instanceof Date
          ? formValue.exDate.toISOString().slice(0, 10)
          : formValue.exDate,
      payDate:
        formValue.payDate instanceof Date
          ? formValue.payDate.toISOString().slice(0, 10)
          : formValue.payDate,
      valuePerShare: formValue.valuePerShare,
      totalValue: formValue.totalValue,
      currency: formValue.currency,
      notes: formValue.notes,
    };
    this.loadingService.show();
    if (dto.id) {
      this.eventService
        .update(dto.id, dto)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe({
          next: () => {
            this.loadEvents();
            this.visible = false;
            this.eventForm.reset();
          },
        });
    } else {
      this.eventService
        .create(dto)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe({
          next: () => {
            this.loadEvents();
            this.visible = false;
            this.eventForm.reset();
          },
        });
    }
  }

  confirmDelete(eventId: number) {
    this.confirmationService.confirm({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este evento?',
      accept: () => {
        this.loadingService.show();
        this.eventService
          .delete(eventId.toString())
          .pipe(finalize(() => this.loadingService.hide()))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Evento excluído com sucesso.',
              });
              this.loadEvents();
            },
          });
      },
      rejectButtonStyleClass: 'p-button-secondary',
      rejectVisible: true,
      rejectLabel: 'Cancelar',
      acceptLabel: 'Excluir',
      acceptButtonStyleClass: 'p-button-danger',
    });
  }

  findAllAssets() {
    this.loadingAssets = true;
    this.assetService
      .listAll()
      .pipe(finalize(() => (this.loadingAssets = false)))
      .subscribe({
        next: (res: any) => {
          this.assetOptions = res;
          this.assetTotalRecords = res.length;
        },
      });
  }

  findAllBroker() {
    this.loadingBrokers = true;
    this.brokerService
      .listAll()
      .pipe(finalize(() => (this.loadingBrokers = false)))
      .subscribe({
        next: (res: any) => {
          this.brokerOptions = res;
          this.brokerTotalRecords = res.length;
        },
      });
  }

  editEvent(event: EventDto) {
    this.eventForm.setValue({
      id: event.id || null,
      asset: event.asset,
      type: this.eventTypes.find((t) => t.value === event.type)?.value,
      broker: event.broker || null,
      exDate: event.exDate ? new Date(event.exDate) : null,
      payDate: event.payDate ? new Date(event.payDate) : null,
      valuePerShare: event.valuePerShare,
      totalValue: event.totalValue,
      currency: event.currency,
      notes: event.notes,
    });
    this.showDialog();
  }

  getEventTypeLabel(value: EventType): string {
    const type = this.eventTypes.find((t) => t.value === value);
    return type ? type.label : 'Desconhecido';
  }
}
