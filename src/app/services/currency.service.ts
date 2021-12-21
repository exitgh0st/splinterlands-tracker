import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../contants/local-storage-keys';
import { Currency } from '../enums/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  nativeCurrency: Currency = Currency.PHP;

  constructor() {
    const nativeCurrencyString = localStorage.getItem(LocalStorageKeys.NATIVE_CURRENCY);

    if (nativeCurrencyString) {
      this.nativeCurrency = Currency[<Currency>nativeCurrencyString];
    }else {
      localStorage.setItem(LocalStorageKeys.NATIVE_CURRENCY, this.nativeCurrency);
    }
  }

  getNativeCurrency() {
    return this.nativeCurrency;
  }


}
