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
                { header: 'Quantidade', field: 'quantity', type: 'number' },
                { header: 'Preço médio', field: 'averagePrice', type: 'currency' },
                { header: 'Valor total investido', field: 'totalValues', type: 'currency' },
                { header: 'Total de taxas', field: 'totalFees', type: 'currency' },
                { header: 'Total de impostos', field: 'totalTaxes', type: 'currency' },
            ],
            columnsExpand: [
                { header: 'Corretora', field: 'broker', path: 'broker.name' },
                { header: 'Quantidade', field: 'quantity', type: 'number' },
                { header: 'Preço médio', field: 'averagePrice', type: 'currency' },
                { header: 'Valor investido', field: 'totalValue', type: 'currency' },
                { header: 'Total de taxas', field: 'totalFee', type: 'currency' },
                { header: 'Total de impostos', field: 'totalTax', type: 'currency' },
            ],
        },
        {
            label: 'Corretora',
            value: 'broker',
            columns: [
                { header: 'Corretora', field: 'broker', path: 'broker.name' },
                { header: 'Quantidade', field: 'quantity', type: 'number' },
                { header: 'Preço médio', field: 'averagePrice', type: 'currency' },
                { header: 'Valor total investido', field: 'totalValues', type: 'currency' },
                { header: 'Total de taxas', field: 'totalFees', type: 'currency' },
                { header: 'Total de impostos', field: 'totalTaxes', type: 'currency' },
            ],
            columnsExpand: [
                { header: 'Ativo', field: 'asset', path: 'asset.ticker' },
                { header: 'Quantidade', field: 'quantity', type: 'integer' },
                { header: 'Preço médio', field: 'averagePrice', type: 'currency' },
                { header: 'Valor investido', field: 'totalValue', type: 'currency' },
                { header: 'Total de taxas', field: 'totalFee', type: 'currency' },
                { header: 'Total de impostos', field: 'totalTax', type: 'currency' },
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
            .listStrategies({
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

    getFieldValue(rowData: any, field: string, path?: string, type?: string): any {
        let value = path ? this.resolvePath(rowData, path) : rowData[field];

        if (type) {
            switch (type) {
                case 'currency':
                    value = value
                        ? value.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                          })
                        : '-';
                    break;
                case 'date':
                    value = value ? new Date(value).toLocaleDateString('pt-BR') : '-';
                    break;
                case 'number':
                    value = value ? value.toLocaleString('pt-BR') : '-';
                    break;
                default:
                    break;
            }
        }

        return value;
    }

    private resolvePath(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
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
            id: item[field]?.id || item[field]?.name || item[field],
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
