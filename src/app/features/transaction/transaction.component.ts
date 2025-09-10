import { Component } from '@angular/core';

@Component({
  selector: 'app-transaction',
  standalone: false,
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {


  transactions = [
    { tradeDate: new Date('2023-10-01'), asset: { symbol: 'AAPL' }, type: 'BUY', quantity: 10, price: 150.123456, grossValue: 1501.23, feeValue: 5.00, taxValue: 0.00, netValue: 1506.23 },
    { tradeDate: new Date('2023-10-02'), asset: { symbol: 'GOOGL' }, type: 'SELL', quantity: 5, price: 2800.654321, grossValue: 14003.27, feeValue: 10.00, taxValue: 15.00, netValue: 13978.27 },
    { tradeDate: new Date('2023-10-03'), asset: { symbol: 'MSFT' }, type: 'BUY', quantity: 8, price: 300.987654, grossValue: 2407.90, feeValue: 7.00, taxValue: 0.00, netValue: 2414.90 },
    { tradeDate: new Date('2023-10-04'), asset: { symbol: 'TSLA' }, type: 'SELL', quantity: 3, price: 700.123456, grossValue: 2100.37, feeValue: 8.00, taxValue: 12.00, netValue: 2080.37 },
    { tradeDate: new Date('2023-10-05'), asset: { symbol: 'AMZN' }, type: 'BUY', quantity: 2, price: 3300.654321, grossValue: 6601.31, feeValue: 15.00, taxValue: 0.00, netValue: 6616.31 },
    { tradeDate: new Date('2023-10-06'), asset: { symbol: 'FB' }, type: 'SELL', quantity: 6, price: 350.987654, grossValue: 2105.93, feeValue: 6.00, taxValue: 9.00, netValue: 2090.93 },
    { tradeDate: new Date('2023-10-07'), asset: { symbol: 'NFLX' }, type: 'BUY', quantity: 4, price: 550.123456, grossValue: 2200.49, feeValue: 4.00, taxValue: 0.00, netValue: 2204.49 },
    { tradeDate: new Date('2023-10-08'), asset: { symbol: 'NVDA' }, type: 'SELL', quantity: 7, price: 600.654321, grossValue: 4204.58, feeValue: 9.00, taxValue: 11.00, netValue: 4184.58 },
    { tradeDate: new Date('2023-10-09'), asset: { symbol: 'BABA' }, type: 'BUY', quantity: 9, price: 200.987654, grossValue: 1808.89, feeValue: 5.00, taxValue: 0.00, netValue: 1813.89 },
    { tradeDate: new Date('2023-10-10'), asset: { symbol: 'ORCL' }, type: 'SELL', quantity: 1, price: 90.123456, grossValue: 90.12, feeValue: 2.00, taxValue: 1.00, netValue: 87.12 },
    
  ];
  first = 0;

  pageChange(event: any) {
    this.first = event.first;
  }

}
