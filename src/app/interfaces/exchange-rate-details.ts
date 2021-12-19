import { Currency } from "../enums/currency";

export interface ExchangeRateDetails {
  time_last_updated?: number;
  rates?: {
      [key in Currency]: number;
  };
}
