import { PortfolioDailyReturnDTO } from "./portfolio-daily-return.dto";
import { PortfolioMonthlyIncomeDTO } from "./portfolio-monthly-income.dto";

export interface OverviewDashboardDTO {
    totalPortfolioValue: number;
    totalReturnPercent: number;
    totalIncomeValue: number;
    dailyReturns: PortfolioDailyReturnDTO[];
    monthlyIncomes: PortfolioMonthlyIncomeDTO[];
}
