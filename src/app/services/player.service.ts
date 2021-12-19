import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerBalance } from '../interfaces/player-balance';
import { PlayerDetails } from '../interfaces/player-details';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  fetchPlayerDetails(playerName: string) {
    return this.http.get<PlayerDetails>(`https://api2.splinterlands.com/players/details?name=${playerName}`);
  }

  fetchPlayerBalances(playerName: string) {
    return this.http.get<PlayerBalance[]>(`https://api2.splinterlands.com/players/balances?username=${playerName}`);
  }
}
