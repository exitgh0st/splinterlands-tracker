import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenDetails } from '../components/models/token-details';

const DEC_ID = 6264;
const SPS_ID = 11035;

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  getTokenDetails(tokenId: number) {
    const headers = new HttpHeaders();
    const queryParams = new HttpParams();

    headers.set("X-CMC_PRO_API_KEY", "88343f74-55e4-4bf2-9562-dfa734d857a9");
    queryParams.set("id", tokenId);

    return this.http.get<TokenDetails>(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest`, {headers: {"X-CMC_PRO_API_KEY": "88343f74-55e4-4bf2-9562-dfa734d857a9"}, params: {id: tokenId}});
  }
}
