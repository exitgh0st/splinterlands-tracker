import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { SplinterlandsCurrency } from '../enums/splinterlands-currency';
import { PlayerBalance } from '../interfaces/player-balance';
import { PlayerData } from '../interfaces/player-data';
import { PlayerDetails } from '../interfaces/player-details';
import { SplinterlandsSettings } from '../interfaces/splinterlands-settings';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerNames: string[];
  players$ = new BehaviorSubject<Player[] | undefined>(undefined);

  constructor(private http: HttpClient) {
    const playerNamesString = localStorage.getItem('players');

    if (playerNamesString) {
      this.playerNames = ['crinkles'];
      // const playerNames = JSON.parse(playerNamesString);
      // this.playerNames = playerNames;
    } else {
      this.playerNames = ['crinkles'];
      localStorage.setItem('players', this.playerNames.toLocaleString());
    }
  }

  getPlayerNames() {
    return this.playerNames;
  }

  fetchPlayersData() {
    const playerData$ = new Array();

    for (const playerName of this.playerNames) {
      playerData$.push(this.fetchPlayerDetails(playerName));
      playerData$.push(this.fetchPlayerBalances(playerName));
    }

    return forkJoin(playerData$).toPromise().then(results => {
      const playersData = new Array<PlayerData>();

      for (let i = 0; i < results.length; i = i+2) {
        const playerDetails = results[i] as PlayerDetails;
        const playerBalances = results[i + 1] as PlayerBalance[];
        playersData.push({playerDetails, playerBalances});
      }

      return playersData;
    });
  }

  initPlayers(playersData: PlayerData[], splinterlandsSettings: SplinterlandsSettings) {
    const players = new Array<Player>();

    for (const playerData of playersData) {
      const player = this.initPlayer(playerData, splinterlandsSettings);
      players.push(player);
    }

    return players;
  }

  private initPlayer(playerData: PlayerData, splinterlandsSettings: SplinterlandsSettings): Player {
    const playerDetails = playerData.playerDetails;
    const playerBalances = playerData.playerBalances;

    const player = new Player();

    player.name = playerDetails.name;
    player.rating = playerDetails.rating;
    player.battles = playerDetails.battles;
    player.wins = playerDetails.wins;
    player.winRate = parseFloat(((player.wins / player.battles) * 100).toFixed(2));
    player.collectionPower = playerDetails.collection_power;
    player.league = playerDetails.league;
    player.dec = this.getPlayerBalance(playerBalances, SplinterlandsCurrency.DEC);
    player.sps = this.getPlayerBalance(playerBalances, SplinterlandsCurrency.SPS);
    player.stakedSps = this.getPlayerBalance(playerBalances, SplinterlandsCurrency.STAKED_SPS);
    player.credits = this.getPlayerBalance(playerBalances, SplinterlandsCurrency.CREDITS);

    player.rank = splinterlandsSettings.leagues[player.league ? player.league : 0].name;
    const ecrRegenRate = splinterlandsSettings.dec.ecr_regen_rate;

    const lastBlock = splinterlandsSettings.last_block;
    let playerLastRewardBlock = playerDetails.last_reward_block;

    if (!playerLastRewardBlock) {
      playerLastRewardBlock = lastBlock;
    }

    const captureRate = (((lastBlock - playerLastRewardBlock) * ecrRegenRate) + playerDetails.capture_rate) / 100;
    player.captureRate = parseFloat(captureRate.toFixed(2));

    if (player.captureRate > 100) {
      player.captureRate = 100;
    }

    return player;
  }

  private getPlayerBalance(playerBalances: PlayerBalance[], token: SplinterlandsCurrency) {
    const balance = playerBalances.find(playerBalance => {
      return playerBalance.token === token;
    })?.balance;

    return balance ? balance : 0;
  }

  fetchPlayerDetails(playerName: string) {
    return this.http.get<PlayerDetails>(`https://api2.splinterlands.com/players/details?name=${playerName}`);
  }

  fetchPlayerBalances(playerName: string) {
    return this.http.get<PlayerBalance[][]>(`https://api2.splinterlands.com/players/balances?username=${playerName}`);
  }
}
