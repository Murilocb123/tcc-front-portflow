import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrokerService } from '../../core/entities/broker/broker.service';
import { AssetService } from '../../core/entities/asset/asset.service';
import { finalize } from 'rxjs';
import { LoadingPageService } from '../../shared/loading-page/loading-page.service';

@Component({
    selector: 'app-transaction',
    standalone: false,
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
    transactions = [
        {
            tradeDate: new Date('2023-10-01'),
            asset: { symbol: 'AAPL' },
            type: 'BUY',
            quantity: 10,
            price: 150.123456,
            grossValue: 1501.23,
            feeValue: 5.0,
            taxValue: 0.0,
            netValue: 1506.23,
        }
    ];
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
        { label: 'Compra', value: 'BUY' },
        { label: 'Venda', value: 'SELL' },
    ];

    // Removido ngOnInit duplicado

    constructor(
        private fb: FormBuilder,
        private brokerService: BrokerService,
        private assetService: AssetService,
        private loadingService: LoadingPageService
    ) {}

    ngOnInit(): void {
        
        this.transactionForm = this.fb.group({
            asset: [null, Validators.required],
            type: [null, Validators.required],
            broker: [null, Validators.required],
            quantity: [null, [Validators.required, Validators.min(0.01)]],
            price: [null, [Validators.required, Validators.min(0.01)]],
            feeValue: [null, [Validators.required, Validators.min(0)]],
            taxValue: [null, [Validators.required, Validators.min(0)]],
            tradeDate: [null, Validators.required],
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

    addTransaction() {
        if (this.transactionForm.invalid) return;
        const formValue = this.transactionForm.value;
        const newTransaction = {
            tradeDate: formValue.tradeDate,
            asset: { symbol: formValue.asset.symbol || formValue.asset },
            type: formValue.type.value || formValue.type,
            quantity: formValue.quantity,
            price: formValue.price,
            grossValue: formValue.quantity * formValue.price,
            feeValue: formValue.feeValue,
            taxValue: formValue.taxValue,
            netValue:
                formValue.quantity * formValue.price +
                formValue.feeValue +
                formValue.taxValue,
        };
        this.transactions = [newTransaction, ...this.transactions];
        this.transactionForm.reset();
        this.visible = false;
    }

    editTransaction(transaction: any) {
        this.transactionForm.setValue({
            asset: transaction.asset,
            type: this.transactionTypes.find(
                (t) => t.value === transaction.type
            ),
            quantity: transaction.quantity,
            price: transaction.price,
            feeValue: transaction.feeValue,
            taxValue: transaction.taxValue,
            tradeDate: new Date(transaction.tradeDate),
        });
        this.visible = true;
    }
    confirmDelete(transactionId: number) {
        // Lógica para confirmar e deletar a transação
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
}
