import { AssetDTO } from "../asset/asset.dto";
import { BrokerDTO } from "../broker/broker.dto";

export enum EventType {
  DIVIDEND = "DIVIDEND",
  JCP = "JCP",
  OTHER = "OTHER"
}

export interface EventDto {
  id?: string;
  broker?: BrokerDTO;
  asset: AssetDTO;
  type: EventType;
  exDate: string; // ISO date string
  payDate?: string; // ISO date string
  valuePerShare?: number;
  totalValue?: number;
  currency: string;
  notes?: string;
}
