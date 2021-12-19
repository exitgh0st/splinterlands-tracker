import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../enums/currency';
import { ExchangeRateDetails } from '../interfaces/exchange-rate-details';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private http: HttpClient) { }

  getExchangeRateDetails(currency: Currency) {
    return this.http.get<ExchangeRateDetails>(`https://api.exchangerate-api.com/v4/latest/${currency}`);
  }
}
