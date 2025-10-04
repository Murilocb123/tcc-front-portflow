import { BrokerDTO } from '../broker/broker.dto';
import { AssetDTO } from '../asset/asset.dto';

export interface StrategyDTO {
    id: string; // UUID as string
    quantity: number;
    averagePrice: number;
    totalFee: number;
    totalTax: number;
    totalInvested: number;
    startDate: Date;
    targetPrice: number;
    totalReceivable: number;
    broker: BrokerDTO;
    asset: AssetDTO;
}