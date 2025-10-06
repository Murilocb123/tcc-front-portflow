export interface PortfolioDailyReturnDTO {
    seqId: number;
    tenant: string; // UUID as string
    portfolio: string; // UUID as string
    portfolioName: string;
    priceDate: Date;
    mvEnd: number; // BigDecimal as string
    mvPrev: number; // BigDecimal as string
    flowValue: number; // BigDecimal as string
    realReturnValue: number; // BigDecimal as string
    dailyReturn: number; // BigDecimal as string
    baseValue: number; // BigDecimal as string
    cumulativeReturnPercent: number; // BigDecimal as string
    cumulativeValueGain: number; // BigDecimal as string
}
