import { AssetDTO } from "../asset/asset.dto";
import { BrokerDTO } from "../broker/broker.dto";
import { TransactionType } from "./transaction-type.enum";

export interface TransactionDto {
  id?: string; // caso precise de um identificador
  broker?: any; // ou broker: BrokerDto
  asset?: any; // ou asset: AssetDto
  type: TransactionType; // TxnType
  tradeDate: string; // ISO date string
  quantity: number;
  price: number;
  grossValue?: number;
  netValue?: number;
  feeValue?: number;
  taxValue?: number;
  description?: string;
}
