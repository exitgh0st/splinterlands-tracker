import { Injectable } from '@angular/core';
import { Currency } from '../enums/currency';
import { PlayerTableData } from '../interfaces/player-table-data';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  currency: Currency;

  ecrThreshold: number;
  winRateThreshold: number;

  aboveThresholdColor: string;
  belowThresholdColor: string;

  // belowThresholdColor: string;
  // aboveThresholdColor: string;

  // ecrThreshold: number;
  // winRateThreshold: number;

  playerTableDataHeaderSettings: PlayerTableDataHeaderSetting[];

  constructor() {
    // localStorage.clear();

    const allPlayerTableDataHeaders = Object.keys(PlayerTableData.dummy());
    const playerTableDataHeadersString = localStorage.getItem("playerTableDataHeaders");

    this.playerTableDataHeaderSettings = [];

    if (playerTableDataHeadersString) {
      const playerTableDataHeaders: string[] = JSON.parse(playerTableDataHeadersString);

      for (let playerTableDataHeader of allPlayerTableDataHeaders) {
        let isActive = false;

        if (playerTableDataHeaders.find(header => header === playerTableDataHeader)) {
          isActive = true;
        }

        this.playerTableDataHeaderSettings.push({ header: playerTableDataHeader, isActive });
      }
    } else {
      for (let playerTableDataHeader of allPlayerTableDataHeaders) {
        this.playerTableDataHeaderSettings.push({ header: playerTableDataHeader, isActive: true });
      }

      localStorage.setItem("playerTableDataHeaders", JSON.stringify(allPlayerTableDataHeaders));
    }

    const currencyString = localStorage.getItem("currency");

    if (currencyString) {
      this.currency = currencyString as Currency;
    } else {
      this.currency = Currency.USD;
      localStorage.setItem("currency", this.currency);
    }

    const ecrThresholdString = localStorage.getItem("ecrThreshold");

    if (ecrThresholdString) {
      this.ecrThreshold = parseFloat(ecrThresholdString);
    } else {
      this.ecrThreshold = 75.00;
    }

    const winRateThresholdString = localStorage.getItem("winRateThreshold");

    if (winRateThresholdString) {
      this.winRateThreshold = parseFloat(winRateThresholdString);
    } else {
      this.winRateThreshold = 50.00;
    }

    const aboveThresholdString = localStorage.getItem("aboveThresholdColor");

    if (aboveThresholdString) {
      this.aboveThresholdColor = aboveThresholdString;
    } else {
      this.aboveThresholdColor = "#66ff33";
    }

    const belowThresholdString = localStorage.getItem("belowThreshold");

    if (belowThresholdString) {
      this.belowThresholdColor = belowThresholdString;
    } else {
      this.belowThresholdColor = "#ff3300";
    }
  }

  getPlayerTableDataHeaders() {
    const playerTableDataHeaders = [];
    for (let playerTableDataHeaderSetting of this.playerTableDataHeaderSettings) {
      if (playerTableDataHeaderSetting.isActive) {
        playerTableDataHeaders.push(playerTableDataHeaderSetting.header);
      }
    }

    return playerTableDataHeaders;
  }

  getPlayerTableDataHeaderSettings() {
    return [...this.playerTableDataHeaderSettings];
  }

  getAllCurrency() {
    return [
      Currency.USD,
      Currency.PHP
    ];
  }

  getCurrency() {
    return this.currency;
  }

  getEcrThreshold() {
    return this.ecrThreshold;
  }

  getWinRateThreshold() {
    return this.winRateThreshold;
  }

  getAboveThresholdColor() {
    return this.aboveThresholdColor;
  }

  getBelowThresholdColor() {
    return this.belowThresholdColor;
  }

  setCurrency(currency: Currency) {
    this.currency = currency;
    localStorage.setItem("currency", this.currency);
  }

  setEcrThreshold(ecrThreshold: number) {
    this.ecrThreshold = ecrThreshold;
    localStorage.setItem("ecrThreshold", this.ecrThreshold.toString());
  }

  setWinRateThreshold(winrateThreshold: number) {
    this.winRateThreshold = winrateThreshold;
    localStorage.setItem("winRateThreshold", this.winRateThreshold.toString());
  }

  setAboveThresholdColor(aboveThresholdColor: string) {
    this.aboveThresholdColor = aboveThresholdColor;
    localStorage.setItem("aboveThresholdColor", this.aboveThresholdColor);
  }

  setBelowThresholdColor(belowThresholdColor: string) {
    this.belowThresholdColor = belowThresholdColor;
    localStorage.setItem("belowThresholdColor", this.belowThresholdColor);
  }

  setPlayerTableDataHeaderSettings(playerTableDataHeaderSettings: PlayerTableDataHeaderSetting[]) {
    this.playerTableDataHeaderSettings = playerTableDataHeaderSettings;

    const playerTableDataHeaders = [];

    for (let playerTableDataHeaderSettings of this.playerTableDataHeaderSettings) {
      if (playerTableDataHeaderSettings.isActive) {
        playerTableDataHeaders.push(playerTableDataHeaderSettings.header);
      }
    }

    localStorage.setItem("playerTableDataHeaders", JSON.stringify(playerTableDataHeaders));
  }
}

export interface PlayerTableDataHeaderSetting {
  header: string;
  isActive: boolean;
}
