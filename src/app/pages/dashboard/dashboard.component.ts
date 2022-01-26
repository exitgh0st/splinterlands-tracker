import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { AddAccountModalComponent, AddAccountModalListener } from 'src/app/components/add-account-modal/add-account-modal.component';
import { TokenDetails } from 'src/app/components/models/token-details';
import { SettingsModalComponent, SettingsModalListener } from 'src/app/components/settings-modal/settings-modal.component';
import { currencyDecimal } from 'src/app/constants/currency-decimals';
import { TokenAddresses } from 'src/app/constants/token-addresses';
import { Currency } from 'src/app/enums/currency';
import { ModalIds } from 'src/app/enums/modal-ids';
import { ExchangeRateDetails } from 'src/app/interfaces/exchange-rate-details';
import { PlayerData } from 'src/app/interfaces/player-data';
import { PlayerTableData } from 'src/app/interfaces/player-table-data';
import { SplinterlandsSettings } from 'src/app/interfaces/splinterlands-settings';
import { Player } from 'src/app/models/player';
import { CurrencyService } from 'src/app/services/currency.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { ModalService } from 'src/app/services/modal.service';
import { PlayerService } from 'src/app/services/player.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SplinterlandsService } from 'src/app/services/splinterlands.service';
import { TokenService } from 'src/app/services/token.service';
import { TimeUtil } from 'src/app/utils/time-util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AddAccountModalListener, SettingsModalListener {
  viewModel = new DashboardViewModel();
  currency: Currency;

  splinterlandsSettings$ = new BehaviorSubject<SplinterlandsSettings | undefined>(undefined)
  usdExchangeRateDetails$ = new BehaviorSubject<ExchangeRateDetails | undefined>(undefined);
  decTokenDetails$ = new BehaviorSubject<TokenDetails | undefined>(undefined);
  spsTokenDetails$ = new BehaviorSubject<TokenDetails | undefined>(undefined);
  playersData$ = new BehaviorSubject<PlayerData[] | undefined>(undefined);

  players$ = new BehaviorSubject<Player[] | undefined>(undefined);

  players?: Player[];

  gridIconForDecRate = {
    directory: "assets/images/bar_chart_icon.png",
    link: "https://poocoin.app/tokens/0xe9d7023f2132d55cbd4ee1f78273cb7a3e74f10a"
  };

  gridIconForSpsRate = {
    directory: "assets/images/bar_chart_icon.png",
    link: "https://poocoin.app/tokens/0x1633b7157e7638c4d6593436111bf125ee74703f"
  };

  playerTableDataHeaders: string[];

  constructor(private viewContainerRef: ViewContainerRef,
    private modalService: ModalService,
    private currencyService: CurrencyService,
    private splinterlandsService: SplinterlandsService,
    private exchangeRateService: ExchangeRateService,
    private tokenService: TokenService,
    private playerService: PlayerService,
    private settingsService: SettingsService) {
    this.modalService.setViewContainerRef(this.viewContainerRef);
    this.currency = this.settingsService.getCurrency();
    this.playerTableDataHeaders = this.settingsService.getPlayerTableDataHeaders();
  }

  ngOnInit(): void {
    this.fetchSplinterlandsSettings();
    this.fetchUsdExchangeRate();
    this.fetchDecTokenDetails();
    this.fetchSpsTokenDetails();
    this.fetchPlayersData();

    this.splinterlandsSettings$.subscribe(splinterlandsSettings => {
      if (!splinterlandsSettings) {
        return;
      }

      const seasonEndMs = splinterlandsSettings.season.ends;

      const msRemainingBeforeSeasonEnds = new Date(seasonEndMs).getTime() - new Date().getTime();
      const seasonEndDHM = TimeUtil.convertMillisecondsToDHM(msRemainingBeforeSeasonEnds);

      this.viewModel.endOfSeason = seasonEndDHM.days + " : " + seasonEndDHM.hours + " : " + seasonEndDHM.minutes;
    });

    this.playersData$.subscribe(playersData => {
      if (!playersData) {
        return;
      }

      this.viewModel.totalAccounts = playersData.length.toString();
    });

    combineLatest([this.splinterlandsSettings$, this.playersData$]).subscribe(result => {
      const splinterlandsSettings = result[0];
      const playersData = result[1];

      if (!splinterlandsSettings || !playersData) {
        return;
      }

      this.players = this.playerService.initPlayers(playersData, splinterlandsSettings);

      const playersTableData = new Array<PlayerTableData>();

      for (let i = 0; i < this.players.length; i++) {
        playersTableData.push(this.getPlayerTableData(this.players[i], i));
      }

      this.viewModel.players = playersTableData;
      this.players$.next(this.players);
    });

    combineLatest([this.usdExchangeRateDetails$, this.decTokenDetails$]).subscribe(results => {
      const usdExchangeRateDetails = results[0];
      const decTokenDetails = results[1];

      if (!usdExchangeRateDetails || !decTokenDetails) {
        return;
      }

      this.viewModel.decRate = this.currency + " " + (parseFloat(decTokenDetails.data.price) * usdExchangeRateDetails.rates[this.currency]).toFixed(currencyDecimal[this.currency]);
    });

    combineLatest([this.usdExchangeRateDetails$, this.spsTokenDetails$]).subscribe(results => {
      const usdExchangeRateDetails = results[0];
      const spsTokenDetails = results[1];

      if (!usdExchangeRateDetails || !spsTokenDetails) {
        return;
      }

      this.viewModel.spsRate = this.currency + " " + (parseFloat(spsTokenDetails.data.price) * usdExchangeRateDetails.rates[this.currency]).toFixed(currencyDecimal[this.currency]);
    });

    combineLatest([this.usdExchangeRateDetails$, this.decTokenDetails$, this.spsTokenDetails$, this.players$]).subscribe(results => {
      const usdExchangeRateDetails = results[0];
      const decTokenDetails = results[1];
      const spsTokenDetails = results[2];
      const players = results[3];

      if (!usdExchangeRateDetails || !decTokenDetails || !spsTokenDetails || !players) {
        return;
      }

      let totalDec = 0;
      let totalSps = 0;
      let totalStakedSps = 0;

      for (const player of players) {
        if (player.dec === undefined || player.sps === undefined || player.stakedSps === undefined) {
          continue;
        }

        totalDec += player.dec;
        totalSps += player.sps;
        totalStakedSps += player.stakedSps;
      }

      let decValue = parseFloat(decTokenDetails.data.price);
      let spsValue = parseFloat(spsTokenDetails.data.price);

      if (this.currency !== Currency.DEFAULT) {
        const usdExchangeRateToNativeCurrency = usdExchangeRateDetails.rates[this.currency];
        decValue *= usdExchangeRateToNativeCurrency;
        spsValue *= usdExchangeRateToNativeCurrency;
      }

      const totalDecInNative = parseFloat((totalDec * decValue).toFixed(currencyDecimal[this.currency]));
      const totalSpsInNative = parseFloat((totalSps * spsValue).toFixed(currencyDecimal[this.currency]));
      const totalStakedSpsInNative = parseFloat((totalStakedSps * spsValue).toFixed(currencyDecimal[this.currency]));

      const totalAssetsInNative = (totalDecInNative + totalSpsInNative + totalStakedSpsInNative).toFixed(2);

      this.viewModel.totalDec = totalDec.toFixed(2);
      this.viewModel.totalSps = totalSps.toFixed(2);
      this.viewModel.totalStakedSps = totalStakedSps.toFixed(2);

      this.viewModel.totalDecInNative = this.currency + " " + totalDecInNative.toString();
      this.viewModel.totalSpsInNative = this.currency + " " + totalSpsInNative.toString();
      this.viewModel.totalStakedSpsInNative = this.currency + " " + totalStakedSpsInNative.toString();
      this.viewModel.totalAssets = this.currency + " " + totalAssetsInNative.toString();
    });
  }

  fetchSplinterlandsSettings() {
    this.splinterlandsService.fetchSettings().toPromise().then(splinterlandsSettings => {
      this.splinterlandsSettings$.next(splinterlandsSettings);
    });
  }

  fetchUsdExchangeRate() {
    this.exchangeRateService.getExchangeRateDetails(Currency.USD).toPromise().then(exchangeRateDetails => {
      this.usdExchangeRateDetails$.next(exchangeRateDetails);
    });
  }

  fetchDecTokenDetails() {
    this.tokenService.getTokenDetails(TokenAddresses.DEC_TOKEN_ADDRESS).toPromise().then(tokenDetails => {
      this.decTokenDetails$.next(tokenDetails);
    });
  }

  fetchSpsTokenDetails() {
    this.tokenService.getTokenDetails(TokenAddresses.SPS_TOKEN_ADDRESS).toPromise().then(tokenDetails => {
      this.spsTokenDetails$.next(tokenDetails);
    });
  }

  fetchPlayersData() {
    this.playerService.fetchPlayersData().then(playersData => {
      this.playersData$.next(playersData);
    });
  }

  getPlayerTableData(player: Player, playerCtr: number): PlayerTableData {
    const aboveThresholdColor = this.settingsService.getAboveThresholdColor();
    const belowThresholdColor = this.settingsService.getBelowThresholdColor();

    let ecrColor;
    let winRateColor;

    if (player.captureRate){
      ecrColor = player.captureRate >= this.settingsService.getEcrThreshold() ? aboveThresholdColor : belowThresholdColor;
    }

    if (player.winRate) {
      winRateColor = player.winRate >= this.settingsService.getWinRateThreshold() ? aboveThresholdColor : belowThresholdColor;
    }

    return {
      "#": {value: (playerCtr + 1).toString() },
      "USERNAME": {value: player.name !== undefined ? player.name : ""},
      "ECR (%)": {value: player.captureRate !== undefined ? player.captureRate.toFixed(2) : "", details: {color: ecrColor}},
      "WIN RATE (%)": {value: player.winRate !== undefined ? player.winRate.toFixed(2) : "",  details: {color: winRateColor}},
      "RANK": {value: player.rank !== undefined ? player.rank : ""},
      "RATING": {value: player.rating !== undefined ? player.rating.toString() : ""},
      "POWER": {value: player.collectionPower !== undefined ? player.collectionPower.toString() : ""},
      "DEC": {value: player.dec !== undefined ? player.dec.toFixed(2) : ""},
      "SPS": {value: player.sps !== undefined ? player.sps.toFixed(2) : ""},
      "STAKED SPS": {value: player.stakedSps !== undefined ? player.stakedSps.toFixed(2) : ""},
      "CREDITS": {value: player.credits !== undefined ? player.credits.toFixed(2) : ""}
    };
  }

  donateButtonClicked() {
    console.log("donate button clicked");
  }

  settingsButtonClicked() {
    const settingsModal = this.modalService.openModal(ModalIds.SETTINGS_MODAL_ID);
    (settingsModal as SettingsModalComponent).setSettingsModalListener(this);
  }

  refresh() {
    this.splinterlandsSettings$.next(undefined);
    this.usdExchangeRateDetails$.next(undefined);
    this.decTokenDetails$.next(undefined);
    this.spsTokenDetails$.next(undefined);
    this.playersData$.next(undefined);
    this.players$.next(undefined);

    this.resetViewModel();

    this.currency = this.settingsService.getCurrency();
    this.playerTableDataHeaders = this.settingsService.getPlayerTableDataHeaders();

    this.fetchSplinterlandsSettings();
    this.fetchUsdExchangeRate();
    this.fetchDecTokenDetails();
    this.fetchSpsTokenDetails();
    this.fetchPlayersData();
  }

  resetViewModel() {
    this.viewModel.totalAccounts = undefined;
    this.viewModel.totalDec = undefined;
    this.viewModel.totalDecInNative = undefined;
    this.viewModel.totalSps = undefined;
    this.viewModel.totalSpsInNative = undefined;
    this.viewModel.totalStakedSps = undefined;
    this.viewModel.totalStakedSpsInNative = undefined;
    this.viewModel.endOfSeason = undefined;
    this.viewModel.totalAssets = undefined;
    this.viewModel.decRate = undefined;
    this.viewModel.spsRate = undefined;
    this.viewModel.players = undefined;
  }

  addNewAccount() {
    const addNewAccountModal = this.modalService.openModal(ModalIds.ADD_ACCOUNT_MODAL_ID);

    if (!addNewAccountModal) {
      return;
    }

    (addNewAccountModal as AddAccountModalComponent).setAddAccountModalListener(this);
    this.tokenService.getTokenDetails('xdasd');
  }

  confirmButtonClicked(username: string): void {
    this.refresh();
  }

  clearAccounts() {
    this.playerService.clearPlayers();
    this.refresh();
  }

  savedSettings(): void {
    this.refresh();
  }
}

class DashboardViewModel {
  totalAccounts?: string;
  totalDec?: string;
  totalDecInNative?: string;
  totalSps?: string;
  totalSpsInNative?: string;
  totalStakedSps?: string;
  totalStakedSpsInNative?: string;
  endOfSeason?: string;
  totalAssets?: string;
  decRate?: string;
  spsRate?: string;
  players?: PlayerTableData[];
}

