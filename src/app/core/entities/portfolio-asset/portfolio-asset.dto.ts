import { BrokerDTO } from '../broker/broker.dto';
import { AssetDTO } from '../asset/asset.dto';

export interface PortfolioAssetDTO {
    id: string; // UUID as string
    quantity: number;
    averagePrice: number;
    totalFee: number;
    totalTax: number;
    broker: BrokerDTO;
    asset: AssetDTO;
}