import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenDetails } from '../components/models/token-details';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  getTokenDetails(tokenAddress: string) {
    return this.http.get<TokenDetails>(`https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`);
  }
}
