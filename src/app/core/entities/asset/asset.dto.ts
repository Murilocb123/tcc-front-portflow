import { AssetType } from "./asset-type.enum";

export interface AssetDTO {
  id?: string; // UUID, optional for creation
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange: string;
}
