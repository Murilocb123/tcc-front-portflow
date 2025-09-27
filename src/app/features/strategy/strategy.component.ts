import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PortfolioAssetService } from '../../core/entities/portfolio-asset/portfolio-asset.service';

@Component({
    selector: 'app-strategy',
    standalone: false,
    templateUrl: './strategy.component.html',
    styleUrls: ['./strategy.component.scss'],
})
export class StrategyComponent implements OnInit, OnDestroy {
    gridData: any[] = [];

    groupBy: any[] = [
        {
            label: 'Ativo',
            value: 'asset',
            columns: [
                { header: 'Ativo', field: 'asset', path: 'asset.ticker' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Preço medio', field: 'averagePrice' },
                { header: 'Valor total', field: 'totalValues' },
                { header: 'Total de taxas', field: 'totalFees' },
                { header: 'Total de impostos', field: 'totalTaxes' },
            ],
            columnsExpand: [
                { header: 'Corretora', field: 'broker', path: 'broker.name' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Preço medio', field: 'averagePrice' },
                { header: 'Valor total', field: 'totalValue' },
                { header: 'Total de taxas', field: 'totalFees' },
                { header: 'Total de impostos', field: 'totalTaxes' },
            ],
        },
        {
            label: 'Corretora',
            value: 'broker',
            columns: [
                { header: 'Corretora', field: 'broker', path: 'broker.name' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Preço medio', field: 'averagePrice' },
                { header: 'Valor total', field: 'totalValues' },
                { header: 'Total de taxas', field: 'totalFees' },
                { header: 'Total de impostos', field: 'totalTaxes' },
            ],
            columnsExpand: [
                { header: 'Ativo', field: 'asset', path: 'asset.ticker' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Preço medio', field: 'averagePrice' },
                { header: 'Valor total', field: 'totalValue' },
                { header: 'Total de taxas', field: 'totalFees' },
                { header: 'Total de impostos', field: 'totalTaxes' },
            ],
        },
    ];

    selectedGroup: string = 'asset';
    columnsFieldExpand = [];

    expandAll = false;

    expandedRows: { [key: string]: boolean } = {};

    get columns() {
        const group = this.groupBy.find((g) => g.value === this.selectedGroup);
        return group ? group.columns : [];
    }

    get columnsHeaderExpanded() {
        const group = this.groupBy.find((g) => g.value === this.selectedGroup);
        return group ? group.columnsExpand : [];
    }

    private ngUnsubscribe$ = new Subject<void>();

    constructor(
        private readonly portfolioAssetService: PortfolioAssetService,
    ) {}

    ngOnInit(): void {
        this.updateGrid();
    }

    updateGrid(): void {
        this.portfolioAssetService
            .list({
                page: 0,
                size: 1000,
                filter: {},
            })
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((assets: any) => {
                this.gridData = this.groupContent(assets?.content || []);
            });
    }

    toggleGroup(group: any): void {
        // Lógica para expandir ou contrair o grupo
        console.log(group);
        this.expandAll = !this.expandAll;
    }

    onRowExpand(event: any): void {
        const rowKey = event.data.asset.name;
        this.expandedRows[rowKey] = true;
    }

    onRowCollapse(event: any): void {
        const rowKey = event.data.asset.name;
        delete this.expandedRows[rowKey];
    }

    expandAllRows(): void {
        this.gridData.forEach((row) => {
            this.expandedRows[row.asset.name] = true;
        });
    }

    collapseAllRows(): void {
        this.expandedRows = {};
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }

    getFieldValue(item: any, field: string, path: string | undefined): any {
        if (path) {
            return path.split('.').reduce((obj, key) => obj?.[key], item);
        }   
        return item[field];
    }

    private groupContent(data: any[]): any[] {
        if (!data) return [];
        const groupKey = this.selectedGroup;
        return this.groupByField(data, groupKey);
    }

    private groupByField(data: any[], field: string): any[] {
        const grouped = data.reduce((acc, item) => {
            // Ajuste para considerar que 'asset' e 'broker' são objetos com 'id' e 'name'
            let keyObj: any;
            if (field === 'asset' || field === 'broker') {
                keyObj = item[field];
            } else {
                keyObj = { id: item[field], name: item[field] };
            }
            const key = keyObj?.id ?? keyObj?.name ?? keyObj;

            if (!acc[key]) {
                // Inicializa o grupo com o objeto correto
                acc[key] = this.initGroup(item, field);
            }
            acc[key].details.push(item);
            acc[key].quantity += item.quantity;
            acc[key].totalValues += item.totalValue;
            acc[key].totalFees += item.totalFee;
            acc[key].totalTaxes += item.totalTax;
            acc[key].averagePriceSum += item.averagePrice * item.quantity;
            acc[key].averagePriceQty += item.quantity;
            // Garante que o campo de agrupamento seja o objeto completo
            acc[key][field] = keyObj;
            return acc;
        }, {} as any);

        Object.values(grouped).forEach((group: any) => {
            group.averagePrice = group.averagePriceQty
                ? group.averagePriceSum / group.averagePriceQty
                : 0;
            group.totalValues = group.averagePrice * group.quantity; // Corrige a atribuição do totalValues
            delete group.averagePriceSum;
            delete group.averagePriceQty;
        });
        console.log(Object.values(grouped));
        return Object.values(grouped);
    }

    private initGroup(item: any, field: string): any {
        return {
            [field]: item[field],
            quantity: 0,
            totalValue: 0,
            totalFees: 0,
            totalTaxes: 0,
            averagePrice: 0,
            averagePriceSum: 0,
            averagePriceQty: 0,
            details: [],
        };
    }
}
