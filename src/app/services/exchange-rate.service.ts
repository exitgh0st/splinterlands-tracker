import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor() { }

  getExchangeRateDetails(currency: ) {
    return this.http.get<ExchangeRateDetails>(`https://api.exchangerate-api.com/v4/latest/${ForeignCurrency.USD}`);
  }
}
