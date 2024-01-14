import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenDetails } from '../components/models/token-details';
import { environment } from 'src/environments/environment';

const DEC_ID = 6264;
const SPS_ID = 11035;

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  getTokenDetails(tokenId: number) {
    return this.http.get<TokenDetails>(`${environment.apiUrl}/token_price`, {params: {"id": tokenId}});
  }
}