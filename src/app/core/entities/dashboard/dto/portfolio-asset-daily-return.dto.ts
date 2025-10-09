export interface PortfolioAssetDailyReturnDTO {
    seqId: number;
    tenant: string; // UUID as string
    portfolio: string; // UUID as string
    portfolioName: string;
    asset: string; // UUID as string
    priceDate: Date;
    mvEnd: number; // BigDecimal as string
    mvPrev: number; // BigDecimal as string
    flowValue: number; // BigDecimal as string
    realReturnValue: number; // BigDecimal as string
    dailyReturn: number; // BigDecimal as string
    baseValue: number; // BigDecimal as string
    cumulativeReturnPercentAsset: number; // BigDecimal as string
    cumulativeValueGainAsset: number; // BigDecimal as string
}
