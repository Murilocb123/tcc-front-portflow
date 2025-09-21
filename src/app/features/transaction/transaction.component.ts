import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AssetService } from '../../core/entities/asset/asset.service';
import { BrokerService } from '../../core/entities/broker/broker.service';
import { TransactionType } from '../../core/entities/transaction/transaction-type.enum';
import { TransactionDto } from '../../core/entities/transaction/transaction.dto';
import { TransactionService } from '../../core/entities/transaction/transaction.service';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-transaction',
    standalone: false,
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
    transactions: TransactionDto[] = [];
    first = 0;

    visible = false;
    transactionForm!: FormGroup;
    assetOptions: any[] = [];
    brokerOptions: any[] = [];
    loadingAssets = false;
    loadingBrokers = false;
    assetTotalRecords = 0;
    brokerTotalRecords = 0;

    transactionTypes = [
        { label: 'Compra', value: TransactionType.BUY },
        { label: 'Venda', value: TransactionType.SELL },
    ];

    // Removido ngOnInit duplicado

    constructor(
        private fb: FormBuilder,
        private brokerService: BrokerService,
        private assetService: AssetService,
        private loadingService: LoadingPageService,
        private transactionService: TransactionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.transactionForm = this.fb.group({
            id: [null],
            asset: [null, Validators.required],
            type: [null, Validators.required],
            broker: [null, Validators.required],
            quantity: [null, [Validators.required, Validators.min(0.01)]],
            price: [null, [Validators.required, Validators.min(0.01)]],
            feeValue: [null, [Validators.min(0)]],
            taxValue: [null, [Validators.min(0)]],
            tradeDate: [null, Validators.required],
        });
        this.loadTransactions();
    }

    loadTransactions() {
        this.loadingService.show();
        this.transactionService
            .list()
            .pipe(finalize(() => this.loadingService.hide()))
            .subscribe({
                next: (res: any) => {
                    this.transactions = res?.content;
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

    saveTransaction() {
        if (this.transactionForm.invalid) return;
        const formValue = this.transactionForm.value;
        const dto: TransactionDto = {
            id: formValue.id,
            asset: { id: formValue.asset?.id || formValue.asset },
            broker: { id: formValue.broker?.id || formValue.broker },
            type: formValue.type.value || formValue.type,
            tradeDate:
                formValue.tradeDate instanceof Date
                    ? formValue.tradeDate.toISOString().slice(0, 10)
                    : formValue.tradeDate,
            quantity: formValue.quantity,
            price: formValue.price,
            feeValue: formValue.feeValue,
            taxValue: formValue.taxValue,
        };
        this.loadingService.show();
        if (dto.id) {
            this.transactionService
                .update(dto.id, dto)
                .pipe(finalize(() => this.loadingService.hide()))
                .subscribe({
                    next: () => {
                        this.loadTransactions();
                        this.visible = false;
                        this.transactionForm.reset();
                    },
                });
        } else {
            this.transactionService
                .create(dto)
                .pipe(finalize(() => this.loadingService.hide()))
                .subscribe({
                    next: () => {
                        this.loadTransactions();
                        this.visible = false;
                        this.transactionForm.reset();
                    },
                });
        }
    }

    confirmDelete(transactionId: number) {
        this.confirmationService.confirm({
            header: 'Confirmação de exclusão',
            message: 'Tem certeza que deseja excluir esta transação?',
            accept: () => {
                this.loadingService.show();
                this.transactionService
                    .delete(transactionId.toString())
                    .pipe(finalize(() => this.loadingService.hide()))
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Sucesso',
                                detail: 'Transação excluída com sucesso.',
                            });
                            this.loadTransactions();
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

    editTransaction(transaction: TransactionDto) {
        this.transactionForm.setValue({
            id: transaction.id || null,
            asset: transaction.asset,
            type:
                this.transactionTypes.find(
                    (t) => t.value === transaction.type
                )?.value,
            broker: transaction.broker,
            quantity: transaction.quantity,
            price: transaction.price,
            feeValue: transaction.feeValue,
            taxValue: transaction.taxValue,
            tradeDate: new Date(transaction.tradeDate),
        });
        console.log(this.transactionForm.value);
        this.showDialog();
    }

    getTransactionTypeLabel(value: TransactionType): string {
        const type = this.transactionTypes.find((t) => t.value === value);
        return type ? type.label : 'Desconhecido';
    }
}
